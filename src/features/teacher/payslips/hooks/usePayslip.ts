import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import { payslipApi } from "@/services/teacher-payslip.api";
import type { Payslip, AnnualSummary } from "../types/payslip.types";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const currentYear = new Date().getFullYear();
const currentMonthIndex = new Date().getMonth(); // 0-based

export function usePayslip() {
  const staffId = useAuthStore((s) => s.user?.id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [annualSummary, setAnnualSummary] = useState<AnnualSummary | null>(null);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonthIndex);

  const monthLabel = `${MONTHS[selectedMonthIndex]} ${selectedYear}`;
  void selectedMonthIndex;
  void selectedYear;

  const filteredPayslips = useMemo(
    () =>
      payslips.filter((p) => {
        const pMonth = parseInt(p.month ?? "", 10);
        const pYear = parseInt(p.year ?? "", 10);
        if (!isNaN(pMonth) && !isNaN(pYear)) {
          return pMonth === selectedMonthIndex + 1 && pYear === selectedYear;
        }
        return p.monthLabel === monthLabel;
      }),
    [payslips, selectedMonthIndex, selectedYear, monthLabel],
  );

  const hasMonthMatch = filteredPayslips.length > 0;
  const currentPayslip = hasMonthMatch
    ? filteredPayslips[0]
    : payslips.length > 0
      ? payslips[0]
      : null;

  // ── Fetch all payslips ────────────────────────────────────────────
  const loadPayslips = useCallback(async () => {
    if (!staffId) {
      setError("No staff ID found. Please log in again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await payslipApi.getPayslips(staffId, "", "");
      setPayslips(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load payslips");
    } finally {
      setLoading(false);
    }
  }, [staffId]);

  // ── Fetch annual summary ─────────────────────────────────────────
  const loadAnnualSummary = useCallback(async () => {
    if (!staffId) return;
    try {
      const s = await payslipApi.getAnnualSummary(staffId, selectedYear);
      if (s) setAnnualSummary(s);
    } catch {
      // non-critical
    }
  }, [staffId, selectedYear]);

  useEffect(() => {
    loadPayslips();
  }, [loadPayslips]);

  useEffect(() => {
    loadAnnualSummary();
  }, [loadAnnualSummary]);

  const goToPrevMonth = () => {
    if (selectedMonthIndex === 0) {
      setSelectedMonthIndex(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonthIndex((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonthIndex === 11) {
      setSelectedMonthIndex(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonthIndex((m) => m + 1);
    }
  };

  const downloadPayslip = async () => {
    if (!currentPayslip?.id) return;
    try {
      await payslipApi.downloadPdf(currentPayslip.id);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Download failed");
    }
  };

  const sendToWhatsApp = async () => {
    if (!currentPayslip?.id) return;
    try {
      await payslipApi.sendToWhatsApp(currentPayslip.id);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to send");
    }
  };

  const downloadAnnualStatement = async () => {
    try {
      await payslipApi.downloadAnnualStatement(selectedYear);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Download failed");
    }
  };

  return {
    loading,
    error,
    payslips,
    currentPayslip,
    hasMonthMatch,
    annualSummary,
    monthLabel,
    selectedYear,
    selectedMonthIndex,
    monthIndex: selectedMonthIndex,
    goToPrevMonth,
    goToNextMonth,
    downloadPayslip,
    sendToWhatsApp,
    downloadAnnualStatement,
    retry: loadPayslips,
  };
}
