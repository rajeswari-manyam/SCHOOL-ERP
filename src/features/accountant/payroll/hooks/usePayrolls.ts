import { useMemo } from "react";
import { usePayrollStore } from "../store/usePayrollStore";


export const usePayroll = () => {
  const {
    staffData,
    isProcessed,
    processedDate,
    processedBy,
    processPayroll,
    getAttendanceDeductions,
  } = usePayrollStore();

  const summary = useMemo(() => {
    const now = new Date();
    return {
      totalStaff: staffData.length,
      totalGross: staffData.reduce((sum, s) => sum + s.gross, 0),
      totalDeductions: staffData.reduce((sum, s) => sum + s.deductions, 0),
      totalNet: staffData.reduce((sum, s) => sum + s.net, 0),
      month: now.toLocaleString("default", { month: "short" }),
      year: now.getFullYear(),
      processingDueDate: "1 May 2025",
    };
  }, [staffData]);

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


export const useSalaryConfig = () => {
  const {
    salaryData,
    editingStaff,
    isEditing,
    openEditModal,
    closeEditModal,
    updateSalary,
  } = usePayrollStore();

  const totalMonthlyGross = useMemo(
    () => salaryData.reduce((sum, s) => sum + s.gross, 0),
    [salaryData]
  );

  const totalNetPayable = useMemo(
    () => salaryData.reduce((sum, s) => sum + s.net, 0),
    [salaryData]
  );

  return {
    salaryData,
    selectedStaff: editingStaff,
    editingStaff,
    isEditing,
    totalMonthlyGross,
    totalNetPayable,
    openEditModal,
    closeEditModal,
    updateSalary,
  };
};


export const usePayrollHistory = () => {
  const { history } = usePayrollStore();

  const totalPayrollFY = useMemo(
    () => history.reduce((sum, h) => sum + h.netPaid, 0),
    [history]
  );

  const avgMonthlyPayroll = useMemo(
    () => totalPayrollFY / history.length,
    [totalPayrollFY, history.length]
  );

  return {
    history,
    totalPayrollFY,
    avgMonthlyPayroll,
    staffCount: 28,
  };
};