import { useState, useMemo, useCallback } from "react";
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

export const LEAVE_STATUS_META = {
  PENDING:   { label: "Pending",   classes: "bg-amber-50 text-amber-700 border border-amber-200"    },
  APPROVED:  { label: "Approved",  classes: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  REJECTED:  { label: "Rejected",  classes: "bg-red-50 text-red-700 border border-red-200"          },
  CANCELLED: { label: "Cancelled", classes: "bg-gray-100 text-gray-500 border border-gray-200"      },
};

// ── Mock data ─────────────────────────────────────────────────────────────

export const MOCK_BALANCES: LeaveBalance[] = [
  { type: "CASUAL",    label: "Casual Leave",    total: 12, used: 4,  remaining: 8,  accentColor: "sky"    },
  { type: "SICK",      label: "Sick Leave",      total: 10, used: 2,  remaining: 8,  accentColor: "rose"   },
  { type: "PERSONAL",  label: "Personal Leave",  total: 6,  used: 1,  remaining: 5,  accentColor: "violet" },
  { type: "EMERGENCY", label: "Emergency Leave", total: 3,  used: 0,  remaining: 3,  accentColor: "amber"  },
];

export const MOCK_LEAVE_HISTORY: LeaveApplication[] = [
  {
    id: "l1",
    type: "CASUAL",
    fromDate: "2025-04-03",
    toDate: "2025-04-04",
    totalDays: 2,
    reason: "Family function — sister's wedding ceremony.",
    substituteArrangement: "Mr. Praveen Kumar will cover my classes.",
    status: "APPROVED",
    appliedOn: "2025-03-28",
    reviewedBy: "Mr. Rao (Principal)",
    reviewedOn: "2025-03-30",
  },
  {
    id: "l2",
    type: "SICK",
    fromDate: "2025-03-17",
    toDate: "2025-03-19",
    totalDays: 3,
    reason: "Viral fever and doctor advised bed rest for 3 days.",
    medicalCertUrl: "/uploads/cert-l2.pdf",
    status: "APPROVED",
    appliedOn: "2025-03-17",
    reviewedBy: "Mr. Rao (Principal)",
    reviewedOn: "2025-03-18",
  },
  {
    id: "l3",
    type: "PERSONAL",
    fromDate: "2025-02-20",
    toDate: "2025-02-20",
    totalDays: 1,
    reason: "Personal work — bank-related documentation.",
    substituteArrangement: "Ms. Divya Reddy will handle the period.",
    status: "APPROVED",
    appliedOn: "2025-02-18",
    reviewedBy: "Mr. Rao (Principal)",
    reviewedOn: "2025-02-19",
  },
  {
    id: "l4",
    type: "CASUAL",
    fromDate: "2025-05-08",
    toDate: "2025-05-09",
    totalDays: 2,
    reason: "Attending a family event outstation.",
    substituteArrangement: "Mr. Anand will cover Mathematics periods.",
    status: "PENDING",
    appliedOn: "2025-04-14",
  },
  {
    id: "l5",
    type: "EMERGENCY",
    fromDate: "2025-01-10",
    toDate: "2025-01-10",
    totalDays: 1,
    reason: "Medical emergency — father hospitalised.",
    status: "APPROVED",
    appliedOn: "2025-01-10",
    reviewedBy: "Mr. Rao (Principal)",
    reviewedOn: "2025-01-10",
  },
  {
    id: "l6",
    type: "SICK",
    fromDate: "2025-06-02",
    toDate: "2025-06-03",
    totalDays: 2,
    reason: "Seasonal flu.",
    status: "PENDING",
    appliedOn: "2025-04-14",
  },
];

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

    // Find if this date falls in any approved/pending leave
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
  // Data (replace with useQuery in production)
  const [leaveHistory, setLeaveHistory] = useState<LeaveApplication[]>(MOCK_LEAVE_HISTORY);
  const balances = MOCK_BALANCES;

  // Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [form, setForm] = useState<ApplyLeaveFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    setApplyModalOpen(true);
  };
  const closeApplyModal = () => setApplyModalOpen(false);

  const submitLeave = useCallback(async () => {
    if (!formValid || !form.type) return;
    setSubmitting(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 900));
    const newApp: LeaveApplication = {
      id: `l${Date.now()}`,
      type: form.type,
      fromDate: form.fromDate,
      toDate: form.toDate,
      totalDays,
      reason: form.reason,
      substituteArrangement: form.substituteArrangement || undefined,
      status: "PENDING",
      appliedOn: toISO(new Date()),
    };
    setLeaveHistory(prev => [newApp, ...prev]);
    setSubmitting(false);
    setSubmitSuccess(true);
  }, [form, formValid, totalDays]);

  // ── Cancel ───────────────────────────────────────────────────────────────

  const confirmCancel = useCallback((id: string) => setCancelId(id), []);
  const closeCancel   = useCallback(() => setCancelId(null), []);

  const doCancel = useCallback(() => {
    if (!cancelId) return;
    setLeaveHistory(prev =>
      prev.map(l => l.id === cancelId ? { ...l, status: "CANCELLED" as const } : l)
    );
    setCancelId(null);
  }, [cancelId]);

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
      { id: "__preview__", type: form.type!, fromDate: form.fromDate, toDate: form.toDate,
        totalDays, reason: "", status: "PENDING", appliedOn: "" }
    ]);
  }, [form.fromDate, form.toDate, form.type, totalDays]);

  const previewMonthLabel = form.fromDate
    ? parseISO(form.fromDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "";

  return {
    // data
    balances,
    leaveHistory,
    // modal
    applyModalOpen, openApplyModal, closeApplyModal,
    form, patchForm,
    totalDays, needsMedicalCert, formValid,
    submitting, submitSuccess, submitLeave,
    // cancel
    cancelId, confirmCancel, closeCancel, doCancel,
    // calendar
    calendarDays, calMonthLabel, prevMonth, nextMonth,
    calYear, calMonth,
    // preview
    previewDays, previewMonthLabel,
  };
};
