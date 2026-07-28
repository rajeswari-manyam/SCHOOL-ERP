import { useState, useMemo, useCallback, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { leaveApi } from "@/services/teacher-leave.api";
import type {
  LeaveBalance,
  LeaveApplication,
  ApplyLeaveFormData,
  LeaveType,
  LeaveCalendarDay,
} from "../types/leave.types";

// ── Constants ─────────────────────────────────────────────────────────────

export const LEAVE_TYPE_META: Record<
  LeaveType,
  { label: string; shortLabel: string; color: string; bg: string; border: string; dot: string }
> = {
  CASUAL:    { label: "Casual Leave",    shortLabel: "Casual",    color: "text-sky-700",     bg: "bg-sky-50",     border: "border-sky-200",     dot: "bg-sky-500"     },
  SICK:      { label: "Sick Leave",      shortLabel: "Sick",      color: "text-rose-700",    bg: "bg-rose-50",    border: "border-rose-200",    dot: "bg-rose-500"    },
  PERSONAL:  { label: "Personal Leave",  shortLabel: "Personal",  color: "text-violet-700",  bg: "bg-violet-50",  border: "border-violet-200",  dot: "bg-violet-500"  },
  EMERGENCY: { label: "Emergency Leave", shortLabel: "Emergency", color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   dot: "bg-amber-500"   },
};

export const LEAVE_STATUS_META: Record<string, { label: string; classes: string }> = {
  PENDING:   { label: "Pending",   classes: "bg-amber-50 text-amber-700 border border-amber-200"    },
  APPROVED:  { label: "Approved",  classes: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  REJECTED:  { label: "Rejected",  classes: "bg-red-50 text-red-700 border border-red-200"          },
  CANCELLED: { label: "Cancelled", classes: "bg-gray-100 text-gray-500 border border-gray-200"      },
};

// ── Public holidays (for calendar highlighting) ───────────────────────────

export const HOLIDAYS: Record<string, string> = {
  "2025-04-14": "Dr. Ambedkar Jayanti",
  "2025-04-18": "Good Friday",
  "2025-05-01": "Labour Day",
  "2025-06-07": "Eid-ul-Adha",
};

// ── Helpers ───────────────────────────────────────────────────────────────

export const toISO = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const parseISO = (s: string): Date => new Date(s + "T00:00:00");

/** Count working days (Mon–Sat) between two dates inclusive */
export const countWorkingDays = (from: string, to: string): number => {
  if (!from || !to) return 0;
  const start = parseISO(from);
  const end   = parseISO(to);
  if (end < start) return 0;
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    if (cur.getDay() !== 0) count++; // exclude Sunday
    cur.setDate(cur.getDate() + 1);
  }
  return count;
};

export const formatDisplayDate = (iso: string): string => {
  if (!iso) return "—";
  return parseISO(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/** Build calendar days for a given year/month */
export const buildCalendarMonth = (
  year: number,
  month: number, // 0-indexed
  leaveHistory: LeaveApplication[]
): LeaveCalendarDay[] => {
  const today = toISO(new Date());
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: LeaveCalendarDay[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dow = new Date(date + "T00:00:00").getDay();
    const isWeekend = dow === 0; // Sunday only (Sat is working)

    const leave = leaveHistory.find(l => {
      const from = parseISO(l.fromDate);
      const to   = parseISO(l.toDate);
      const cur  = parseISO(date);
      return cur >= from && cur <= to && (l.status === "APPROVED" || l.status === "PENDING");
    });

    days.push({
      date,
      isLeave: !!leave,
      leaveType: leave?.type,
      leaveStatus: leave?.status,
      isToday: date === today,
      isWeekend,
      isHoliday: !!HOLIDAYS[date],
      holidayLabel: HOLIDAYS[date],
    });
  }
  return days;
};

// ── Hook ──────────────────────────────────────────────────────────────────

const EMPTY_FORM: ApplyLeaveFormData = {
  type: null,
  fromDate: "",
  toDate: "",
  reason: "",
  substituteArrangement: "",
  medicalCertFile: null,
};

export const useLeave = () => {
  const user = useAuthStore(s => s.user);
  const staffId = localStorage.getItem("teacherStaffId") || user?.id || "";
  const academicYearId = useUIStore(s => s.academicYearId);

  const [leaveHistory, setLeaveHistory] = useState<LeaveApplication[]>([]);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [leaveTotals, setLeaveTotals] = useState({ totalAllocated: 0, totalUsed: 0, totalBalance: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!staffId) {
      setError("No staff ID found. Please log in again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [balResult, history] = await Promise.all([
        leaveApi.getLeaveBalances(staffId, academicYearId),
        leaveApi.getLeaveHistory(staffId),
      ]);
      setBalances(Array.isArray(balResult.balances) ? balResult.balances : []);
      setLeaveTotals({ totalAllocated: balResult.totalAllocated, totalUsed: balResult.totalUsed, totalBalance: balResult.totalBalance });
      setLeaveHistory(history);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "Failed to load leave data";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [staffId, academicYearId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [form, setForm] = useState<ApplyLeaveFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Cancel confirm state
  const [cancelId, setCancelId] = useState<string | null>(null);

  // Calendar month
  const [calYear,  setCalYear]  = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());

  // ── Form helpers ────────────────────────────────────────────────────────

  const patchForm = useCallback((patch: Partial<ApplyLeaveFormData>) =>
    setForm(f => ({ ...f, ...patch })), []);

  const totalDays = useMemo(() =>
    countWorkingDays(form.fromDate, form.toDate), [form.fromDate, form.toDate]);

  const needsMedicalCert = form.type === "SICK" && totalDays >= 3;

  const formValid = !!(
    form.type &&
    form.fromDate &&
    form.toDate &&
    totalDays > 0 &&
    form.reason.trim().length >= 10 &&
    (!needsMedicalCert || form.medicalCertFile)
  );

  const openApplyModal = () => {
    setForm(EMPTY_FORM);
    setSubmitSuccess(false);
    setSubmitError(null);
    setApplyModalOpen(true);
  };
  const closeApplyModal = () => setApplyModalOpen(false);

  const submitLeave = useCallback(async () => {
    if (!formValid || !form.type) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const newApp = await leaveApi.applyLeave(form, staffId, totalDays, academicYearId ?? undefined);
      newApp.totalDays = totalDays;
      setLeaveHistory(prev => [newApp, ...prev]);
      setSubmitSuccess(true);
      // Refresh balances so stat cards reflect the new leave
      loadData();
    } catch (err: any) {
      console.error("submitLeave failed", err);
      setSubmitError(err?.response?.data?.message ?? err?.message ?? "Failed to submit leave application");
    } finally {
      setSubmitting(false);
    }
  }, [form, formValid, totalDays, staffId, academicYearId, loadData]);

  // ── Cancel ───────────────────────────────────────────────────────────────

  const confirmCancel = useCallback((id: string) => setCancelId(id), []);
  const closeCancel   = useCallback(() => setCancelId(null), []);

  const doCancel = useCallback(async () => {
    if (!cancelId) return;
    try {
      await leaveApi.cancelLeave(cancelId);
      setLeaveHistory(prev =>
        prev.map(l => l.id === cancelId ? { ...l, status: "CANCELLED" as const } : l)
      );
      // Refresh balances so stat cards restore the cancelled days
      loadData();
    } catch (err: any) {
      console.error("doCancel failed", err);
    }
    setCancelId(null);
  }, [cancelId, loadData]);

  // ── Calendar ─────────────────────────────────────────────────────────────

  const calendarDays = useMemo(
    () => buildCalendarMonth(calYear, calMonth, leaveHistory),
    [calYear, calMonth, leaveHistory]
  );

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const calMonthLabel = new Date(calYear, calMonth, 1)
    .toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  // ── Preview calendar for modal ────────────────────────────────────────────

  const previewDays = useMemo(() => {
    if (!form.fromDate || !form.toDate) return [];
    const from = parseISO(form.fromDate);
    const to   = parseISO(form.toDate);
    if (to < from) return [];
    const year  = from.getFullYear();
    const month = from.getMonth();
    return buildCalendarMonth(year, month, [
      { id: "__preview__", type: (form.type ?? "CASUAL") as LeaveType, fromDate: form.fromDate, toDate: form.toDate,
        totalDays, reason: "", status: "PENDING", appliedOn: "" }
    ]);
  }, [form.fromDate, form.toDate, form.type, totalDays]);

  const previewMonthLabel = form.fromDate
    ? parseISO(form.fromDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "";

  return {
    // data
    balances,
    leaveTotals,
    leaveHistory,
    loading,
    error,
    retry: loadData,
    // modal
    applyModalOpen, openApplyModal, closeApplyModal,
    form, patchForm,
    totalDays, needsMedicalCert, formValid,
    submitting, submitSuccess, submitError, submitLeave,
    // cancel
    cancelId, confirmCancel, closeCancel, doCancel,
    // calendar
    calendarDays, calMonthLabel, prevMonth, nextMonth,
    calYear, calMonth,
    // preview
    previewDays, previewMonthLabel,
  };
};
