import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { usePayrollStore } from "../store/usePayrollStore";
import {
  getAllPayroll, updatePayrollById, deletePayrollById,
  getAllPayslips, createPayslip, deletePayslipById,
  getPayrollHistory, getMonthlyPaidPayroll,
} from "@/services/payroll.api";
import { getAllStaff } from "@/services/staff.api";
import { useUIStore } from "@/store/uiStore";
import type { SalaryConfig, SalaryFormData, StaffPayroll, PayrollSummary, PayslipResult } from "../types/payroll.types";


export const usePayroll = () => {
  const {
    staffData,
    isProcessed,
    processedDate,
    processedBy,
    processPayroll,
    paySalary,
    paySelected,
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
    paySalary,
    paySelected,
    getAttendanceDeductions,
  };
};


function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export const useSalaryConfig = () => {
  const [salaryData, setSalaryData]     = useState<SalaryConfig[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [editingStaff, setEditingStaff] = useState<SalaryConfig | null>(null);
  const [isEditing, setIsEditing]       = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [payrollRes, staffRes] = await Promise.all([
        getAllPayroll(),
        getAllStaff(),
      ]);

      const staffMap = new Map(
        (staffRes.data ?? []).map((s) => [s.id, s])
      );

      const configs: SalaryConfig[] = (payrollRes.data ?? []).map((p) => {
        const staff   = staffMap.get(p.staff_id);
        const basic   = staff?.salary ?? 0;
        const hra     = p.hra                ?? 0;
        const transport = p.transport_allowance ?? 0;
        const other   = p.other_allowance    ?? 0;
        const tds     = p.tds_monthly        ?? 0;
        const pfPct   = p.pf_percentage      ?? 0;
        const profTax = p.professional_tax   ?? 0;
        const gross   = basic + hra + transport + other;
        const pf      = (basic * pfPct) / 100;
        const net     = gross - (pf + profTax + tds);
        const name    = staff?.name ?? "Unknown";

        return {
          id:              p.id,
          name,
          initials:        initials(name),
          role:            staff?.role ?? "—",
          basic,
          hra,
          transport,
          other,
          tds,
          pfPercentage:    pfPct,
          professionalTax: profTax,
          gross,
          net,
          effectiveFrom:   p.effective_from ?? "",
        };
      });

      setSalaryData(configs);
    } catch {
      toast.error("Failed to load salary data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openEditModal = (staff: SalaryConfig | null) => {
    setEditingStaff(staff);
    setIsEditing(true);
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setEditingStaff(null);
  };

  const updateSalary = async (id: string, data: SalaryFormData) => {
    try {
      await updatePayrollById(id, {
        pf_percentage:       data.pfPercentage,
        hra:                 data.hra,
        professional_tax:    data.professionalTax,
        transport_allowance: data.transportAllowance,
        tds_monthly:         data.tds,
        other_allowance:     data.otherAllowance,
        effective_from:      data.effectiveFrom,
      });
      toast.success("Salary updated");
      loadData();
    } catch {
      toast.error("Failed to update salary");
    }
  };

  const deletePayroll = async (id: string) => {
    try {
      await deletePayrollById(id);
      toast.success("Payroll record deleted");
      loadData();
    } catch {
      toast.error("Failed to delete payroll record");
    }
  };

  return {
    salaryData,
    isLoading,
    selectedStaff: editingStaff,
    editingStaff,
    isEditing,
    openEditModal,
    closeEditModal,
    updateSalary,
    deletePayroll,
    refresh: loadData,
  };
};


const MONTH_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const usePayrollHistory = () => {
  const academicYearId = useUIStore((s) => s.academicYearId) ?? "";

  const [history,    setHistory]    = useState<import("../types/payroll.types").PayrollHistory[]>([]);
  const [summary,    setSummary]    = useState({ totalGross: 0, totalDeductions: 0, totalNetPaid: 0 });
  const [trendData,  setTrendData]  = useState<import("../types/payroll.types").TrendPoint[]>([]);
  const [staffCount, setStaffCount] = useState(0);
  const [isLoading,  setIsLoading]  = useState(true);

  useEffect(() => {
    setIsLoading(true);

    // Phase 1 — critical data (history + staff count)
    Promise.all([getPayrollHistory(), getAllStaff()])
      .then(([res, sRes]) => {
        if (res.status) {
          setHistory(res.data.map((r) => ({
            month:           `${MONTH_NAMES[r.month]} ${r.year}`,
            year:            r.year,
            staffCount:      r.staff_count,
            totalGross:      r.gross_salary,
            totalDeductions: r.total_deductions,
            netPaid:         r.net_paid,
            paymentDate:     r.payment_date ?? "—",
            mode:            r.payment_mode,
            status:          r.payment_status,
          })));
          setSummary({
            totalGross:      res.summary.total_gross_salary,
            totalDeductions: res.summary.total_deductions,
            totalNetPaid:    res.summary.total_net_paid,
          });
        }
        setStaffCount(sRes.count ?? (sRes.data ?? []).length);
      })
      .catch(() => toast.error("Failed to load payroll history"))
      .finally(() => setIsLoading(false));

    // Phase 2 — trend chart in background (non-blocking)
    // 10 consecutive months ending at the current month
    const now = new Date();
    const months = Array.from({ length: 10 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 9 + i, 1);
      return { month: d.getMonth() + 1, label: MONTH_NAMES[d.getMonth() + 1].toUpperCase() };
    });
    if (academicYearId) {
      Promise.all(
        months.map((m) =>
          getMonthlyPaidPayroll(m.month, academicYearId)
            .then((r) => ({ label: m.label, amount: r.status ? r.data.total_paid : 0 }))
            .catch(() => ({ label: m.label, amount: 0 }))
        )
      ).then(setTrendData);
    } else {
      setTrendData(months.map((m) => ({ label: m.label, amount: 0 })));
    }
  }, [academicYearId]);

  const nonZeroMonths = trendData.filter((t) => t.amount > 0);
  const avgMonthlyPayroll = nonZeroMonths.length > 0
    ? nonZeroMonths.reduce((s, t) => s + t.amount, 0) / nonZeroMonths.length
    : 0;

  return {
    history,
    isLoading,
    trendData,
    totalPayrollFY:    summary.totalNetPaid,
    avgMonthlyPayroll,
    staffCount,
  };
};


function toInitials(name: string) {
  return name.split(" ").map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase();
}

export const useMonthlyPayrollData = (month: number, year: number) => {
  const academicYearId = useUIStore((s) => s.academicYearId) ?? "";

  const [payslipsList,    setPayslipsList]    = useState<Awaited<ReturnType<typeof getAllPayslips>>["data"]>([]);
  const [payrollConfigs,  setPayrollConfigs]  = useState<Awaited<ReturnType<typeof getAllPayroll>>["data"]>([]);
  const [staffList,       setStaffList]       = useState<Awaited<ReturnType<typeof getAllStaff>>["data"]>([]);
  const [isLoading,       setIsLoading]       = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [payslipRes, payrollRes, staffRes] = await Promise.all([
        getAllPayslips(),
        getAllPayroll(),
        getAllStaff(),
      ]);
      setPayslipsList(payslipRes.data ?? []);
      setPayrollConfigs(payrollRes.data ?? []);
      setStaffList(staffRes.data ?? []);
    } catch {
      toast.error("Failed to load payroll data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const staffData = useMemo<StaffPayroll[]>(() => {
    const staffMap   = new Map(staffList.map((s) => [s.id, s]));
    const payslipMap = new Map(
      payslipsList
        .filter((p) => p.month === month && p.year === year)
        .map((p) => [p.staff_id, p])
    );

    return payrollConfigs.map((config) => {
      const staff    = staffMap.get(config.staff_id);
      const payslip  = payslipMap.get(config.staff_id);
      const name     = staff?.name ?? "Unknown";
      const initials = toInitials(name);

      if (payslip) {
        const bonus      = payslip.bonus      ?? 0;
        const overtime   = payslip.overtime   ?? 0;
        const extraClass = payslip.extra_class_payment ?? 0;
        const leaveDed   = payslip.leave_deduction ?? 0;
        return {
          id:              payslip.staff_id,
          payrollId:       config.id,
          payslipId:       payslip.id,
          name:            payslip.staff_name ?? name,
          initials,
          role:            staff?.role ?? "—",
          present:         payslip.present_days,
          absent:          payslip.absent_days,
          gross:           payslip.gross_salary,
          bonus,
          overtime,
          extraClass,
          leaveDeductions: leaveDed,
          otherDeductions: 0,
          adjustments:     bonus + overtime + extraClass - leaveDed,
          deductions:      payslip.total_deductions ?? 0,
          net:             payslip.net_salary,
          status:          payslip.payment_status === "Paid" ? "Paid" : "Pending",
          paymentDate:     payslip.payment_date ?? undefined,
        } satisfies StaffPayroll;
      }

      // No payslip yet — Draft row
      const basic     = staff?.salary ?? 0;
      const hra       = config.hra    ?? 0;
      const transport = config.transport_allowance ?? 0;
      const other     = config.other_allowance ?? 0;
      const pfPct     = config.pf_percentage ?? 0;
      const profTax   = config.professional_tax ?? 0;
      const tds       = config.tds_monthly ?? 0;
      const gross     = basic + hra + transport + other;
      const pf        = (basic * pfPct) / 100;
      const deductions = pf + profTax + tds;
      return {
        id:              config.staff_id,
        payrollId:       config.id,
        name,
        initials,
        role:            staff?.role ?? "—",
        present:         0,
        absent:          0,
        gross,
        bonus:           0,
        overtime:        0,
        extraClass:      0,
        leaveDeductions: 0,
        otherDeductions: 0,
        adjustments:     0,
        deductions,
        net:             gross - deductions,
        status:          "Draft" as const,
      } satisfies StaffPayroll;
    });
  }, [payslipsList, payrollConfigs, staffList, month, year]);

  const summary = useMemo<PayrollSummary>(() => ({
    totalStaff:        staffData.length,
    totalGross:        staffData.reduce((s, x) => s + x.gross, 0),
    totalDeductions:   staffData.reduce((s, x) => s + x.deductions, 0),
    totalNet:          staffData.reduce((s, x) => s + x.net, 0),
    month:             new Date(year, month - 1).toLocaleString("default", { month: "short" }),
    year,
    processingDueDate: "",
  }), [staffData, month, year]);

  const isProcessed = staffData.some((s) => s.status !== "Draft");

  const generatePayslip = async (
    staff: StaffPayroll,
    bonus: number,
    overtime: number,
    extraClass: number,
  ): Promise<PayslipResult> => {
    let result: PayslipResult | null = null;
    try {
      const res = await createPayslip({
        staff_id:            staff.id,
        month,
        year,
        payroll_id:          staff.payrollId,
        ...(academicYearId ? { academicYearId } : {}),
        bonus,
        overtime,
        extra_class_payment: extraClass,
      });
      if (res.status) {
        toast.success("Payslip generated successfully");
        loadData();
        result = {
          presentDays:     res.data.present_days,
          absentDays:      res.data.absent_days,
          netSalary:       res.data.net_salary,
          grossSalary:     res.data.gross_salary,
          totalDeductions: res.data.deductions?.total_deductions ?? 0,
        };
      } else {
        toast.error(res.message || "Failed to generate payslip");
      }
    } catch {
      toast.error("Failed to generate payslip");
    }
    if (!result) throw new Error();
    return result;
  };

  const deletePayslip = async (staff: StaffPayroll) => {
    try {
      if (staff.payslipId) {
        await deletePayslipById(staff.payslipId);
        toast.success("Payslip deleted");
      } else if (staff.payrollId) {
        await deletePayrollById(staff.payrollId);
        toast.success("Payroll record deleted");
      } else {
        toast.error("Nothing to delete");
        return;
      }
      loadData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return {
    staffData,
    summary,
    isLoading,
    isProcessed,
    processedDate: null as string | null,
    processedBy:   null as string | null,
    generatePayslip,
    deletePayslip,
    refresh: loadData,
  };
};