import { useState } from "react";
import {
  initialStaffData,
  attendanceDeductionsData,
  initialSalaryData,
  initialHistory,
} from "../data/payroll.data";
import type {
  StaffPayroll,
  PayrollSummary,
  AttendanceDeduction,
  PayrollHistory,
  SalaryConfig,
  SalaryFormData,
} from "../types/payroll.types";

// ─── usePayroll ──────────────────────────────────────────────────────────────

export const usePayroll = () => {
  const [staffData, setStaffData] = useState<StaffPayroll[]>(initialStaffData);
  const [isProcessed, setIsProcessed] = useState(false);
  const [processedDate, setProcessedDate] = useState<string | null>(null);
  const [processedBy, setProcessedBy] = useState<string | null>(null);

  const summary: PayrollSummary = {
    totalStaff: staffData.length,
    totalGross: staffData.reduce((sum, s) => sum + s.gross, 0),
    totalDeductions: staffData.reduce((sum, s) => sum + s.deductions, 0),
    totalNet: staffData.reduce((sum, s) => sum + s.net, 0),
    month: "April",
    year: 2025,
    processingDueDate: "1 May 2025",
  };

  const processPayroll = (_input: {
    paymentMode: string;
    paymentDate: string;
    approvalNote?: string;
  }) => {
    setStaffData((prev) =>
      prev.map((s) => ({ ...s, status: "Processed" as const }))
    );
    setIsProcessed(true);
    setProcessedDate(
      new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
    setProcessedBy("Ramu Teja");
  };

  const getAttendanceDeductions = (): AttendanceDeduction[] =>
    attendanceDeductionsData;

  return {
    staffData,
    summary,
    isProcessed,
    processedDate,
    processedBy,
    processPayroll,
    getAttendanceDeductions,
  };
};

// ─── useSalaryConfig ─────────────────────────────────────────────────────────

export const useSalaryConfig = () => {
  const [salaryData, setSalaryData] =
    useState<SalaryConfig[]>(initialSalaryData);
  const [editingStaff, setEditingStaff] = useState<SalaryConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const totalMonthlyGross = salaryData.reduce((sum, s) => sum + s.gross, 0);
  const totalNetPayable = salaryData.reduce((sum, s) => sum + s.net, 0);

  // Alias kept for any component still referencing selectedStaff
  const selectedStaff = editingStaff;

  const openEditModal = (staff: SalaryConfig) => {
    setEditingStaff(staff);
    setIsEditing(true);
  };

  const closeEditModal = () => {
    setEditingStaff(null);
    setIsEditing(false);
  };

  const updateSalary = (id: string, data: SalaryFormData) => {
    setSalaryData((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const gross =
          data.basicSalary +
          data.hra +
          data.transportAllowance +
          data.otherAllowance;
        const net =
          gross -
          (data.pfPercentage / 100) * gross -
          data.professionalTax -
          data.tds;
        return {
          ...s,
          basic: data.basicSalary,
          hra: data.hra,
          transport: data.transportAllowance,
          other: data.otherAllowance,
          pfPercentage: data.pfPercentage,
          professionalTax: data.professionalTax,
          effectiveFrom: data.effectiveFrom,
          gross,
          net,
        };
      })
    );
    closeEditModal();
  };

  return {
    salaryData,
    selectedStaff,
    editingStaff,
    setEditingStaff,
    isEditing,
    totalMonthlyGross,
    totalNetPayable,
    openEditModal,
    closeEditModal,
    updateSalary,
  };
};

// ─── usePayrollHistory ───────────────────────────────────────────────────────

export const usePayrollHistory = () => {
  const [history] = useState<PayrollHistory[]>(initialHistory);

  const totalPayrollFY = history.reduce((sum, h) => sum + h.netPaid, 0);
  const avgMonthlyPayroll = totalPayrollFY / history.length;

  return {
    history,
    totalPayrollFY,
    avgMonthlyPayroll,
    staffCount: 28,
  };
};