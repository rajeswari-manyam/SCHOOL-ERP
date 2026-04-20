// types/reports.types.ts
export type ReportType =
  | "monthly"
  | "defaulters"
  | "reconciliation"
  | "annual"
  | "payroll"
  | "ledger";

export type ReportFormat = "PDF" | "Excel";

export type Report = {
  id: string;
  name: string;
  type: ReportType;
  generatedAt: string;
  format: ReportFormat;
  generatedBy: string;
  period: string;
  downloadUrl?: string;
};

export type ReportCard = {
  id: ReportType;
  title: string;
  description: string;
  icon: string;
  color: string;
  autoSend?: boolean;
};

export interface GenerateReportInput {
  reportType: ReportType;
  asOfDate: string;
  classFilter: string;
  minOverdueDays: number;
  includeColumns: {
    studentName: boolean;
    parentContact: boolean;
    overdueAmount: boolean;
    daysOverdue: boolean;
    feeBreakdown: boolean;
  };
  format: ReportFormat;
  sendTo: {
    myEmail: boolean;
    principal: boolean;
  };
}