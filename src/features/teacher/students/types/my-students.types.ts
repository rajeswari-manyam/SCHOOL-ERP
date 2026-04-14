export type FeeStatus = "PAID" | "PENDING" | "OVERDUE" | "PARTIAL";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "HALF_DAY" | "HOLIDAY" | "SUNDAY";
export type HomeworkStatus = "SUBMITTED" | "PENDING" | "LATE";

export interface AttendanceDay {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export interface StudentHomework {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  submittedDate?: string;
  status: HomeworkStatus;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  className: string; // e.g. "Class 8-A"
  section: string;
  isActive: boolean;
  attendancePct: number;
  feeStatus: FeeStatus;
  // parent info
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  // fee detail
  feeTotal: number;
  feePaid: number;
  feeDueDate: string;
  // detail data (lazy-loaded in real app)
  attendanceDays: AttendanceDay[];
  homework: StudentHomework[];
}

export interface MyStudentsFilters {
  search: string;
  feeStatus: FeeStatus | "ALL";
  attendanceRange: "ALL" | "BELOW_75" | "75_TO_90" | "ABOVE_90";
}
