export type AttendanceStatus = "MARKED" | "NOT_MARKED";
export type AttendanceMethod = "WhatsApp" | "Web Form" | null;

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

export interface AttendanceStats {
  totalPresent: number;
  presentDelta: string;
  totalAbsent: number;
  absentDelta: string;
  classesMarked: number;
  totalClasses: number;
  alertsSent: number;
  totalAlerts: number;
}

export interface AttendancePageData {
  date: string;
  stats: AttendanceStats;
  rows: ClassAttendanceRow[];
  whatsappNumber: string;
}