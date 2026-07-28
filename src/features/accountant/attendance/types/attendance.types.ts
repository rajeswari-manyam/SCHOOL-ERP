export interface AttendanceDayRecord {
  id: string;
  staff_id: string;
  date: string;
  status: "present" | "absent" | "late" | "leave" | "halfday";
  working_day: boolean;
  remarks: string | null;
}

export interface AttendanceSummary {
  totalDaysInMonth: number;
  workingDays: number;
  present: number;
  absent: number;
  halfday: number;
  leave: number;
  markedDays: number;
  unmarkedDays: number;
}

export interface MonthlyAttendanceResponse {
  status: boolean;
  staff_id: string;
  month: number;
  year: number;
  summary: AttendanceSummary;
  records: AttendanceDayRecord[];
}
