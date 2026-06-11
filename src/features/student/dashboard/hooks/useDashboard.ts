// src/features/dashboard/hooks/useDashboard.ts
// user.id from auth store IS the studentId — used directly with getstudentsById.

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

// ── API imports ───────────────────────────────────────────────────────────────
import { getAnnouncementsByType }                      from "../../../../services/announcements.api";
import { getWeeklyAttendance, getMonthlyAttendance }   from "../../../../services/attendance.api";
import { getHomeworkByClass }                          from "../../../../services/homework.api";
import type { Homework }                               from "../../../../services/homework.api";
import { getAllExamTimetables } from "../../../../services/examtimetable.api"
import { getAllResults }                                from "../../../../services/results.api";
import { getAllTimetable }                              from "../../../../services/timetable.api";
import { getStudentById }                              from "../../../../services/student.api";
import { getClassById }                                from "../../../../services/class.api";
import { getSectionById }                              from "../../../../services/section.api";

// ── Dashboard-local types ─────────────────────────────────────────────────────
import type {
  StatItem,
  ScheduleItem,
  HomeworkItem,
  AttendanceDay,
  RecentResult,
  Announcement,
} from "../types/dashboard.types";

// ── Helpers ───────────────────────────────────────────────────────────────────

const toScheduleItems = (
  slots: Awaited<ReturnType<typeof getAllTimetable>>["data"],
  today: string
): ScheduleItem[] => {
  const daySlots = slots
    .filter((s) => s.day_of_week.toLowerCase() === today.toLowerCase())
    .sort((a, b) => a.period_no - b.period_no);

  const rows: ScheduleItem[] = [];
  for (let i = 0; i < daySlots.length; i++) {
    const slot = daySlots[i];
    if (
      i > 0 &&
      slot.lunch_start &&
      slot.start_time >= slot.lunch_start &&
      daySlots[i - 1].end_time <= slot.lunch_start
    ) {
      rows.push({
        period: "",
        time: `${slot.lunch_start} – ${slot.lunch_end}`,
        subject: "",
        teacher: "",
        isBreak: true,
        breakLabel: `Lunch Interval (${slot.lunch_start} – ${slot.lunch_end})`,
      });
    }
    rows.push({
      period: `P${slot.period_no}`,
      time: `${slot.start_time} – ${slot.end_time}`,
      subject: slot.subjectname,
      teacher: slot.teachername,
    });
  }
  return rows;
};

const todayDow = (): string =>
  new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

const fmt = (d: Date) => d.toISOString().split("T")[0];

const currentWeek = (): { start: string; end: string } => {
  const now = new Date();
  const day = now.getDay();
  const mon = new Date(now);
  mon.setDate(now.getDate() - ((day + 6) % 7));
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  return { start: fmt(mon), end: fmt(sun) };
};

const toHomeworkItems = (list: Homework[]): HomeworkItem[] => {
  const colors: HomeworkItem["colorType"][] = ["blue", "green", "amber"];
  return list.slice(0, 3).map((hw, i) => ({
    id: hw.id,
    subject: "Subject", // until you map subject_id → name
    title: hw.title,
    dueDate: hw.submission_date
      ? new Date(hw.submission_date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—",
    colorType: colors[i % colors.length],
  }));
};

const toAttendanceDays = (
  records: any,
  year: number,
  month: number
): AttendanceDay[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDow = new Date(year, month - 1, 1).getDay();

  const days: AttendanceDay[] = [];
  for (let i = 0; i < firstDow; i++) {
    days.push({ day: 0, status: "empty" });
  }

  const lookup: Record<number, "present" | "absent" | "holiday"> = {};
  if (Array.isArray(records?.records)) {
    for (const r of records.records as { date: string; status: string }[]) {
      const d = new Date(r.date).getDate();
      const s = r.status?.toLowerCase();
      lookup[d] =
        s === "present" ? "present"
        : s === "absent" ? "absent"
        : "holiday";
    }
  }

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;
  const todayDate = today.getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month - 1, d).getDay();
    if (dow === 0 || dow === 6) {
      days.push({ day: d, status: "holiday" });
    } else if (isCurrentMonth && d > todayDate) {
      days.push({ day: d, status: "empty" });
    } else {
      days.push({ day: d, status: lookup[d] ?? "empty" });
    }
  }

  return days;
};

// ── State shape ───────────────────────────────────────────────────────────────

interface DashboardState {
  loading: boolean;
  error: string | null;

  // Student info (from API)
  studentName: string;
  rollNumber: string;
  studentClass: string;
  studentSection: string;
  studentSchoolCode: string;

  // Widget data
  stats: StatItem[];
  schedule: ScheduleItem[];
  homework: HomeworkItem[];
  attendance: AttendanceDay[];
  attendanceToday: number;
  attendanceMonthLabel: string;
  recentResult: RecentResult | null;
  announcements: Announcement[];
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useDashboard = (): DashboardState => {
  // Pull logged-in user from Zustand auth store
  const authUser = useAuthStore((s) => s.user);

  const [state, setState] = useState<DashboardState>({
    loading: true,
    error: null,
    studentName: "",
    rollNumber: "",
    studentClass: "",
    studentSection: "",
    studentSchoolCode: "",
    stats: [],
    schedule: [],
    homework: [],
    attendance: [],
    attendanceToday: new Date().getDate(),
    attendanceMonthLabel: "",
    recentResult: null,
    announcements: [],
  });

  useEffect(() => {
    if (!authUser?.id) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Not authenticated.",
      }));
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
            // Step 1: student profile
        const studentId = authUser.id;
        const apiStudent = await getStudentById(studentId);

        if (!apiStudent) throw new Error("Could not load student profile.");

        const classId    = apiStudent.class_id ?? "";
        const sectionId  = apiStudent.sectionId ?? "";
        const schoolCode = apiStudent.school_code;
        const rollNumber = apiStudent.roll_number;
        const studentName = `${apiStudent.first_name} ${apiStudent.last_name}`;

        // Step 2: resolve human-readable class & section names via dedicated APIs
        // GET /tenant/getclassById/:id  -> { data: { class_name: "9th" } }
        // GET /tenant/getsections/:id   -> { data: { sectionName: "A" } }
        const [classRes, sectionRes] = await Promise.allSettled([
          classId   ? getClassById(classId)     : Promise.resolve(null),
          sectionId ? getSectionById(sectionId) : Promise.resolve(null),
        ]);

        const className =
          classRes.status === "fulfilled" && classRes.value
            ? (classRes.value.data?.class_name ?? classId)
            : classId;

        const sectionName =
          sectionRes.status === "fulfilled" && sectionRes.value
            ? (sectionRes.value.sectionName ?? sectionId)
            : sectionId;

        // classNum/sec still needed for timetable & exam timetable APIs
        const cleanSection = sectionId.split(":")[0].trim();
        const classNum = classId.replace(/[A-Za-z]+$/, "");
        const sec      = classId.match(/[A-Za-z]+$/)?.[0] ?? cleanSection;

                // ── Step 3: all widget data in parallel ───────────────────────────
        const now   = new Date();
        const year  = now.getFullYear();
        const month = now.getMonth() + 1;
        const { start, end } = currentWeek();

        const [
          announcementsRes,
          weeklyAttendanceRes,
          monthlyAttendanceRes,
          homeworkRes,
          examTimetableRes,
          resultsRes,
          timetableRes,
        ] = await Promise.allSettled([
          getAnnouncementsByType("All"),
          getWeeklyAttendance({ studentId: studentId ?? "", start_date: start, end_date: end }),
          getMonthlyAttendance({ studentId: studentId ?? "", month, year }),
          getHomeworkByClass({ class_id: classId, section_id: sectionId }),
         classNum && sec ? getAllExamTimetables({ class_id: classNum, section_id: sec }) : Promise.resolve({ data: [] } as any),
          getAllResults(),
          classNum && sec ? getAllTimetable(classNum, sec) : Promise.resolve({ data: [] } as any),
        ]);

        if (cancelled) return;

        // ── Announcements ─────────────────────────────────────────────────
        const announcementData =
          announcementsRes.status === "fulfilled"
            ? announcementsRes.value.data : [];
        const announcements: Announcement[] = announcementData.map((a) => ({
          id: a.id,
          title: a.title,
          timeAgo: new Date(a.created_at).toLocaleDateString("en-IN", {
            day: "numeric", month: "short",
          }),
          type: "info" as const,
        }));

        // ── Weekly attendance (stat card) ─────────────────────────────────
        const weeklyData =
          weeklyAttendanceRes.status === "fulfilled"
            ? weeklyAttendanceRes.value : null;
        const presentCount = weeklyData?.summary?.present ?? 0;
        const totalCount   = weeklyData?.summary?.total   ?? 5;
        const attendancePct =
          totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

        const todayStr    = fmt(now);
        const todayRecord = weeklyData?.records?.find(
          (r) => r.date.startsWith(todayStr)
        );
        const todayStatus =
          todayRecord?.status?.toLowerCase() === "present" ? "Present"
          : todayRecord?.status?.toLowerCase() === "absent"  ? "Absent"
          : "—";

        // ── Monthly attendance calendar ───────────────────────────────────
        const monthlyRaw =
          monthlyAttendanceRes.status === "fulfilled"
            ? monthlyAttendanceRes.value : null;
        const attendanceDays = toAttendanceDays(monthlyRaw, year, month);
        const monthLabel = now.toLocaleDateString("en-IN", {
          month: "long", year: "numeric",
        });

        // ── Homework ──────────────────────────────────────────────────────
        const homeworkData: Homework[] =
          homeworkRes.status === "fulfilled" ? homeworkRes.value.data : [];
        const homework = toHomeworkItems(homeworkData);

        // ── Next exam ─────────────────────────────────────────────────────
        const examData =
          examTimetableRes.status === "fulfilled"
            ? examTimetableRes.value.data : [];
        const upcomingExams = examData
          .filter((e: any) => new Date(e.exam_date) >= now)
          .sort((a: any, b: any) =>
            new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
          );
        const nextExam    = upcomingExams[0] ?? null;
        const daysToExam  = nextExam
          ? Math.ceil(
              (new Date(nextExam.exam_date).getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24)
            )
          : null;

        // ── Results ───────────────────────────────────────────────────────
        const resultsData =
          resultsRes.status === "fulfilled" ? resultsRes.value.data : [];
        const studentResults = resultsData.filter(
          (r) => r.student_id === studentId
        );
        const latestResult = studentResults[studentResults.length - 1] ?? null;
        const recentResult: RecentResult | null = latestResult
          ? {
              testName: latestResult.examName ?? latestResult.exam_type,
              date: new Date(latestResult.createdAt).toLocaleDateString(
                "en-IN", { month: "short", year: "numeric" }
              ),
              score: latestResult.marks,
              total: 100,
              passed: latestResult.grade !== "F" && !latestResult.absent,
              rank: 0,
            }
          : null;

        // ── Timetable ─────────────────────────────────────────────────────
        const timetableData =
          timetableRes.status === "fulfilled" ? timetableRes.value.data : [];
        const schedule = toScheduleItems(timetableData, todayDow());

        // ── Stat cards ────────────────────────────────────────────────────
        const stats: StatItem[] = [
          {
            title: "Today's Status",
            value: todayStatus,
            extra: todayRecord
              ? `Recorded for ${new Date(todayRecord.date).toLocaleDateString(
                  "en-IN", { day: "2-digit", month: "short" }
                )}`
              : "No record today",
            type: "attendance",
            iconType: "attendance",
          },
          {
            title: "Attendance This Week",
            value: `${attendancePct}%`,
            extra: `${presentCount} of ${totalCount} days present`,
            iconType: "percent",
          },
          {
            title: "Homework Due",
            value: homework.length > 0 ? `${homework.length} this week` : "None due",
            extra: homework.length > 0 ? `Next: ${homework[0].subject}` : "All caught up!",
            iconType: "homework",
          },
          {
            title: "Next Exam",
            value: daysToExam !== null ? `${daysToExam} days` : "No exams",
            extra: nextExam
              ? `${nextExam.subjectname} – ${nextExam.exam_name}`
              : "Schedule clear",
            iconType: "exam",
          },
        ];

        setState({
          loading: false,
          error: null,
          studentName,
          rollNumber,
          studentClass: className,
          studentSection: sectionName,
          studentSchoolCode: schoolCode,
          stats,
          schedule,
          homework,
          attendance: attendanceDays,
          attendanceToday: now.getDate(),
          attendanceMonthLabel: `My Attendance – ${monthLabel}`,
          recentResult,
          announcements,
        });
      } catch (err: any) {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: err?.message ?? "Failed to load dashboard.",
          }));
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, [authUser?.id]);

  return state;
};