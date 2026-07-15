// teacher/attendance/types/attendance.types.ts

// ── API response type for /tenant/getteachertodayattendancesummary ──────────

export interface TodayAttendanceSummaryItem {
  totalStudents: number;
  presentCount?: number;
  absentCount?: number;
  halfDayCount?: number;
  isMarked: boolean;
  markedAt?: string;
  method?: string;
  date: string;
  className?: string;
  sectionName?: string;
  absentStudents?: Array<{
    id: string;
    name: string;
    rollNo: string;
    waNumber: string;
    alertSent: boolean;
    alertSentAt?: string;
  }>;
}

export type AttendanceStatus = "on_time" | "late" | "missed";
export type AttendanceMethod = "whatsapp" | "web";

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
  classId?: string;
  sectionId?: string;
  academicYearId?: string;
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
  sectionId: string;
  teacherId: string;
  academicYearId: string;
  date: string;
  records: { studentId: string; status: "PRESENT" | "ABSENT" | "HALF_DAY" }[];
}

