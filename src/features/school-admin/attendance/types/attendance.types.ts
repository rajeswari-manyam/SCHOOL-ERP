// ─── Primitives ───────────────────────────────────────────────────────────────

export type AttendanceStatus  = "MARKED" | "NOT_MARKED";
export type AttendanceMethod  = "WhatsApp" | "Web Form" | null;
export type AlertStatus       = "delivered" | "failed" | "pending" | null;
export type AbsenceSeverity   = "critical" | "high" | "medium";
export type HolidayType       = "National" | "State" | "School" | "Other";

// ─── Class-level row ──────────────────────────────────────────────────────────

export interface ClassAttendanceRow {
  id: string;
  cls: string;
  section: string;
  teacherInitials: string;
  teacherName: string;
  total: number;
  present: number | null;
  absent: number | null;
  status: AttendanceStatus;
  method: AttendanceMethod;
  alertsSent: string | null;
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
  initials: string;
  name: string;
  class: string;
  absentDays: number;
  severity: AbsenceSeverity;
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