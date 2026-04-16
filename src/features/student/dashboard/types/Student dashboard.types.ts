// ─── Attendance ────────────────────────────────────────────────────────────────
export type AttendanceStatus = "PRESENT" | "ABSENT" | "HOLIDAY" | "NONE";

export interface AttendanceDay {
  date: number;        // day of month
  status: AttendanceStatus;
  isToday?: boolean;
}

export interface AttendanceMonth {
  month: string;       // e.g. "April"
  year: number;
  days: AttendanceDay[];
  percentage: number;
  changeFromLastMonth: number; // e.g. +2.4
}

// ─── Schedule ──────────────────────────────────────────────────────────────────
export interface Period {
  id: string;
  label: string;       // "P1", "P2", …
  startTime: string;   // "08:30"
  endTime: string;     // "09:20"
  subject: string;
  teacher: string;
  isActive?: boolean;
}

export interface BreakSlot {
  label: string;       // "Short Break", "Lunch Interval"
  startTime: string;
  endTime: string;
}

export type ScheduleSlot = ({ kind: "period" } & Period) | ({ kind: "break" } & BreakSlot);

export interface TodaySchedule {
  date: string;        // ISO date string
  slots: ScheduleSlot[];
}

// ─── Homework ──────────────────────────────────────────────────────────────────
export interface HomeworkItem {
  id: string;
  subject: string;
  title: string;
  dueDate: string;     // ISO date string
  briefUrl?: string;
}

export interface HomeworkWeek {
  items: HomeworkItem[];
  totalDue: number;
}

// ─── Exam Results ──────────────────────────────────────────────────────────────
export type ExamResultStatus = "PASS" | "FAIL" | "DISTINCTION";

export interface ExamResult {
  id: string;
  examName: string;
  month: string;
  year: number;
  marksObtained: number;
  totalMarks: number;
  status: ExamResultStatus;
  rank: number;
  reportUrl?: string;
}

// ─── Announcement ──────────────────────────────────────────────────────────────
export interface Announcement {
  id: string;
  title: string;
  publishedAt: string; // ISO date string
  iconType: "sports" | "holiday" | "general" | "academic";
}

// ─── Student / Dashboard ───────────────────────────────────────────────────────
export interface StudentInfo {
  id: string;
  name: string;
  className: string;
  schoolName: string;
  rollNo: string;
  avatarUrl?: string;
}

export interface DashboardStatCards {
  todayStatus: "PRESENT" | "ABSENT" | "HOLIDAY";
  checkedInAt?: string;        // "08:15 AM"
  attendanceMonth: AttendanceMonth;
  homeworkDueCount: number;
  submissionPortalActive: boolean;
  nextExamDaysLeft: number;
  nextExamName: string;
}

export interface StudentDashboardResponse {
  student: StudentInfo;
  stats: DashboardStatCards;
  todaySchedule: TodaySchedule;
  homeworkWeek: HomeworkWeek;
  recentResults: ExamResult[];
  latestAnnouncements: Announcement[];
}