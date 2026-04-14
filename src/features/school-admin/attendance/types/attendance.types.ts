// attendance/types/attendance.types.ts

export type AttendanceMethod   = "WhatsApp" | "Web Form";
export type ClassStatus        = "MARKED" | "NOT_MARKED";
export type HolidayType        = "SCHOOL_DAY" | "NATIONAL_HOLIDAY" | "PUBLIC_HOLIDAY" | "SCHOOL_EVENT" | "SUNDAY_WEEKEND";
export type AlertStatus        = "delivered" | "failed" | "pending" | "not_sent";
export type StudentMark        = "PRESENT" | "ABSENT";

// ── Today ─────────────────────────────────────────────────────────────────────
export interface ClassTeacher {
  initials: string;
  name: string;
  color: string; // tailwind bg colour class
}

export interface ClassAttendanceRow {
  id: string;
  classSection: string;   // "6A"
  teacher: ClassTeacher;
  total: number;
  present: number | null;
  absent: number | null;
  status: ClassStatus;
  method: AttendanceMethod | null;
  alertsSent: number | null;
  alertsTotal: number | null;
}

export interface TodaySummary {
  totalPresent: number;
  presentDelta: number;         // percentage change
  totalAbsent: number;
  absentDelta: number;
  classesMarked: number;
  classesTotal: number;
  alertsSent: number;
  alertsTotal: number;
}

// ── Class Detail drawer ────────────────────────────────────────────────────────
export interface StudentAttendanceDetail {
  id: string;
  name: string;
  rollNo: string;
  avatarUrl?: string;
  initials: string;
  mark: StudentMark;
  alertStatus: AlertStatus;
}

export interface ClassAttendanceDetail {
  classSection: string;
  date: string;
  teacherName: string;
  method: AttendanceMethod;
  markedAt: string;
  presentCount: number;
  absentCount: number;
  alertsSent: number;
  alertsTotal: number;
  students: StudentAttendanceDetail[];
}

// ── History ───────────────────────────────────────────────────────────────────
export interface AttendanceTrendPoint {
  date: string;          // "05 Mar", "10 Mar" etc
  "6A": number;
  "7A": number;
  "8A": number;
  avg: number;
}

export interface ChronicAbsentee {
  id: string;
  initials: string;
  name: string;
  class: string;
  absentDays: number;
  severity: "critical" | "warning" | "moderate"; // red / orange / yellow
  lastAbsent: string;   // "Today" | "5 Apr"
  parentContact: string;
}

// ── Holiday Calendar ──────────────────────────────────────────────────────────
export interface Holiday {
  id: string;
  name: string;
  date: string;          // ISO YYYY-MM-DD
  type: HolidayType;
  repeatAnnually: boolean;
  notes?: string;
}

// ── Web Form ──────────────────────────────────────────────────────────────────
export interface WebFormStudent {
  id: string;
  rollNo: string;
  name: string;
  present: boolean;
}
