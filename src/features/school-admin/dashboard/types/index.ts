// ─── Dashboard Feature Types ───────────────────────────────────────────────

export interface AttendanceClass {
  id: string;
  className: string;
  section: string;
  teacher: string;
  present: number | null;
  absent: number | null;
  status: 'marked' | 'not_marked';
}

export interface FeeDefaulter {
  id: string;
  initials: string;
  name: string;
  className: string;
  amount: number;
  overdueDays: number;
  color: string;
}

export interface WhatsAppActivity {
  id: string;
  type: 'alert' | 'fee' | 'broadcast' | 'staff';
  message: string;
  time: string;
  delivered: string;
}

export interface AdmissionStage {
  stage: string;
  count: number;
  highlight?: boolean;
  danger?: boolean;
}

export type StatVariant = 'green' | 'red' | 'orange' | 'blue';

export interface StatsCard {
  id: string;
  label: string;
  value: string;
  badge?: { text: string; variant: StatVariant };
  sub: string;
  action?: { label: string };
  alert?: boolean;
  icon: 'users' | 'check' | 'rupee' | 'user-plus';
}

export interface DashboardData {
  schoolName?: string;
  stats: StatsCard[];
  attendanceClasses: AttendanceClass[];
  feeDefaulters: FeeDefaulter[];
  feeCollected: number;
  feePending: number;
  feeTotalOutstanding: number;
  feePaidPercent: number;
  whatsappActivity: WhatsAppActivity[];
  admissionPipeline: AdmissionStage[];
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
}

// ─── Admissions This Week ──────────────────────────────────────────────────

export interface AdmissionThisWeekDaily {
  date: string;
  count: number;
}

export interface AdmissionThisWeekItem {
  id: string;
  studentName: string;
  parentName?: string;
  classApplyingFor: string;
  date: string;
  stage: string;
}

export interface AdmissionThisWeek {
  total: number;
  changeVsLastWeek: number;
  pendingFollowUp: number;
  dailyBreakdown?: AdmissionThisWeekDaily[];
  recentAdmissions?: AdmissionThisWeekItem[];
}

// ─── Today's Attendance ─────────────────────────────────────────────────────

export interface SchoolTodayAttendance {
  totalStudents: number;
  present: number;
  absent: number;
  percentage: number;
  classesMarked: number;
  totalClasses: number;
}

/** Raw API response shape for /tenant/getschooltodayattendance */
export interface RawTodayAttendanceResponse {
  status?: boolean;
  message?: string;
  data?: Record<string, unknown>;
  total_students?: number;
  totalStudents?: number;
  total?: number;
  present?: number;
  present_today?: number;
  presentToday?: number;
  absent?: number;
  absent_today?: number;
  absentToday?: number;
  percentage?: number;
  percent?: number;
  attendance_percentage?: number;
  attendancePercentage?: number;
  classes_marked?: number;
  classesMarked?: number;
  marked_classes?: number;
  markedClasses?: number;
  total_classes?: number;
  totalClasses?: number;
}

// ─── Class-wise Today's Attendance ──────────────────────────────────────────

/** Single class attendance record from the API (snake_case or camelCase) */
export interface RawClassAttendanceItem {
  id?: string;
  class_id?: string;
  classId?: string;
  className?: string;
  class_name?: string;
  class?: string;
  section?: string;
  section_name?: string;
  sectionName?: string;
  sec?: string;
  teacher?: string;
  teacher_name?: string;
  teacherName?: string;
  present?: number | null;
  absent?: number | null;
  status?: string;
  attendance_status?: string;
  attendanceStatus?: string;
}

/** Raw API response shape for /tenant/getclasstodayattendance */
export interface RawClassTodayAttendanceResponse {
  status?: boolean;
  message?: string;
  data?: RawClassAttendanceItem[] | { classes?: RawClassAttendanceItem[] };
  classes?: RawClassAttendanceItem[];
  attendance?: RawClassAttendanceItem[];
}

/** Raw API response shape for /tenant/getallclassestodayattendance */
export interface RawAllClassesTodayAttendanceResponse {
  status?: boolean;
  message?: string;
  data?: RawClassAttendanceItem[] | { classes?: RawClassAttendanceItem[]; attendance?: RawClassAttendanceItem[] };
  classes?: RawClassAttendanceItem[];
  attendance?: RawClassAttendanceItem[];
}

// ─── Class Attendance Status (stat card: "Classes Marked Today") ─────────────

export interface ClassAttendanceStatus {
  marked: number;
  total: number;
  pending: number;
}

/** Raw API response shape for /tenant/class-attendance-status */
export interface RawClassAttendanceStatusResponse {
  status?: boolean;
  message?: string;
  data?: Record<string, unknown>;
  marked?: number;
  classes_marked?: number;
  classesMarked?: number;
  total?: number;
  total_classes?: number;
  totalClasses?: number;
  pending?: number;
  pending_classes?: number;
  pendingClasses?: number;
}

// ─── Enquiries (for AdmissionsPipeline) ─────────────────────────────────────

/** Minimal raw enquiry item — only fields relevant to pipeline stage counting */
export interface RawEnquiryItem {
  enquiry_id?: string;
  id?: string;
  _id?: string;
  stage?: string;
  current_stage?: string;
  stage_name?: string;
  status?: string;
  pipeline_status?: string;
}

/** Raw API response shape for /tenant/getenquiries */
export interface RawEnquiriesResponse {
  status?: boolean;
  message?: string;
  data?: RawEnquiryItem[] | { enquiries?: RawEnquiryItem[]; list?: RawEnquiryItem[]; records?: RawEnquiryItem[] };
  enquiries?: RawEnquiryItem[];
  list?: RawEnquiryItem[];
  records?: RawEnquiryItem[];
  result?: RawEnquiryItem[];
}

// ─── Academic-Year-scoped Dashboard APIs ────────────────────────────────────

export interface AcademicYearListResponse<T> {
  status: boolean;
  count: number;
  totalPages: number;
  currentPage: number;
  data: T[];
}

export interface AcademicYearDashboardItem {
  id: string;
  [key: string]: unknown;
}

export interface AcademicYearStudentItem {
  id: string;
  firstName?: string;
  lastName?: string;
  class_name?: string;
  section_name?: string;
  [key: string]: unknown;
}

export interface AcademicYearStaffItem {
  id: string;
  name?: string;
  role?: string;
  [key: string]: unknown;
}

export interface AcademicYearClassItem {
  id: string;
  class_name: string;
  academicYearId: string;
  status: string;
  total_strength: number;
  [key: string]: unknown;
}

export interface AcademicYearSubjectItem {
  id: string;
  name?: string;
  subject_name?: string;
  [key: string]: unknown;
}

export interface AcademicYearAttendanceItem {
  id: string;
  [key: string]: unknown;
}

export interface AcademicYearExamItem {
  id: string;
  exam_name?: string;
  [key: string]: unknown;
}

export interface AcademicYearResultItem {
  id: string;
  [key: string]: unknown;
}

export interface AcademicYearFeeItem {
  id: string;
  [key: string]: unknown;
}

/** Raw API response shape for /tenant/getadmissionsthisweek */
export interface RawAdmissionsThisWeekResponse {
  status?: boolean;
  message?: string;
  data?: Record<string, unknown>;
  total?: number;
  change_vs_last_week?: number;
  changeVsLastWeek?: number;
  pending_follow_up?: number;
  pendingFollowUp?: number;
  daily_breakdown?: AdmissionThisWeekDaily[];
  dailyBreakdown?: AdmissionThisWeekDaily[];
  recent_admissions?: AdmissionThisWeekItem[];
  recentAdmissions?: AdmissionThisWeekItem[];
  admissions?: AdmissionThisWeekItem[];
}
