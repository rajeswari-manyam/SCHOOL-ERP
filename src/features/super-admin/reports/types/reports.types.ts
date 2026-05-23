export type ReportType = "REVENUE" | "SCHOOLS" | "MARKETING" | "WHATSAPP" | "FEE" | "AUDIT";
export type ReportFormat = "PDF" | "XLSX" | "CSV";
export type ReportStatus = "READY" | "GENERATING" | "FAILED";

export interface ReportCard {
  type: ReportType;
  title: string;
  description: string;
  iconBg: string;
}

export interface ReportRecord {
  id: string;
  name: string;
  type: ReportType;
  generatedBy: string;
  date: string;        // ISO date string
  period: string;      // e.g. "April 01 - 30", "Q1 2024"
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
  periodType: "THIS_MONTH" | "LAST_MONTH" | "THIS_QUARTER" | "LAST_7_DAYS" | "CUSTOM";
  startDate?: string;
  endDate?: string;
}
