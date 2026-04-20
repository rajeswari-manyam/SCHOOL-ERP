export type ReportType =
  | "ATTENDANCE"
  | "FEE_COLLECTION"
  | "STUDENT"
  | "WHATSAPP_ACTIVITY"
  | "ADMISSIONS"
  | "STAFF";

export type ReportFormat = "PDF" | "CSV";
export type ReportPeriodType = "Monthly" | "Custom Range" | "Annual" | "Weekly" | "Academic Year" | "Current" | "By Class" | "PDF Only";

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

export interface GeneratedReport {
  id: string;
  reportName: string;
  generatedOn: string;
  period: string;
  format: ReportFormat;
  generatedBy: { initials: string; name: string };
  type: ReportType;
}

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