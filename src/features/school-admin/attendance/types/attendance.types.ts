export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: "present" | "absent" | "leave";
  remarks?: string;
}

export interface AttendanceGridRow {
  studentId: string;
  studentName: string;
  records: Array<{
    date: string;
    status: "present" | "absent" | "leave";
  }>;
}

export interface MarkAttendanceInput {
  date: string;
  records: Array<{
    studentId: string;
    status: "present" | "absent" | "leave";
    remarks?: string;
  }>;
}
