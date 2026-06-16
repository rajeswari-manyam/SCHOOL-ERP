import { useState, useCallback } from "react";
import {
  getMonthlyIncome,
  getExpenseReport,
  getStudentFeeReport,
  getProfitLoss,
  generateReport as generateReportApi,
  downloadReport as downloadReportApi,
} from "@/services/accountant-reports.api";
import type {
  Report,
  GenerateReportInput,
  MonthlyIncomeReport,
  ExpenseReport,
  StudentFeeReport,
  ProfitLossReport,
} from "../types/reports.types";

export function useReports() {
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthlyIncome = useCallback(
    async (fromMonth: string, toMonth: string): Promise<MonthlyIncomeReport> => {
      setLoading(true);
      setError(null);
      try {
        return await getMonthlyIncome(fromMonth, toMonth);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchExpenseReport = useCallback(
    async (fromMonth: string, toMonth: string): Promise<ExpenseReport> => {
      setLoading(true);
      setError(null);
      try {
        return await getExpenseReport(fromMonth, toMonth);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchStudentFeeReport = useCallback(
    async (params: {
      classId?: string;
      section?: string;
      academicYear: string;
    }): Promise<StudentFeeReport> => {
      setLoading(true);
      setError(null);
      try {
        return await getStudentFeeReport(params);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchProfitLoss = useCallback(
    async (fromMonth: string, toMonth: string): Promise<ProfitLossReport> => {
      setLoading(true);
      setError(null);
      try {
        return await getProfitLoss(fromMonth, toMonth);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const generateReport = useCallback(
    async (input: GenerateReportInput): Promise<Report> => {
      setLoading(true);
      setError(null);
      try {
        const report = await generateReportApi(input);
        setRecentReports((prev) => [report, ...prev]);
        return report;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const downloadReport = useCallback(async (reportId: string) => {
    const { downloadUrl } = await downloadReportApi(reportId);
    window.open(downloadUrl, "_blank");
  }, []);

  return {
    recentReports,
    loading,
    error,
    fetchMonthlyIncome,
    fetchExpenseReport,
    fetchStudentFeeReport,
    fetchProfitLoss,
    generateReport,
    downloadReport,
  };
}
