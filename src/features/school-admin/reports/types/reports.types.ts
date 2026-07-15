export type ReportType = "ATTENDANCE" | "FEE_COLLECTION" | "STUDENT" | "WHATSAPP" | "WHATSAPP_ACTIVITY" | "ADMISSIONS" | "STAFF";
export type ReportFormat = "PDF" | "CSV";
export type ReportStatus = "READY" | "GENERATING" | "FAILED";

export interface ReportSectionOption {
  key: string;
  label: string;
  premium?: boolean;
}

export interface ReportCardConfig {
  type: ReportType;
  title: string;
  description: string;
  iconBg: string;
  periods: string[];
  formats: ReportFormat[];
  badge?: { text: string; color: string; dot?: boolean };
  sections?: ReportSectionOption[];
}

/** Legacy shape used by Report config.ts */
export interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  periods: string[];
  formats: string[];
  accentColor: string;
  badge?: { label: string; color: string };
}

export interface ReportStats {
  totalGenerated: number;
  monthlyAvg: number;
  pendingDelivery: number;
}

export interface ReportRecord {
  id: string;
  name: string;
  type: ReportType;
  generatedBy: string;
  generatedByInitials: string;
  generatedOn: string;
  period: string;
  format: ReportFormat;
  status: ReportStatus;
  downloadUrl?: string;
}

export interface ReportsResponse {
  data: ReportRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GenerateReportPayload {
  type: ReportType;
  format: ReportFormat;
  periodType: "THIS_MONTH" | "LAST_MONTH" | "CUSTOM";
  startDate?: string;
  endDate?: string;
  classId?: string;
  includeSections?: string[];
  emailTo?: string[];
}

// ─── Raw API shapes (used by reports.api.ts) ────────────────────────────

export interface RawReportFilters {
  from_date: string;
  to_date: string;
  class_id: string;
  section_id: string;
  report_range: string;
  academic_year_id: string;
}

export interface RawReportDashboardStats {
  total_students: number;
  teachers_marked: number;
  teachers_pending: number;
  chronic_absentees: number;
  average_attendance: number;
}

export interface RawReportDailyAttendance {
  date: string;
  absent: number;
  present: number;
  attendance_percentage: number;
}

export interface RawReportChronicAbsentee {
  absent_days: number;
  roll_number: string;
  present_days: number;
  student_name: string;
  attendance_percentage: number;
}

export interface RawReportClassWiseSummary {
  leave: number;
  absent: number;
  present: number;
  class_name: string;
  section_name: string;
  working_days: number;
  total_students: number;
  attendance_percentage: number;
}

export interface RawReportTeacherStatus {
  teacher_id: string;
  teacher_name: string;
  attendance_marked: number;
  attendance_pending: number;
  marking_percentage: number;
  total_classes_assigned: number;
}

export interface RawReportStudentDetail {
  student_id: string;
  roll_number: string;
  total_leave: number;
  student_name: string;
  total_absent: number;
  total_present: number;
  attendance_percentage: number;
}

export interface RawReport {
  id: string;
  reportype: string;
  report_type?: string;
  from: string;
  to: string;
  class_id: string;
  class_name: string | null;
  section_id: string;
  section_name: string | null;
  academic_year_id: string;
  academic_year: string | null;
  format: string;
  emailreport: boolean;
  school_code: string;
  createdAt: string;
  updatedAt: string;
  generated_at?: string;
  filters?: RawReportFilters;
  dashboard_stats?: RawReportDashboardStats;
  daily_attendance?: RawReportDailyAttendance[];
  chronic_absentees?: RawReportChronicAbsentee[];
  class_wise_summary?: RawReportClassWiseSummary;
  teacher_wise_status?: RawReportTeacherStatus[];
  student_attendance_details?: RawReportStudentDetail[];
}

export interface GeneratedReport {
  id: string;
  reportName: string;
  generatedOn: string;
  period: string;
  format: ReportFormat;
  generatedBy: { initials: string; name: string };
  type: ReportType;
}

export interface CreateReportPayload {
  reportype: string;
  from: string;
  to: string;
  class_id: string;
  section_id: string;
  academic_year_id: string;
  format: string;
  emailreport: boolean;
  school_code: string;
}

export interface CreateReportResponse {
  status: boolean;
  message: string;
  data: RawReport;
}

export interface GetAllReportsResponse {
  status: boolean;
  count: number;
  data: RawReport[];
}

export interface GetReportByIdResponse {
  status: boolean;
  data: RawReport;
}

// ─── Student Report ────────────────────────────────────────────────────────────

export interface StudentReportPayload {
  academic_year_id: string;
  class_id: string;
  section_id: string;
  report_range: string;
  from_date: string;
  to_date: string;
  student_id: string;
  include_sections: {
    student_list: boolean;
    admission_report: boolean;
    class_strength: boolean;
    student_attendance: boolean;
    student_attendance_by_id: boolean;
  };
}

export interface StudentReportResponse {
  status: boolean;
  message: string;
  report_period: { from: string; to: string };
  data: {
    student_list: any[];
    admission_report: any;
    class_strength: any[];
    student_attendance: any[];
    student_attendance_by_id: any;
  };
}

// ─── Staff Report ──────────────────────────────────────────────────────────────

export interface StaffReportPayload {
  academic_year_id: string;
  report_range: string;
  from_date: string;
  to_date: string;
  staff_id: string;
  include_sections: {
    staff_list: boolean;
    staff_attendance: boolean;
    leave_utilization: boolean;
    payroll_report: boolean;
    staff_attendance_by_id: boolean;
  };
}

export interface StaffReportResponse {
  status: boolean;
  message: string;
  report_period: { from: string; to: string };
  data: {
    staff_list: any[];
    staff_attendance: any[];
    leave_utilization: any[];
    payroll_report: any[];
    staff_attendance_by_id: any;
  };
}

// ─── Attendance Report ──────────────────────────────────────────────────────────

export interface AttendanceReportIncludeSections {
  class_summary: boolean;
  daily_attendance: boolean;
  chronic_absentees: boolean;
  teacher_wise_status: boolean;
}

export interface AttendanceReportPayload {
  academic_year_id: string;
  class_id: string;
  section_id: string;
  report_range: string;
  from_date: string;
  to_date: string;
  include_sections: AttendanceReportIncludeSections;
}

export interface AttendanceReportClassSummary {
  class_name: string;
  section_name: string;
  total_students: number;
  working_days: number;
  present: number;
  absent: number;
  leave: number;
  attendance_percentage: number;
}

export interface AttendanceReportDaily {
  date: string;
  present: number;
  absent: number;
  attendance_percentage: number;
}

export interface AttendanceReportStudentDetail {
  student_id: string;
  student_name: string;
  roll_number: string;
  total_present: number;
  total_absent: number;
  total_leave: number;
  attendance_percentage: number;
}

export interface AttendanceReportChronicAbsentee {
  student_name: string;
  roll_number: string;
  present_days: number;
  absent_days: number;
  attendance_percentage: number;
}

export interface AttendanceReportTeacherStatus {
  teacher_id: string;
  teacher_name: string;
  total_classes_assigned: number;
  attendance_marked: number;
  attendance_pending: number;
  marking_percentage: number;
}

export interface AttendanceReportDashboardStats {
  total_students: number;
  average_attendance: number;
  chronic_absentees: number;
  teachers_marked: number;
  teachers_pending: number;
}

export interface AttendanceReportFilters {
  class_id: string;
  section_id: string;
  academic_year_id: string;
  report_range: string;
  from_date: string;
  to_date: string;
}

export interface AttendanceReportResponse {
  status: boolean;
  message: string;
  report_id: string;
  report_type: string;
  generated_at: string;
  email_sent: boolean;
  filters: AttendanceReportFilters;
  class_wise_summary: AttendanceReportClassSummary;
  daily_attendance: AttendanceReportDaily[];
  student_attendance_details: AttendanceReportStudentDetail[];
  chronic_absentees: AttendanceReportChronicAbsentee[];
  teacher_wise_status: AttendanceReportTeacherStatus[];
  dashboard_stats: AttendanceReportDashboardStats;
}

// ─── Recently Generated Reports ────────────────────────────────────────────────

export interface RecentlyGeneratedReport {
  report_id: string;
  report_type: string;
  report_period: { from: string; to: string };
  format: string;
  email_report: boolean;
  generated_on: string;
}

export interface GetRecentlyGeneratedReportsResponse {
  status: boolean;
  message: string;
  count: number;
  total: number;
  page: number;
  total_pages: number;
  data: RecentlyGeneratedReport[];
}

// ─── Delete Report ─────────────────────────────────────────────────────────────

export interface DeleteReportResponse {
  status: boolean;
  message: string;
}

// ─── Fee Collection Report ─────────────────────────────────────────────────────

export interface FeeCollectionReportIncludeSections {
  monthly_collection_summary: boolean;
  student_overdue_list: boolean;
  fee_breakdown: boolean;
  partial_payments: boolean;
  late_fee_report: boolean;
}

export interface FeeCollectionReportPayload {
  academic_year_id: string;
  class_id: string;
  section_id: string;
  student_id?: string;
  report_range: string;
  from_date: string;
  to_date: string;
  include_sections: FeeCollectionReportIncludeSections;
}

export interface FeeCollectionReportStudentSummary {
  id: string;
  name: string;
}

export interface FeeCollectionReportSummary {
  totalOriginal: number;
  totalDiscount: number;
  totalFinal: number;
  totalPaid: number;
  totalDue: number;
  overallStatus: string;
}

export interface FeeCollectionReportDetail {
  id: string;
  fee_type?: string;
  feeHeadName: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
  dueDate: string | null;
}

export interface FeeCollectionReportData {
  student: FeeCollectionReportStudentSummary;
  summary: FeeCollectionReportSummary;
  details: FeeCollectionReportDetail[];
}

export interface FeeCollectionReportResponse {
  status: boolean;
  data: FeeCollectionReportData;
}