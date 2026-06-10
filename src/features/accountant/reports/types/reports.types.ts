// ─── Report type enum ─────────────────────────────────────────────────────────

export type ReportType =
  | "monthly_income"    // NEW: Monthly income summary
  | "expense"           // NEW: Expense breakdown
  | "student_fee"       // NEW: Per-student fee report
  | "profit_loss"       // NEW: P&L statement
  | "defaulters"        // existing
  | "reconciliation"    // existing
  | "annual"            // existing
  | "payroll"           // existing
  | "ledger";           // existing

export type ReportFormat = "PDF" | "Excel";

export type OverdueRange = "7+ Days" | "15+ Days" | "30+ Days";

export type ReportIconType =
  | "income"
  | "expense"
  | "student"
  | "profit_loss"
  | "fee"
  | "defaulters"
  | "reconciliation"
  | "annual"
  | "payroll"
  | "ledger";

// ─── Data models ──────────────────────────────────────────────────────────────

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

// ─── Monthly income report ────────────────────────────────────────────────────

export interface MonthlyIncomeReportRow {
  month: string;           // e.g. "April 2025"
  feeCollection: number;
  otherIncome: number;
  totalIncome: number;
  previousMonth: number;
  growthPercent: number;
}

export interface MonthlyIncomeReport {
  academicYear: string;
  rows: MonthlyIncomeReportRow[];
  totalAnnual: number;
}

// ─── Expense report ───────────────────────────────────────────────────────────

export interface ExpenseReportRow {
  category: string;         // e.g. "Salaries", "Utilities"
  month: string;
  amount: number;
  percentage: number;       // share of total expenses that month
}

export interface ExpenseReport {
  period: string;
  rows: ExpenseReportRow[];
  totalExpense: number;
}

// ─── Student fee report ───────────────────────────────────────────────────────

export interface StudentFeeReportRow {
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: string;
  section: string;
  totalFee: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: "PAID" | "PARTIAL" | "PENDING";
  lastPaymentDate?: string;
  lastPaymentMode?: string;
}

export interface StudentFeeReport {
  classFilter: string;
  period: string;
  rows: StudentFeeReportRow[];
  summary: {
    totalStudents: number;
    totalFee: number;
    totalCollected: number;
    totalPending: number;
    paidCount: number;
    partialCount: number;
    pendingCount: number;
  };
}

// ─── Profit / Loss report ─────────────────────────────────────────────────────

export interface ProfitLossReport {
  period: string;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  profitMarginPercent: number;
  incomeBreakdown: { category: string; amount: number }[];
  expenseBreakdown: { category: string; amount: number }[];
}

// ─── Generate input ───────────────────────────────────────────────────────────

export interface GenerateReportInput {
  reportType: ReportType;
  /** ISO date or "YYYY-MM" for monthly reports */
  asOfDate: string;
  /** Month range for monthly/income/P&L reports */
  fromMonth?: string;
  toMonth?: string;
  classFilter: string;
  sectionFilter?: string;
  minOverdue: OverdueRange;
  includeColumns: {
    studentName: boolean;
    parentContact: boolean;
    overdueAmount: boolean;
    daysOverdue: boolean;
    feeBreakdown: boolean;
    /** NEW: show partial payment breakdown */
    partialPayments: boolean;
    /** NEW: show late fees */
    lateFees: boolean;
  };
  format: ReportFormat;
  sendTo: {
    myEmail: boolean;
    principal: boolean;
  };
}

export type ReportCreateInput = GenerateReportInput;
export type ReportUpdateInput = Partial<GenerateReportInput>;

// ─── Component props ──────────────────────────────────────────────────────────

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
