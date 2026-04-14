import { useState, useMemo } from "react";
import type { Payslip, AnnualSummary } from "../types/payslip.types";

// ── Mock payslips (12 months: Jun 2024 → May 2025) ──────────────────────
const buildPayslip = (
  id: string,
  year: number,
  month: number, // 1-based
  status: Payslip["status"],
  presentDays: number,
  absentDays: number,
  halfDays: number,
  leaveDays: number,
  specialAllowance: number = 5000,
  pfEmployee: number = 3600,
  tax: number = 4200,
): Payslip => {
  const monthLabel = new Date(year, month - 1, 1).toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });
  const basic = 30000;
  const hra = 12000;
  const conveyance = 1600;
  const gross = basic + hra + conveyance + specialAllowance;
  const pfEmployer = 1800;
  const professionalTax = 200;
  const totalDed = pfEmployee + tax + professionalTax;
  const net = gross - totalDed;
  const workingDays = 26;

  return {
    id,
    month: `${year}-${String(month).padStart(2, "0")}`,
    monthLabel,
    status,
    employeeId: "TCH-2024-047",
    employeeName: "Anjali Verma",
    designation: "Senior Teacher",
    department: "Mathematics",
    bankAccount: "XXXX XXXX 4321",
    pan: "ABCDE1234F",
    earnings: [
      { label: "Basic Salary",       amount: basic },
      { label: "House Rent Allowance", amount: hra },
      { label: "Conveyance Allowance", amount: conveyance },
      { label: "Special Allowance",   amount: specialAllowance },
    ],
    grossSalary: gross,
    deductions: [
      { label: "Provident Fund (Employee 12%)", amount: pfEmployee },
      { label: "Income Tax (TDS)",              amount: tax },
      { label: "Professional Tax",              amount: professionalTax },
    ],
    totalDeductions: totalDed,
    netSalary: net,
    attendance: {
      workingDays,
      presentDays,
      absentDays,
      halfDays,
      leaveDays,
    },
  };
};

export const MOCK_PAYSLIPS: Payslip[] = [
  buildPayslip("ps-2025-05", 2025, 5, "PENDING", 22, 0, 0, 0, 5000, 3600, 4200),
  buildPayslip("ps-2025-04", 2025, 4, "PAID",    25, 0, 0, 1, 5000, 3600, 4200),
  buildPayslip("ps-2025-03", 2025, 3, "PAID",    24, 1, 0, 1, 5000, 3600, 4200),
  buildPayslip("ps-2025-02", 2025, 2, "PAID",    23, 0, 1, 0, 5000, 3600, 4200),
  buildPayslip("ps-2025-01", 2025, 1, "PAID",    26, 0, 0, 0, 5000, 3600, 4200),
  buildPayslip("ps-2024-12", 2024, 12,"PAID",    24, 1, 0, 1, 6000, 3600, 4200),
  buildPayslip("ps-2024-11", 2024, 11,"PAID",    25, 0, 0, 1, 5000, 3600, 4200),
  buildPayslip("ps-2024-10", 2024, 10,"PAID",    26, 0, 0, 0, 5000, 3600, 4200),
  buildPayslip("ps-2024-09", 2024, 9, "PAID",    24, 2, 0, 0, 5000, 3600, 3800),
  buildPayslip("ps-2024-08", 2024, 8, "PAID",    25, 0, 1, 0, 5000, 3600, 4200),
  buildPayslip("ps-2024-07", 2024, 7, "PAID",    26, 0, 0, 0, 5000, 3600, 4200),
  buildPayslip("ps-2024-06", 2024, 6, "PAID",    23, 1, 0, 2, 5000, 3600, 3800),
];

export const MOCK_ANNUAL_SUMMARY: AnnualSummary = {
  year: 2024,
  totalEarned:     MOCK_PAYSLIPS.filter(p => p.month.startsWith("2024")).reduce((s, p) => s + p.grossSalary, 0),
  totalDeductions: MOCK_PAYSLIPS.filter(p => p.month.startsWith("2024")).reduce((s, p) => s + p.totalDeductions, 0),
  totalNet:        MOCK_PAYSLIPS.filter(p => p.month.startsWith("2024")).reduce((s, p) => s + p.netSalary, 0),
};

// ── Hook ──────────────────────────────────────────────────────────────────
export const usePayslip = () => {
  // Start on current/latest month (index 0 = most recent)
  const [currentIndex, setCurrentIndex] = useState(0);

  const [waMsg, setWaMsg] = useState(false);
  const [dlMsg, setDlMsg] = useState(false);

  const payslips = MOCK_PAYSLIPS; // replace with useQuery in production
  const current = payslips[currentIndex];

  const canPrev = currentIndex < payslips.length - 1;
  const canNext = currentIndex > 0;

  const goNext = () => { if (canNext) setCurrentIndex(i => i - 1); };
  const goPrev = () => { if (canPrev) setCurrentIndex(i => i + 1); };

  const handleDownload = () => {
    setDlMsg(true);
    setTimeout(() => setDlMsg(false), 3000);
  };

  const handleWhatsApp = () => {
    setWaMsg(true);
    setTimeout(() => setWaMsg(false), 3000);
  };

  const history = useMemo(
    () => payslips.filter((_, i) => i !== currentIndex),
    [payslips, currentIndex]
  );

  return {
    current,
    history,
    payslips,
    canPrev,
    canNext,
    goNext,
    goPrev,
    waMsg,
    dlMsg,
    handleDownload,
    handleWhatsApp,
  };
};
