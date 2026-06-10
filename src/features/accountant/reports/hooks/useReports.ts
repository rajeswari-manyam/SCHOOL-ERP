import { useState, useCallback } from "react";
import type {
  Report,
 
  GenerateReportInput,
  MonthlyIncomeReport,
  ExpenseReport,
  StudentFeeReport,
  ProfitLossReport,
} from "../types/reports.types";

// ─── API helpers (replace BASE_URL with your actual backend URL) ──────────────

const BASE_URL = "/api/v1/reports";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? `API error ${res.status}`);
  }
  return res.json();
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useReports() {
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Monthly income ────────────────────────────────────────────────────

  /**
   * GET /api/v1/reports/income?fromMonth=YYYY-MM&toMonth=YYYY-MM
   */
  const fetchMonthlyIncome = useCallback(
    async (fromMonth: string, toMonth: string): Promise<MonthlyIncomeReport> => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<MonthlyIncomeReport>(
          `/income?fromMonth=${fromMonth}&toMonth=${toMonth}`
        );
        return data;
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

  // ── Expense ───────────────────────────────────────────────────────────

  /**
   * GET /api/v1/reports/expense?fromMonth=YYYY-MM&toMonth=YYYY-MM
   */
  const fetchExpenseReport = useCallback(
    async (fromMonth: string, toMonth: string): Promise<ExpenseReport> => {
      setLoading(true);
      setError(null);
      try {
        return await apiFetch<ExpenseReport>(
          `/expense?fromMonth=${fromMonth}&toMonth=${toMonth}`
        );
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

  // ── Student fee ───────────────────────────────────────────────────────

  /**
   * GET /api/v1/reports/student?classId=X&section=Y&academicYear=YYYY
   */
  const fetchStudentFeeReport = useCallback(
    async (params: {
      classId?: string;
      section?: string;
      academicYear: string;
    }): Promise<StudentFeeReport> => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams(
          Object.entries(params).filter(([, v]) => Boolean(v)) as [string, string][]
        ).toString();
        return await apiFetch<StudentFeeReport>(`/student?${qs}`);
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

  // ── Profit / Loss ─────────────────────────────────────────────────────

  /**
   * GET /api/v1/reports/profit-loss?fromMonth=YYYY-MM&toMonth=YYYY-MM
   */
  const fetchProfitLoss = useCallback(
    async (fromMonth: string, toMonth: string): Promise<ProfitLossReport> => {
      setLoading(true);
      setError(null);
      try {
        return await apiFetch<ProfitLossReport>(
          `/profit-loss?fromMonth=${fromMonth}&toMonth=${toMonth}`
        );
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

  // ── Generate + download ───────────────────────────────────────────────

  /**
   * POST /api/v1/reports/generate
   * Creates the report server-side and returns a download URL.
   */
  const generateReport = useCallback(
    async (input: GenerateReportInput): Promise<Report> => {
      setLoading(true);
      setError(null);
      try {
        const report = await apiFetch<Report>("/generate", {
          method: "POST",
          body: JSON.stringify(input),
        });
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

  /**
   * Downloads a previously generated report by its ID.
   */
  const downloadReport = useCallback(async (reportId: string) => {
    const { downloadUrl } = await apiFetch<{ downloadUrl: string }>(
      `/${reportId}/download`
    );
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
