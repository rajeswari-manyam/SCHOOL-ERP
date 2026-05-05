// ─── Primitives ───────────────────────────────────────────────────────────────

export type AttendanceStatus  = "MARKED" | "NOT_MARKED";
export type AttendanceMethod  = "WhatsApp" | "Web Form" | null;
export type AlertStatus       = "delivered" | "failed" | "pending" | null;
export type AbsenceSeverity   = "critical" | "high" | "medium" | "warning" | "moderate";
export type HolidayType       = "National" | "State" | "School" | "Other";
export type ClassStatus       = "marked" | "not_marked" | "partial";

// ─── Teacher ─────────────────────────────────────────────────────────────────

export interface ClassTeacher {
  id: string;
  name: string;
  phone?: string;
}

// ─── Summary ─────────────────────────────────────────────────────────────────

export interface TodaySummary {
  totalStudents: number;
  present: number;
  absent: number;
  marked: number;
  notMarked: number;
}

// ─── Class Attendance Detail ────────────────────────────────────────────────

export interface ClassAttendanceDetail {
  classId: string;
  className: string;
  section: string;
  teacher: ClassTeacher;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  markedAt: string | null;
  method: AttendanceMethod;
  students: WebFormStudent[];
}

// ─── Web Form Student ────────────────────────────────────────────────────────

export interface WebFormStudent {
  id: number;
  rollNumber: string;
  name: string;
  present: boolean;
  parentPhone?: string;
}

// ─── Class-level row ──────────────────────────────────────────────────────────

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

// ─── Student-level ────────────────────────────────────────────────────────────

export interface Student {
  id: number;
  roll: string;
  name: string;
  present: boolean;
  alertStatus: AlertStatus;
}

export interface ClassDetail {
  id: string;
  label: string;
  teacher: string;
  markedAt: string;
  present: number;
  absent: number;
  students: Student[];
}

// ─── Chronic absentee ─────────────────────────────────────────────────────────

export interface ChronicAbsentee {
  id: string;
  initials: string;
  name: string;
  class: string;
  absentDays: number;
  severity: AbsenceSeverity;
  lastAbsent?: string;
  parentContact?: string;
}

// ─── Holiday ──────────────────────────────────────────────────────────────────

export interface Holiday {
  id: string;
  date: string;
  name: string;
  type: HolidayType;
}

// ─── History & trends ─────────────────────────────────────────────────────────

export interface AttendanceHistoryFilters {
  dateFrom: string;
  dateTo: string;
  classId?: string;
}

export interface AttendanceTrendPoint {
  date: string;
  present: number;
  absent: number;
  total: number;
  avg?: number;
  [key: string]: string | number | undefined;
}

// ─── Page data ────────────────────────────────────────────────────────────────

export interface AttendancePageData {
  date: string;
  whatsappNumber: string;
  stats: {
    totalPresent: number;
    presentDelta: string;
    totalAbsent: number;
    absentDelta: string;
    classesMarked: number;
    totalClasses: number;
    alertsSent: number;
    totalAlerts: number;
  };
  rows: ClassAttendanceRow[];
}

// ─── Forms ────────────────────────────────────────────────────────────────────

export interface MarkAttendanceFormValues {
  classId: string;
  presentStudentIds: number[];
}
