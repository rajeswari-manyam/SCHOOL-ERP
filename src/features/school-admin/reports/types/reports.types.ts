export type ReportType = "ATTENDANCE" | "FEE_COLLECTION" | "STUDENT" | "WHATSAPP" | "ADMISSIONS" | "STAFF";
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

// ─── Raw API shapes (used by school-reports.api.ts) ────────────────────────────

export interface RawReport {
  id: string;
  reportype: string;
  from: string;
  to: string;
  class_id: string;
  section_id: string;
  academic_year_id: string;
  format: string;
  emailreport: boolean;
  school_code: string;
  createdAt: string;
  updatedAt: string;
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