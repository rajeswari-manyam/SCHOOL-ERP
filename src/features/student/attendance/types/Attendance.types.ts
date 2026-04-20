// ─── Attendance Status ──────────────────────────────────────────────────────────
export type AttendanceStatus = "PRESENT" | "ABSENT" | "HOLIDAY" | "NONE";

export interface AttendanceDay {
  date: number;         // day of month
  status: AttendanceStatus;
  isToday?: boolean;
  alertSentAt?: string; // e.g. "9:12 AM" — only for ABSENT
  alertChannel?: "WhatsApp" | "SMS"; // channel used for alert
}

export interface MonthAttendance {
  month: string;        // e.g. "April"
  year: number;
  days: AttendanceDay[];
  totalSchoolDays: number;
  daysPresent: number;
  daysAbsent: number;
  percentage: number;
}

export interface YearAttendance {
  academicYear: string; // e.g. "2024-25"
  totalSchoolDays: number;
  daysPresent: number;
  daysAbsent: number;
  percentage: number;
}

// ─── Attendance Policy ─────────────────────────────────────────────────────────
export interface AttendancePolicy {
  minimumPercentage: number;    // e.g. 75
  canMissMoreDays: number;      // days still can be missed
  safetyMargin: number;         // how many % above minimum
  status: "SAFE" | "AT_RISK" | "DANGER";
}

// ─── Absent Day Detail ─────────────────────────────────────────────────────────
export interface AbsentDayDetail {
  date: string;         // e.g. "5 April 2025 (Saturday)"
  alertSentAt: string;  // e.g. "9:12 AM"
  alertChannel: "WhatsApp" | "SMS";
}

// ─── Student Info ──────────────────────────────────────────────────────────────
export interface StudentInfo {
  id: string;
  name: string;
  className: string;
  academicYear: string;
  rollNo: string;
  schoolName: string;
}

// ─── Full Attendance Dashboard ─────────────────────────────────────────────────
export interface AttendanceDashboardResponse {
  student: StudentInfo;
  currentMonth: MonthAttendance;
  yearSummary: YearAttendance;
  policy: AttendancePolicy;
  absentDays: AbsentDayDetail[];
  motivationalMessage: string;
  selectedMonth: string; // display label e.g. "April 2025"
}