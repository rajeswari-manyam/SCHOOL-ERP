export type AttendanceMarkStatus = "MARKED" | "NOT_MARKED";
export type LeaveStatus = "APPROVED" | "PENDING" | "REJECTED";
export type PeriodStatus = "CURRENT" | "COMPLETED" | "UPCOMING";

export interface TeacherProfile {
  id: string;
  name: string;
  subject: string;
  classTeacherOf?: string; // e.g. "Class 8-A"
  schoolName: string;
}

export interface AttendanceBanner {
  status: AttendanceMarkStatus;
  markedAt?: string;
  presentCount?: number;
  absentCount?: number;
  halfDayCount?: number;
  totalStudents: number;
}

export interface TeacherStatCard {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}

export interface Period {
  id: string;
  time: string;
  subject: string;
  class: string;
  room: string;
  status: PeriodStatus;
}

export interface HomeworkItem {
  id: string;
  subject: string;
  class: string;
  dueDate: string;
  submittedCount: number;
  totalCount: number;
  title: string;
}

// ── Pending Homework (dedicated endpoint) ─────────────────────────────────

export interface PendingHomeworkApiItem {
  id: string;
  class?: { id: string; name: string };
  section?: { id: string; name: string };
  subject?: { id: string; name: string };
  className?: string;
  sectionName?: string;
  subjectName?: string;
  teacher_id: string;
  title: string;
  description: string;
  submission_date: string;
  attachments: string[];
  is_published: boolean;
  school_code: string;
  submittedCount: number;
  totalCount: number;
  createdAt: string;
}

export interface PendingHomeworkResponse {
  status: boolean;
  message?: string;
  data?: PendingHomeworkApiItem | PendingHomeworkApiItem[];
}

// ── All Homework (GET /tenant/getallhomework) ──────────────────────────

export interface AllHomeworkApiItem {
  id: string;
  className: string;
  sectionName: string;
  subjectName: string;
  teacher_id: string;
  title: string;
  description: string;
  submission_date: string;
  attachments: string[];
  is_published: boolean;
  school_code: string;
  submittedCount: number;
  totalCount: number;
  createdAt: string;
  waNotifyStatus?: "SENT" | "NOT_SENT";
  waNotifiedAt?: string;
}

// ── Today's Timetable (dedicated endpoint) ─────────────────────────────

export interface TimetableApiItem {
  id: string;
  className: string;
  sectionName: string;
  subjectName: string;
  teacher_id: string;
  start_time: string;
  end_time: string;
  room: string;
  day_of_week: string;
}

export interface TimetableResponse {
  status: boolean;
  message?: string;
  data?: TimetableApiItem | TimetableApiItem[];
}

export interface AttendanceTrendDay {
  date: string;   // e.g. "Mon", "Tue"
  present: number;
  absent: number;
  total: number;
}

export interface ChronicAbsentee {
  id: string;
  name: string;
  rollNo: string;
  attendancePct: number;
}

export interface ClassOverview {
  trend: AttendanceTrendDay[];
  chronicAbsentees: ChronicAbsentee[];
  monthlyAvgPct: number;
}

export interface TeacherDashboardData {
  teacher: TeacherProfile;
  attendanceBanner: AttendanceBanner;
  stats: {
    classStrength: number;
    homeworkPending: number;
    attendanceThisMonth: number;
    leaveBalance: number;
  };
  todaySchedule: Period[];
  homeworkDueThisWeek: HomeworkItem[];
  classOverview: ClassOverview;
}
