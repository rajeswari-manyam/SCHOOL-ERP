// ─── Attendance Types ─────────────────────────────────────────────────────────

export type AttendanceMethod = "WhatsApp" | "Web Form" | "Manual";
export type ClassStatus = "MARKED" | "NOT_MARKED";

export interface ClassAttendanceRow {
  classSec: string;
  teacherName: string;
  teacherInitials: string;
  teacherColor: string;
  total: number;
  present: number | null;
  absent: number | null;
  status: ClassStatus;
  method: AttendanceMethod | null;
  alertsSent: number;
  alertsTotal: number;
}

export interface AttendanceSummary {
  totalPresent: number;
  totalPresentChange: number;   // e.g. +2.4
  totalAbsent: number;
  totalAbsentChange: number;    // e.g. +9.8
  classesMarked: number;
  classesTotal: number;
  alertsSent: number;
  alertsTotal: number;
}

export interface AttendanceDay {
  date: string; // YYYY-MM-DD
  summary: AttendanceSummary;
  classes: ClassAttendanceRow[];
}

// History
export interface AttendanceTrendPoint {
  date: string;   // e.g. "05MAR"
  class6A: number;
  class7A: number;
  class8A: number;
  avg: number;
}

export interface ChronicAbsentee {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  className: string;
  absentDays: number;
  absentSeverity: "high" | "medium" | "low"; // red=8+, orange=6-7, yellow=5
  lastAbsent: string; // "Today", "5 Apr", etc.
  parentPhone: string;
}

export interface AttendanceHistory {
  dateRange: { from: string; to: string };
  selectedClass: string;
  monthlyAverage: number;
  improvementFromLastMonth: number;
  trendData: AttendanceTrendPoint[];
  chronicAbsentees: ChronicAbsentee[];
  actionRequired?: {
    className: string;
    message: string;
  };
}

// Holiday Calendar
export type HolidayType = "NATIONAL_HOLIDAY" | "PUBLIC_HOLIDAY" | "SCHOOL_EVENT" | "SCHOOL_DAY";

export interface Holiday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  type: HolidayType;
}

export interface HolidayCalendar {
  month: string;
  year: number;
  holidays: Holiday[];
  totalHolidaysThisYear: number;
  academicYear: string;
}

// Web Form (Mark Attendance)
export interface StudentAttendanceEntry {
  rollNo: string;
  name: string;
  isPresent: boolean;
}

export interface MarkAttendanceForm {
  class: string;
  section: string;
  date: string;
  students: StudentAttendanceEntry[];
}

export type AttendanceTab = "today" | "history" | "holiday";
