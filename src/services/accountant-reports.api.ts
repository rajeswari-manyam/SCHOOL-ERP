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
