import api from "@/config/axios";
import type {
  MonthlyIncomeReport,
  ExpenseReport,
  StudentFeeReport,
  ProfitLossReport,
  Report,
  GenerateReportInput,
} from "@/features/accountant/reports/types/reports.types";

const BASE = "/api/v1/reports";

export const getMonthlyIncome = async (fromMonth: string, toMonth: string): Promise<MonthlyIncomeReport> => {
  const { data } = await api.get<MonthlyIncomeReport>(`${BASE}/income`, {
    params: { fromMonth, toMonth },
  });
  return data;
};

export const getExpenseReport = async (fromMonth: string, toMonth: string): Promise<ExpenseReport> => {
  const { data } = await api.get<ExpenseReport>(`${BASE}/expense`, {
    params: { fromMonth, toMonth },
  });
  return data;
};

export const getStudentFeeReport = async (params: {
  classId?: string;
  section?: string;
  academicYear: string;
}): Promise<StudentFeeReport> => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => Boolean(v))
  );
  const { data } = await api.get<StudentFeeReport>(`${BASE}/student`, { params: clean });
  return data;
};

export const getProfitLoss = async (fromMonth: string, toMonth: string): Promise<ProfitLossReport> => {
  const { data } = await api.get<ProfitLossReport>(`${BASE}/profit-loss`, {
    params: { fromMonth, toMonth },
  });
  return data;
};

export const generateReport = async (input: GenerateReportInput): Promise<Report> => {
  const { data } = await api.post<Report>(`${BASE}/generate`, input);
  return data;
};

export const downloadReport = async (reportId: string): Promise<{ downloadUrl: string }> => {
  const { data } = await api.get<{ downloadUrl: string }>(`${BASE}/${reportId}/download`);
  return data;
};

// ── Monthly Fee Collection Report ──────────────────────────────────────────

export interface MonthlyFeeCollectionPayload {
  academic_year_id: string;
  class_id: string;
  section_id: string;
  student_id: string;
  report_range: string;
  from_date: string;
  to_date: string;
  include_sections: {
    monthly_collection_summary: boolean;
    student_overdue_list: boolean;
    fee_breakdown: boolean;
    partial_payments: boolean;
    late_fee_report: boolean;
  };
}

export interface MonthlyFeeCollectionResponse {
  status: boolean;
  data: {
    student: { id: string; name: string };
    summary: {
      totalOriginal: number;
      totalDiscount: number;
      totalFinal: number;
      totalPaid: number;
      totalDue: number;
      overallStatus: string;
    };
    details: Array<{
      id: string;
      feeHeadName: string;
      originalAmount: number;
      discountAmount: number;
      finalAmount: number;
      paidAmount: number;
      dueAmount: number;
      status: string;
      dueDate: string | null;
    }>;
  };
}

export const generateMonthlyFeeCollectionReport = async (
  payload: MonthlyFeeCollectionPayload
): Promise<MonthlyFeeCollectionResponse> => {
  const { data } = await api.post<MonthlyFeeCollectionResponse>("/tenant/monthlyfeecollectionreport", payload);
  return data;
};

export const downloadReportById = async (reportId: string): Promise<void> => {
  const res = await api.get(`/tenant/downloadreport/${reportId}`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `report-${reportId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const deleteReportById = async (reportId: string): Promise<void> => {
  await api.delete(`/tenant/deletereportById/${reportId}`);
};

// ── Recent Income Transactions ──────────────────────────────────────────────

export interface RecentIncomeTransaction {
  date: string;
  type: string;
  description: string;
  total_transactions: number;
  total_amount: number;
  references: string[];
  collected_by: string;
}

export interface GetRecentIncomeTransactionsResponse {
  status: boolean;
  message: string;
  count: number;
  data: RecentIncomeTransaction[];
}

export const getRecentIncomeTransactions = async (
  month?: number,
  year?: number
): Promise<GetRecentIncomeTransactionsResponse> => {
  const { data } = await api.get<GetRecentIncomeTransactionsResponse>(
    "/tenant/getrecentincometransactions",
    { params: month && year ? { month, year } : undefined }
  );
  return data;
};

// ── Income Summary ──────────────────────────────────────────────────────────

export interface IncomeSummary {
  total_income: number;
  fee_collection: number;
  other_income: number;
  month_income: number;
  month_fee_collection: number;
  month_other_income: number;
}

export interface GetIncomeSummaryResponse {
  status: boolean;
  message: string;
  data: IncomeSummary;
}

export const getIncomeSummary = async (
  month?: number,
  year?: number
): Promise<GetIncomeSummaryResponse> => {
  const { data } = await api.get<GetIncomeSummaryResponse>(
    "/tenant/getincomesummary",
    { params: month && year ? { month, year } : undefined }
  );
  return data;
};

// ── Dashboard Summary ─────────────────────────────────────────────────────────

export interface DashboardSummary {
  collected_today: number;
  month_collection: number;
  weekly_collection: number;
  fee_collection: number;
  other_income: number;
  total_income: number;
  total_expense: number;
  total_pending_fees: number;
  net_profit: number;
  net_loss: number;
}

export interface GetDashboardSummaryResponse {
  status: boolean;
  message: string;
  data: DashboardSummary;
}

export const getDashboardSummary = async (): Promise<GetDashboardSummaryResponse> => {
  const { data } = await api.get<GetDashboardSummaryResponse>("/tenant/getdashboardsummary");
  return data;
};

// ── Today's Payments ──────────────────────────────────────────────────────────

export interface TodayPayment {
  id: string;
  student_id: string;
  fee_type: string;
  total_fee: number;
  amount_received: number;
  total_paid: number;
  balance_amount: number;
  payment_mode: string;
  reference_no: string;
  receipt_no: string;
  payment_date: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  studentName: string;
  feeName: string;
  academicYear: string;
}

export interface GetTodayPaymentsResponse {
  status: boolean;
  message: string;
  count: number;
  totalAmount: number;
  data: TodayPayment[];
}

export const getTodayPayments = async (): Promise<GetTodayPaymentsResponse> => {
  const { data } = await api.get<GetTodayPaymentsResponse>("/tenant/gettodaypayments");
  return data;
};

// ── Balance Sheet ─────────────────────────────────────────────────────────────

export interface BalanceSheetItem {
  description: string;
  amount: number;
}

export interface BalanceSheetData {
  income: BalanceSheetItem[];
  expenses: BalanceSheetItem[];
  totalIncome: number;
  totalExpenses: number;
  netPosition: number;
}

export interface GetBalanceSheetResponse {
  status: boolean;
  message: string;
  data: BalanceSheetData;
}

export const getBalanceSheet = async (
  month?: number,
  year?: number
): Promise<GetBalanceSheetResponse> => {
  const { data } = await api.get<GetBalanceSheetResponse>(
    "/tenant/getbalancesheet",
    { params: month && year ? { month, year } : undefined }
  );
  return data;
};

// ── Total Expenses by Month ───────────────────────────────────────────────────

export interface TotalExpensesByMonth {
  month: number;
  year: number;
  totalExpenses: number;
}

export interface GetTotalExpensesByMonthResponse {
  status: boolean;
  message: string;
  data: TotalExpensesByMonth;
}

export const getTotalExpensesByMonth = async (
  month?: number,
  year?: number
): Promise<GetTotalExpensesByMonthResponse> => {
  const { data } = await api.get<GetTotalExpensesByMonthResponse>(
    "/tenant/gettotalexpensesbymonth",
    { params: month && year ? { month, year } : undefined }
  );
  return data;
};

// ── Monthly Paid Payroll ──────────────────────────────────────────────────────

export interface MonthlyPaidPayroll {
  month: number;
  year: number;
  total_paid: number;
}

export interface GetMonthlyPaidPayrollResponse {
  status: boolean;
  message: string;
  data: MonthlyPaidPayroll;
}

export const getMonthlyPaidPayroll = async (
  month: number,
  year: number
): Promise<GetMonthlyPaidPayrollResponse> => {
  const { data } = await api.get<GetMonthlyPaidPayrollResponse>(
    "/tenant/getmonthlypaidpayroll",
    { params: { month, year } }
  );
  return data;
};

// ── Unified Dashboard (GET /tenant/getdashboard) ──────────────────────────────

export interface DashboardApiSummary {
  today_collection: number;
  month_collection: number;
  other_income: number;
  total_income: number;
  total_expenses: number;
  net_balance: number;
  pending_amount: number;
  total_students: number;
}

export interface DashboardMonthlyTrend {
  month: string;
  actual: number;
  target: number;
}

export interface DashboardPaymentMode {
  payment_mode: string;
  amount: number;
}

export interface DashboardRecentPayment {
  id: string;
  student_id: string;
  fee_type: string;
  fee_reference_id: string;
  feehead_id?: string;
  total_fee: number;
  amount_received: number;
  total_paid: number;
  balance_amount: number;
  payment_mode: string;
  reference_no: string;
  receipt_no: string;
  payment_date: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    name: string;
    admission_number: string;
  };
}

export interface DashboardRecentExpense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  paidVia: string;
  reference: string;
  notes: string;
  attachment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetDashboardResponse {
  status: boolean;
  message: string;
  data: {
    summary: DashboardApiSummary;
    monthly_collection_trend: DashboardMonthlyTrend[];
    payment_mode_summary: DashboardPaymentMode[];
    recent_payments: DashboardRecentPayment[];
    recent_expenses: DashboardRecentExpense[];
  };
}

export const getDashboard = async (): Promise<GetDashboardResponse> => {
  const { data } = await api.get<GetDashboardResponse>("/tenant/getdashboard");
  return data;
};
