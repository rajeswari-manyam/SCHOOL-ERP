export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: "present" | "absent" | "late";
  remarks?: string;
}

export interface MarkAttendanceInput {
  studentId: string;
  date: string;
  status: "present" | "absent" | "late";
  remarks?: string;
}

export interface UpdateAttendanceInput extends Partial<MarkAttendanceInput> {}
