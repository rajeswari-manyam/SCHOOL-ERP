// teacher/attendance/types/attendance.types.ts

export type AttendanceMark = "P" | "A" | "H";   // Present | Absent | Half-Day
export type AttendanceStatus = "on_time" | "late" | "missed";
export type AttendanceMethod = "whatsapp" | "web";
export type CorrectionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AttendanceStudent {
  id: string;
  name: string;
  rollNo: string;
  waNumber: string;
}

export interface AbsentEntry {
  student: AttendanceStudent;
  alertSent: boolean;
  alertSentAt?: string;
}

export interface TodayAttendance {
  isMarked: boolean;
  markedAt?: string;          // "08:52 AM"
  method?: AttendanceMethod;
  presentCount?: number;
  absentCount?: number;
  halfDayCount?: number;
  totalStudents: number;
  classLabel: string;         // "10-A"
  date: string;               // ISO
  absentStudents: AbsentEntry[];
}

export interface AttendanceHistoryEntry {
  id: string;
  date: string;               // ISO
  classLabel: string;
  presentCount: number;
  absentCount: number;
  totalStudents: number;
  markedAt: string | null;
  method: AttendanceMethod | null;
  status: AttendanceStatus | null;
}

export interface MarkAttendancePayload {
  classId: string;
  date: string;
  records: { studentId: string; status: "PRESENT" | "ABSENT" | "HALF_DAY" }[];
}

export interface CorrectionRequestPayload {
  date: string;
  classId: string;
  studentId: string;
  currentMark: AttendanceMark;
  requestedMark: AttendanceMark;
  reason: string;
}

export interface CorrectionRequest {
  id: string;
  date: string;
  classLabel: string;
  studentName: string;
  currentMark: AttendanceMark;
  requestedMark: AttendanceMark;
  reason: string;
  status: CorrectionStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}