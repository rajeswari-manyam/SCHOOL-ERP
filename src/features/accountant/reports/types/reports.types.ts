// ─── Base Enums & Primitives ───────────────────────────────────────────────

export type ReportType =
  | "monthly"
  | "defaulters"
  | "reconciliation"
  | "annual"
  | "payroll"
  | "ledger";

export type ReportFormat = "PDF" | "Excel";

export type OverdueRange = "7+ Days" | "15+ Days" | "30+ Days";

export type ReportIconType =
  | "fee"
  | "defaulters"
  | "reconciliation"
  | "annual"
  | "payroll"
  | "ledger";

// ─── Data Models ───────────────────────────────────────────────────────────

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
  icon: ReportIconType;
  autoSend?: boolean;
};

export interface GenerateReportInput {
  reportType: ReportType;
  asOfDate: string;
  classFilter: string;
  minOverdue: OverdueRange;
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

export type ReportCreateInput = GenerateReportInput;
export type ReportUpdateInput = Partial<GenerateReportInput>;

// ─── Component Props ───────────────────────────────────────────────────────

export interface ReportCardProps {
  id: ReportType;
  title: string;
  description: string;
  icon: ReportIconType;
  autoSend?: boolean;
  onGenerate: () => void;
}

export interface RecentReportsTableProps {
  data: Report[];
}