import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePayrollStore } from "../store/usePayrollStore";
import {
  getAllPayroll, updatePayrollById, deletePayrollById,
  getAllPayslips, createPayslip, deletePayslipById,
  getPayrollHistory, getMonthlyPaidPayroll,
} from "@/services/payroll.api";
import { getAllStaff } from "@/services/staff.api";
import { useUIStore } from "@/store/uiStore";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { SalaryConfig, SalaryFormData, StaffPayroll, PayrollSummary, PayslipResult } from "../types/payroll.types";

export type PayrollTab = "structure" | "monthly" | "history";

// Query keys centralized here so mutations below can invalidate precisely —
// mirrors the pattern in src/features/accountant/ledger/hooks/useledger.ts.
// `monthly` and `history`/`historyTrend` are prefixes: invalidateQueries matches
// them fuzzily, so invalidating ["payroll","monthly"] clears every month/year
// variant without us having to track each one individually.
const payrollKeys = {
  salaryConfig: ["payroll", "salary-config"] as const,
  monthly: ["payroll", "monthly"] as const,
  history: ["payroll", "history"] as const,
  historyTrend: (academicYearId: string) => ["payroll", "history-trend", academicYearId] as const,
};

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

/**
 * @param activeTab  Which Payroll tab is currently open. The fetch only runs
 *                    while the Salary Structure tab is visible; switching
 *                    tabs (or revisiting within the global 5-minute staleTime,
 *                    see src/config/queryClient.ts) never re-fires it.
 */
export const useSalaryConfig = (activeTab: PayrollTab = "structure") => {
  const queryClient = useQueryClient();
  const [editingStaff, setEditingStaff] = useState<SalaryConfig | null>(null);
  const [isEditing, setIsEditing]       = useState(false);

  const query = useQuery({
    queryKey: payrollKeys.salaryConfig,
    queryFn: async (): Promise<SalaryConfig[]> => {
      const [payrollRes, staffRes] = await Promise.all([
        getAllPayroll(),
        getAllStaff(),
      ]);

      const staffMap = new Map(
        (staffRes.data ?? []).map((s) => [s.id, s])
      );

      return (payrollRes.data ?? []).map((p) => {
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
    },
    enabled: activeTab === "structure",
  });
  if (query.isError) toast.error(getErrorMessage(query.error, "Failed to load salary data"));

  const salaryData = query.data ?? [];
  const isLoading  = query.isLoading;

  // Editing a payroll config's amounts also affects the Monthly Payroll tab
  // (it reads the same getAllPayroll() rows as "payrollConfigs"), so both
  // query buckets are invalidated together — not just this hook's own tab.
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: payrollKeys.salaryConfig });
    queryClient.invalidateQueries({ queryKey: payrollKeys.monthly });
  };

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
      invalidate();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update salary"));
    }
  };

  const deletePayroll = async (id: string) => {
    try {
      await deletePayrollById(id);
      toast.success("Payroll record deleted");
      invalidate();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete payroll record"));
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
    refresh: () => queryClient.invalidateQueries({ queryKey: payrollKeys.salaryConfig }),
  };
};


const MONTH_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * @param activeTab  Which Payroll tab is currently open. Both queries below
 *                    only run while the Payroll History tab is visible.
 */
export const usePayrollHistory = (activeTab: PayrollTab = "history") => {
  const academicYearId = useUIStore((s) => s.academicYearId) ?? "";

  // Phase 1 — critical data (history rows + staff count).
  const historyQuery = useQuery({
    queryKey: payrollKeys.history,
    queryFn: async () => {
      const [res, sRes] = await Promise.all([getPayrollHistory(), getAllStaff()]);

      const history = res.status
        ? res.data.map((r) => ({
            month:           `${MONTH_NAMES[r.month]} ${r.year}`,
            year:            r.year,
            staffCount:      r.staff_count,
            totalGross:      r.gross_salary,
            totalDeductions: r.total_deductions,
            netPaid:         r.net_paid,
            paymentDate:     r.payment_date ?? "—",
            mode:            r.payment_mode,
            status:          r.payment_status,
          }))
        : [];

      const summary = res.status
        ? {
            totalGross:      res.summary.total_gross_salary,
            totalDeductions: res.summary.total_deductions,
            totalNetPaid:    res.summary.total_net_paid,
          }
        : { totalGross: 0, totalDeductions: 0, totalNetPaid: 0 };

      const staffCount = sRes.count ?? (sRes.data ?? []).length;

      return { history, summary, staffCount };
    },
    enabled: activeTab === "history",
  });
  if (historyQuery.isError) toast.error(getErrorMessage(historyQuery.error, "Failed to load payroll history"));

  // Phase 2 — trend chart (background, independent query). Still 10 parallel
  // getMonthlyPaidPayroll() calls via Promise.all (unchanged batching from the
  // original effect), but now gated on the History tab being active AND an
  // academic year being selected, and cached per academicYearId so revisiting
  // the tab within the 5-minute staleTime does not refire the 10 calls.
  const trendQuery = useQuery({
    queryKey: payrollKeys.historyTrend(academicYearId),
    queryFn: async () => {
      const now = new Date();
      const months = Array.from({ length: 10 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 9 + i, 1);
        return { month: d.getMonth() + 1, label: MONTH_NAMES[d.getMonth() + 1].toUpperCase() };
      });

      return Promise.all(
        months.map((m) =>
          getMonthlyPaidPayroll(m.month, academicYearId)
            .then((r) => ({ label: m.label, amount: r.status ? r.data.total_paid : 0 }))
            .catch(() => ({ label: m.label, amount: 0 }))
        )
      );
    },
    enabled: activeTab === "history" && !!academicYearId,
  });

  const fallbackTrend = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 10 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 9 + i, 1);
      return { label: MONTH_NAMES[d.getMonth() + 1].toUpperCase(), amount: 0 };
    });
  }, []);

  const history   = historyQuery.data?.history ?? [];
  const isLoading = historyQuery.isLoading;
  const trendData = trendQuery.data ?? (academicYearId ? [] : fallbackTrend);

  const nonZeroMonths = trendData.filter((t) => t.amount > 0);
  const avgMonthlyPayroll = nonZeroMonths.length > 0
    ? nonZeroMonths.reduce((s, t) => s + t.amount, 0) / nonZeroMonths.length
    : 0;

  return {
    history,
    isLoading,
    trendData,
    totalPayrollFY:    historyQuery.data?.summary.totalNetPaid ?? 0,
    avgMonthlyPayroll,
    staffCount:        historyQuery.data?.staffCount ?? 0,
  };
};


function toInitials(name: string) {
  return name.split(" ").map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase();
}

/**
 * @param activeTab  Which Payroll tab is currently open. Defaults to
 *                    "monthly" so standalone callers (e.g. PaySalaryPage,
 *                    which only needs `generatePayslip` and isn't one of the
 *                    3 PayrollPage tabs) keep fetching eagerly as before.
 *                    The underlying fetch doesn't depend on month/year (it
 *                    loads all payslips/configs/staff and filters client-side
 *                    below), so the query key intentionally omits them —
 *                    navigating months never needs to refire the request.
 */
export const useMonthlyPayrollData = (month: number, year: number, activeTab: PayrollTab = "monthly") => {
  const academicYearId = useUIStore((s) => s.academicYearId) ?? "";
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: payrollKeys.monthly,
    queryFn: async () => {
      const [payslipRes, payrollRes, staffRes] = await Promise.all([
        getAllPayslips(),
        getAllPayroll(),
        getAllStaff(),
      ]);
      return {
        payslipsList:   payslipRes.data ?? [],
        payrollConfigs: payrollRes.data ?? [],
        staffList:      staffRes.data ?? [],
      };
    },
    enabled: activeTab === "monthly",
  });
  if (query.isError) toast.error(getErrorMessage(query.error, "Failed to load payroll data"));

  const payslipsList   = query.data?.payslipsList ?? [];
  const payrollConfigs = query.data?.payrollConfigs ?? [];
  const staffList      = query.data?.staffList ?? [];
  const isLoading      = query.isLoading;

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

  const invalidateMonthly = () => queryClient.invalidateQueries({ queryKey: payrollKeys.monthly });

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
        invalidateMonthly();
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
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to generate payslip"));
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
        // A payroll config row was removed — Salary Structure tab shares
        // that same getAllPayroll() data, so it needs invalidating too.
        queryClient.invalidateQueries({ queryKey: payrollKeys.salaryConfig });
      } else {
        toast.error("Nothing to delete");
        return;
      }
      invalidateMonthly();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete"));
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
    refresh: invalidateMonthly,
  };
};
