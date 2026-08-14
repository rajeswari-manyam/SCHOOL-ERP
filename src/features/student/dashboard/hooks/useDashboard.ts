// src/features/student/dashboard/hooks/useDashboard.ts

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { getStudentById, type Student } from "../../../../services/student.api";
import { getHomeworkThisWeek, type Homework } from "../../../../services/homework.api";
import { getAllTimetable, type TimetableSlot } from "../../../../services/timetable.api";
import {
  getAllExamTimetables,
  type ExamTimetableListItem,
} from "../../../../services/examtimetable.api";
import {
  getMonthlyAttendance,
  getStudentTodayAttendance,
} from "../../../../services/attendance.api";
import type {
  AttendanceDay,
  ScheduleItem,
  HomeworkItem,
} from "../types/dashboard.types";

export const STUDENT_KEYS = {
  all: ["student", "dashboard"] as const,
  profile: (userId: string) => [...STUDENT_KEYS.all, "profile", userId] as const,
  attendance: (studentId: string, month: number, year: number) =>
    [...STUDENT_KEYS.all, "attendance", studentId, month, year] as const,
  homework: (classId: string, sectionId: string) =>
    [...STUDENT_KEYS.all, "homework", classId, sectionId] as const,
  schedule: (classId: string, sectionId: string) =>
    [...STUDENT_KEYS.all, "schedule", classId, sectionId] as const,
  exams: (classId: string, sectionId: string) =>
    [...STUDENT_KEYS.all, "exams", classId, sectionId] as const,
};

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
export const buildCalendarDays = (
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
export const calcMonthlyPercent = (days: AttendanceDay[]): number | null => {
  const present = days.filter((d) => d.status === "present").length;
  const absent = days.filter((d) => d.status === "absent").length;
  const total = present + absent;
  if (total === 0) return null;
  return Math.round((present / total) * 1000) / 10; // 1 decimal place
};

export interface StudentProfile {
  studentId: string;
  studentName: string;
  rollNumber: string;
  studentClass: string;
  studentSection: string;
  studentSchoolCode: string;
  classId: string;
  sectionId: string;
}

/** Raw API responses sometimes embed `class` / `section` directly. */
type StudentWithNestedClass = Student & {
  class?: { id?: string; class_name?: string };
  section?: { id?: string; sectionName?: string };
};

// ── Student identity + class/section resolution ───────────────────────────────
export const useStudentProfile = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");

  return useQuery({
    queryKey: STUDENT_KEYS.profile(userId),
    queryFn: async (): Promise<StudentProfile> => {
      const raw = await getStudentById(userId);
      const student = raw as StudentWithNestedClass;

      // Resolve class / section IDs — cascade through all shapes
      const classId =
        student.classDetail?.id ??
        student.class?.id ??
        student.class_id ??
        "";

      const rawSectionId: string =
        student.sectionDetail?.id ??
        student.section?.id ??
        student.sectionId ??
        "";
      const sectionId = rawSectionId.includes(":")
        ? rawSectionId.split(":")[1]
        : rawSectionId;

      return {
        studentId: student.id ?? userId,
        studentName: `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim(),
        rollNumber: student.roll_number || "",
        studentClass:
          student.classDetail?.class_name ??
          student.class?.class_name ??
          "",
        studentSection:
          student.sectionDetail?.sectionName ??
          student.section?.sectionName ??
          "",
        studentSchoolCode: student.school_code || "",
        classId,
        sectionId,
      };
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60_000,
    retry: 2,
  });
};

// ── Attendance (monthly calendar + today's status) ────────────────────────────
export const useStudentAttendance = (studentId: string) => {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-based
  const year = now.getFullYear();
  const monthLabel = now.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return useQuery({
    queryKey: STUDENT_KEYS.attendance(studentId, month, year),
    queryFn: async () => {
      const [attendanceRes, todayAttendanceRes] = await Promise.all([
        getMonthlyAttendance({
          studentId,
          month,
          year,
        }).catch(() => null),
        getStudentTodayAttendance(studentId).catch(() => null),
      ]);

      // ── Map monthly attendance → calendar days ─────────────────────────
      let calendarDays: AttendanceDay[] = [];
      if (attendanceRes?.summary) {
        const { present_dates = [], absent_dates = [] } = attendanceRes.summary;
        calendarDays = buildCalendarDays(present_dates, absent_dates, year, month);
      }

      // ── Today's attendance ─────────────────────────────────────────────
      const todayStatus = todayAttendanceRes?.records?.[0]
        ? ["present", "late"].includes(
            (todayAttendanceRes.records[0].status ?? "").toLowerCase()
          )
          ? "Present"
          : "Absent"
        : "—";

      const presentDays = calendarDays.filter((d) => d.status === "present").length;
      const absentDays = calendarDays.filter((d) => d.status === "absent").length;
      const totalDays = presentDays + absentDays;
      const monthlyPct = calcMonthlyPercent(calendarDays);

      return {
        calendarDays,
        todayStatus,
        todayExtra:
          todayStatus === "Present"
            ? "You're marked present today"
            : todayStatus === "Absent"
            ? "You're marked absent today"
            : "Attendance status",
        monthlyPct,
        monthSummary: `${presentDays}/${totalDays} days present`,
        todayDate: now.getDate(),
        monthLabel: `My Attendance — ${monthLabel}`,
      };
    },
    enabled: Boolean(studentId),
    staleTime: 60_000,
    retry: 2,
  });
};

// ── Homework due this week ────────────────────────────────────────────────────
export const useStudentHomework = (classId: string, sectionId: string) => {
  return useQuery({
    queryKey: STUDENT_KEYS.homework(classId, sectionId),
    queryFn: async (): Promise<HomeworkItem[]> => {
      const hwRes = await getHomeworkThisWeek({
        class_id: classId,
        section_id: sectionId,
      }).catch(() => ({ data: [] as Homework[] }));

      const todayStr = new Date().toISOString().slice(0, 10);
      return (hwRes.data ?? [])
        .filter((h: Homework) => h.is_published)
        .sort((a, b) => new Date(a.submission_date).getTime() - new Date(b.submission_date).getTime())
        .slice(0, 5)
        .map((h) => {
          const subName = h.subject?.name ?? "";
          return {
            id: h.id,
            subject: subName,
            title: h.title,
            dueDate: h.submission_date < todayStr ? "Overdue" : h.submission_date,
            colorType: SUBJECT_COLOR[subName] ?? "blue",
          };
        });
    },
    enabled: Boolean(classId && sectionId),
    staleTime: 2 * 60_000,
    retry: 2,
  });
};

// ── Today's timetable ─────────────────────────────────────────────────────────
export const useStudentSchedule = (classId: string, sectionId: string) => {
  return useQuery({
    queryKey: STUDENT_KEYS.schedule(classId, sectionId),
    queryFn: async (): Promise<ScheduleItem[]> => {
      const ttRes = await getAllTimetable(classId, sectionId).catch(() => ({
        status: false,
        count: 0,
        data: [] as TimetableSlot[],
      }));

      const now = new Date();
      const todayDay = WEEKDAYS[now.getDay()];
      const todaySlots = (ttRes.data ?? [])
        .filter((s: TimetableSlot) => {
          const day = DAY_MAP[s.day_of_week?.toLowerCase()] ?? "";
          return day === todayDay;
        })
        .sort((a, b) => (a.period_no ?? 0) - (b.period_no ?? 0));

      return todaySlots.map((s: TimetableSlot) => ({
        period: `P${s.period_no}`,
        time: s.time_sloat ?? `${s.start_time ?? ""}–${s.end_time ?? ""}`,
        subject: s.subject?.subject_name ?? s.subjectname ?? "",
        teacher: s.teacher?.name ?? s.teachername ?? "",
      }));
    },
    enabled: Boolean(classId && sectionId),
    staleTime: 5 * 60_000,
    retry: 2,
  });
};

// ── Upcoming exams ────────────────────────────────────────────────────────────
export interface UpcomingExam {
  subject: string;
  examDate: string; // ISO date
}

export const useStudentExams = (classId: string, sectionId: string) => {
  return useQuery({
    queryKey: STUDENT_KEYS.exams(classId, sectionId),
    queryFn: async (): Promise<UpcomingExam[]> => {
      const examRes = await getAllExamTimetables({
        class_id: classId,
        section_id: sectionId,
      }).catch(() => [] as ExamTimetableListItem[]);

      if (!Array.isArray(examRes) || examRes.length === 0) return [];

      return examRes
        .filter((e) => Boolean(e.exam_date))
        .sort((a, b) => a.exam_date.localeCompare(b.exam_date))
        .map((e) => ({
          subject: e.subject?.subject_name ?? "Exam",
          examDate: e.exam_date,
        }));
    },
    enabled: Boolean(classId && sectionId),
    staleTime: 5 * 60_000,
    retry: 2,
  });
};
