export type ReportType =
  | "ATTENDANCE"
  | "FEE_COLLECTION"
  | "STUDENT"
  | "WHATSAPP_ACTIVITY"
  | "ADMISSIONS"
  | "STAFF";

export type ReportFormat = "PDF" | "CSV";
export type ReportPeriodType = "Weekly" | "Monthly" | "Custom" | "Annual" | "Academic Year" | "Current" | "By Class" | "PDF Only";

export interface ReportCard {
  id: ReportType;
  title: string;
  description: string;
  icon: string;
  badge?: { label: string; color: string };
  periods: ReportPeriodType[];
  formats: ReportFormat[];
  accentColor: string;
}

// ─── Raw API shape (snake_case from backend) ───────────────────────────────────
export interface RawReport {
  id: string;
  reportype: string;
  from: string;
  to: string;
  class_id: string | null;
  section_id: string | null;
  academic_year_id: string | null;
  format: string;
  emailreport: boolean;
  school_code: string;
  createdAt: string;
  updatedAt: string;
}

// ─── UI display shape (mapped from RawReport) ─────────────────────────────────
export interface GeneratedReport {
  id: string;
  reportName: string;
  generatedOn: string;
  period: string;
  format: ReportFormat;
  generatedBy: { initials: string; name: string };
  type: ReportType;
}

// ─── Form state ───────────────────────────────────────────────────────────────
export interface GenerateReportFormData {
  reportType: ReportType;
  dateRangeType: "This Month" | "Last Month" | "Custom Range";
  fromDate: string;
  toDate: string;
  classFilter: string;
  format: ReportFormat;
  includeSections: {
    classwiseSummary: boolean;
    dailyAttendanceGrid: boolean;
    chronicAbsentees: boolean;
    teacherWiseMarkingStatus: boolean;
  };
  emailToSelf: boolean;
  additionalEmail: string;
}

export interface ReportStats {
  totalGenerated: number;
  scheduledReports: number;
  monthlyAvg: number;
  pendingDelivery: number;
}

// ─── API payload / response ───────────────────────────────────────────────────
export interface CreateReportPayload {
  reportype: string;
  from: string;
  to: string;
  class_id: string;
  section_id: string | null;
  academic_year_id: string | null;
  format: string;
  emailreport: boolean;
  school_code: string;
}

export interface CreateReportResponse {
  status: boolean;
  message?: string;
  data?: RawReport;
}

export interface GetAllReportsResponse {
  status: boolean;
  count?: number;
  data: RawReport[];
}

export interface GetReportByIdResponse {
  status: boolean;
  data: RawReport;
}
