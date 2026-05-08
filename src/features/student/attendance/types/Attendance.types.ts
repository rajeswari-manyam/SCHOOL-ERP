export type AttendanceStatus = "present" | "absent" | "holiday";

export interface AttendanceDay {
  date: string;
  status: AttendanceStatus;
  whatsappTime?: string;
}

export interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  percentage: number;
}

export interface AttendanceData {
  studentName: string;
  className: string;
  academicYear: string;
  month: AttendanceSummary;
  year: AttendanceSummary;
  days: AttendanceDay[];
}