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

// Staff Attendance
export type StaffAttendanceStatus = "present" | "absent" | "late" | "leave" | "halfday";

export interface StaffAttendanceEntry {
  staffId: string;
  name: string;
  initials: string;
  avatarColor: string;
  role: string;
  department: "teaching" | "non-teaching" | "admin";
  subject?: string;
  status: StaffAttendanceStatus;
  timeIn?: string;
  leaveType?: string;
}

export interface CreateStaffAttendancePayload {
  attendance_records: {
    staff_id: string;
    date: string;
    status: "present" | "absent" | "late" | "leave";
    working_day: boolean;
    remarks?: string;
  }[];
}

export type AttendanceTab = "today" | "history" | "holiday" | "staff";

export interface CreateHolidayPayload {
  holidayname: string;
  date: string;
  type: string;
  note: string;
  school_code: string;
}

// ─── GET /tenant/getallclassestodayattendance ─────────────────────────────
export interface ClassTodayItem {
  class: { id: string; name: string };
  section: { id: string; name: string };
  attendance_status: string;
  total_students: number;
  present_students: number;
  absent_students: number;
}

export interface GetAllClassesTodayAttendanceResponse {
  status: boolean;
  date: string;
  total_classes: number;
  data: ClassTodayItem[];
}

// ─── GET /tenant/getclasstodayattendance?class_id=...&section_id=... ─────
export interface ClassTodayStudentRecord {
  id: string;
  student_name: string;
  roll_no: string;
  attendance_status: "present" | "absent" | "late";
}

export interface GetClassTodayAttendanceResponse {
  status: boolean;
  date: string;
  attendance_status: string;
  class: { id: string; name: string };
  section: { id: string; name: string };
  total_students: number;
  present_students: number;
  absent_students: number;
  students: ClassTodayStudentRecord[];
}

// ─── Raw item from GET /tenant/getallattendance?className=...&section=... ───
export interface GetAllAttendanceRawItem {
  student_id?: string;
  _id?: string;
  id?: string;
  name?: string;
  student_name?: string;
  roll_no?: string;
  rollNo?: string;
  className?: string;
  class_name?: string;
  section?: string;
  section_name?: string;
  date?: string;
  attendance_date?: string;
  status?: string;
  attendance_status?: string;
  is_present?: boolean;
  isPresent?: boolean;
  teacher_name?: string;
  teachername?: string;
}

export interface GetAllAttendanceResponse {
  status?: boolean;
  message?: string;
  data?: GetAllAttendanceRawItem[] | GetAllAttendanceRawItem;
  attendance?: GetAllAttendanceRawItem[];
  result?: GetAllAttendanceRawItem[];
  records?: GetAllAttendanceRawItem[];
  entries?: GetAllAttendanceRawItem[];
}

// ─── GET /tenant/getallholidays ─────────────────────────────────────────────
export interface GetAllHolidaysResponse {
  status?: boolean;
  message?: string;
  data?: {
    holidays: Holiday[];
    totalHolidaysThisYear: number;
    academicYear: string;
  };
  holidays?: Holiday[];
  totalHolidaysThisYear?: number;
  academicYear?: string;
}