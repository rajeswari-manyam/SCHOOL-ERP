// src/features/student/dashboard/hooks/useDashboard.ts

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getStudentById } from "../../../../services/student.api";
import { getHomeworkThisWeek } from "../../../../services/homework.api";
import { getAllTimetable } from "../../../../services/timetable.api";
import { getAllExamTimetables } from "../../../../services/examtimetable.api";
import { getMonthlyAttendance, getStudentTodayAttendance } from "../../../../services/attendance.api";
import type {
  StatItem,
  AttendanceDay,
  ScheduleItem,
  HomeworkItem,
  RecentResult,
  Announcement,
} from "../types/dashboard.types";

interface DashboardState {
  loading: boolean;
  error: string | null;
  studentName: string;
  rollNumber: string;
  studentClass: string;
  studentSection: string;
  studentSchoolCode: string;
  stats: StatItem[];
  schedule: ScheduleItem[];
  homework: HomeworkItem[];
  attendance: AttendanceDay[];
  attendanceToday: number;
  attendanceMonthLabel: string;
  recentResult: RecentResult | null;
  announcements: Announcement[];
}

const SUBJECT_COLOR: Record<string, "blue" | "green" | "amber"> = {
  Mathematics: "blue",
  English: "green",
  Science: "amber",
  SST: "blue",
  Hindi: "green",
};

const DAY_MAP: Record<string, string> = {
  sun: "SUN", mon: "MON", tue: "TUE", wed: "WED", thu: "THU", fri: "FRI", sat: "SAT",
  sunday: "SUN", monday: "MON", tuesday: "TUE", wednesday: "WED", thursday: "THU",
  friday: "FRI", saturday: "SAT",
};

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// ── Build AttendanceDay[] from monthly API summary ──────────────────────
// API returns summary with present_dates and absent_dates arrays.
// We pad with `empty` cells for leading weekday offset, then fill
// the rest of the month with present / absent / holiday.
const buildCalendarDays = (
  presentDates: string[],
  absentDates: string[],
  year: number,
  month: number // 1-based
): AttendanceDay[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstWeekday = new Date(year, month - 1, 1).getDay(); // 0=Sun

  const presentSet = new Set(presentDates);
  const absentSet = new Set(absentDates);

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;

  const days: AttendanceDay[] = [];

  // Leading empty cells
  for (let i = 0; i < firstWeekday; i++) {
    days.push({ day: 0, status: "empty" });
  }

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (presentSet.has(dateStr)) {
      days.push({ day: d, status: "present" });
    } else if (absentSet.has(dateStr)) {
      days.push({ day: d, status: "absent" });
    } else if (isCurrentMonth && d > today.getDate()) {
      // Future day — show as holiday (greyed out)
      days.push({ day: d, status: "holiday" });
    } else {
      // Past day with no record — treat as holiday / school-off
      days.push({ day: d, status: "holiday" });
    }
  }

  return days;
};

// ── Compute monthly % from calendar days ──────────────────────────────────────
const calcMonthlyPercent = (days: AttendanceDay[]): number | null => {
  const present = days.filter((d) => d.status === "present").length;
  const absent = days.filter((d) => d.status === "absent").length;
  const total = present + absent;
  if (total === 0) return null;
  return Math.round((present / total) * 1000) / 10; // 1 decimal place
};

export const useDashboard = (): DashboardState => {
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
    attendanceToday: 0,
    attendanceMonthLabel: "",
    recentResult: null,
    announcements: [],
  });

  useEffect(() => {
    if (!authUser?.id) return;

    const load = async () => {
      try {
        const student = await getStudentById(authUser.id);

        const now = new Date();
        const currentMonth = now.getMonth() + 1; // 1-based
        const currentYear = now.getFullYear();

        const monthLabel = now.toLocaleDateString("en-IN", {
          month: "long",
          year: "numeric",
        });

        // Resolve class / section IDs — cascade through all shapes
        const classId =
          student.classDetail?.id ??
          (student as any).class?.id ??
          student.class_id ??
          "";

        const rawSectionId: string =
          student.sectionDetail?.id ??
          (student as any).section?.id ??
          student.sectionId ??
          "";
        const sectionId = rawSectionId.includes(":")
          ? rawSectionId.split(":")[1]
          : rawSectionId;

        const studentId = student.id ?? authUser.id;

        // ── Parallel fetches ──────────────────────────────────────────────
        let hwItems: HomeworkItem[] = [];
        let scheduleItems: ScheduleItem[] = [];
        let calendarDays: AttendanceDay[] = [];

        const fetches: Promise<any>[] = [
          // Monthly attendance — always try
          getMonthlyAttendance({
            studentId,
            month: currentMonth,
            year: currentYear,
          }).catch(() => null),
          // Today's attendance — always try
          getStudentTodayAttendance(studentId).catch(() => null),
        ];

        if (classId && sectionId) {
          fetches.push(
            getHomeworkThisWeek({ class_id: classId, section_id: sectionId }).catch(() => ({ data: [] })),
            getAllTimetable(classId, sectionId).catch(() => ({ data: [] })),
            getAllExamTimetables({ class_id: classId, section_id: sectionId }).catch(() => []),
          );
        }

        const [attendanceRes, todayAttendanceRes, hwRes, ttRes, examRes] = await Promise.all(fetches);

        // ── Map monthly attendance → calendar days ────────────────────────
        if (attendanceRes?.summary) {
          const { present_dates = [], absent_dates = [] } = attendanceRes.summary;
          calendarDays = buildCalendarDays(present_dates, absent_dates, currentYear, currentMonth);
        }

        // ── Map homework ──────────────────────────────────────────────────
        if (hwRes) {
          const todayStr = now.toISOString().slice(0, 10);
          hwItems = (hwRes.data ?? [])
            .filter((h: any) => h.is_published)
            .sort((a: any, b: any) => new Date(a.submission_date).getTime() - new Date(b.submission_date).getTime())
            .slice(0, 5)
            .map((h: any) => {
              const subName = h.subject?.name ?? "";
              return {
                id: h.id,
                subject: subName,
                title: h.title,
                dueDate: h.submission_date < todayStr ? "Overdue" : h.submission_date,
                colorType: SUBJECT_COLOR[subName] ?? "blue",
              };
            });
        }

        // ── Map today's timetable ─────────────────────────────────────────
        if (ttRes) {
          const todayDay = WEEKDAYS[now.getDay()];
          const todaySlots = (ttRes.data ?? [])
            .filter((s: any) => {
              const day = DAY_MAP[s.day_of_week?.toLowerCase()] ?? "";
              return day === todayDay;
            })
            .sort((a: any, b: any) => (a.period_no ?? 0) - (b.period_no ?? 0));

          scheduleItems = todaySlots.map((s: any) => ({
            period: `P${s.period_no}`,
            time: s.time_sloat ?? `${s.start_time ?? ""}–${s.end_time ?? ""}`,
            subject: s.subject?.subject_name ?? s.subjectname ?? "",
            teacher: s.teacher?.name ?? s.teachername ?? "",
          }));
        }

        // ── Find nearest upcoming exam ────────────────────────────────────
        let nextExamValue = "—";
        let nextExamExtra = "Upcoming";
        if (Array.isArray(examRes) && examRes.length > 0) {
          const todayStr = now.toISOString().slice(0, 10);
          const upcoming = examRes
            .filter((e: any) => e.exam_date >= todayStr)
            .sort((a: any, b: any) => a.exam_date.localeCompare(b.exam_date));
          if (upcoming.length > 0) {
            const next = upcoming[0];
            const examDate = new Date(next.exam_date);
            const dateStr = examDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
            nextExamValue = next.subject?.subject_name ?? "Exam";
            nextExamExtra = dateStr;
          }
        }

        // ── Today's attendance ──────────────────────────────────────────
        const todayStatus =
          todayAttendanceRes?.records?.[0]
            ? ["present", "late"].includes(
                (todayAttendanceRes.records[0].status ?? "").toLowerCase()
              )
              ? "Present"
              : "Absent"
            : "—";
        const todayExtra =
          todayStatus === "Present"
            ? "You're marked present today"
            : todayStatus === "Absent"
            ? "You're marked absent today"
            : "Attendance status";

        // ── Compute stats ─────────────────────────────────────────────────
        const monthlyPct = calcMonthlyPercent(calendarDays);
        const presentDays = calendarDays.filter((d) => d.status === "present").length;
        const absentDays = calendarDays.filter((d) => d.status === "absent").length;
        const totalDays = presentDays + absentDays;

        const stats: StatItem[] = [
          {
            title: "TODAY'S STATUS",
            value: todayStatus,
            extra: todayExtra,
            iconType: "attendance",
            badge: { text: "Live", variant: "green" },
          },
          {
            title: "ATTENDANCE MONTH",
            value: monthlyPct !== null ? `${monthlyPct}%` : "—",
            extra: `${presentDays}/${totalDays} days present`,
            iconType: "percent",
          },
          {
            title: "HOMEWORK DUE",
            value: hwItems.length > 0 ? String(hwItems.length) : "—",
            extra: "Pending tasks",
            iconType: "homework",
            badge: {
              text: hwItems.length > 0 ? "Due soon" : "All done",
              variant: hwItems.length > 0 ? "amber" : "green",
            },
          },
          {
            title: "NEXT EXAM",
            value: nextExamValue,
            extra: nextExamExtra,
            iconType: "exam",
          },
        ];

        setState({
          loading: false,
          error: null,
          studentName: `${student.first_name} ${student.last_name}`,
          rollNumber: student.roll_number || "",
          studentClass:
            student.classDetail?.class_name ??
            (student as any).class?.class_name ??
            "",
          studentSection:
            student.sectionDetail?.sectionName ??
            (student as any).section?.sectionName ??
            "",
          studentSchoolCode: student.school_code || "",
          stats,
          schedule: scheduleItems,
          homework: hwItems,
          attendance: calendarDays,
          attendanceToday: now.getDate(),
          attendanceMonthLabel: `My Attendance — ${monthLabel}`,
          recentResult: null,
          announcements: [],
        });
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error?.message || "Failed to load",
        }));
      }
    };

    load();
  }, [authUser?.id]);

  return state;
};
