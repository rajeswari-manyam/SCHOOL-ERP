import { create } from "zustand";
import type { Fee as LocalFee, PaymentHistory, MonthStatus, ExamTerm } from "../types/fee.types";
import {
  getAllFees,
  getFeeById,
  payFee,
  type Fee as ApiFee,
} from "../../../../services/fee.api";

// ── Month labels in academic year order (Oct → Sep) ───────────────────────────
const ACADEMIC_MONTHS = ["OCT","NOV","DEC","JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP"];
const MONTH_INDEX: Record<string, string> = {
  "0":"JAN","1":"FEB","2":"MAR","3":"APR","4":"MAY","5":"JUN",
  "6":"JUL","7":"AUG","8":"SEP","9":"OCT","10":"NOV","11":"DEC",
};

// ── helpers ────────────────────────────────────────────────────────────────────

function apiToLocalFee(f: ApiFee): LocalFee {
  const today = new Date();
  const due = new Date(f.due_date);
  const diffDays = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));

  let status: LocalFee["status"] = "upcoming";
  if (f.status === "paid") status = "paid";
  else if (f.status === "overdue" || (diffDays > 0 && f.status !== "paid")) status = "overdue";
  else if (f.status === "pending") status = "pending";

  return {
    id: f.id,
    term: f.fee_type,
    dueDate: due.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    amount: f.amount - f.amount_paid,
    status,
    daysOverdue: status === "overdue" && diffDays > 0 ? diffDays : undefined,
    reminder: undefined,
  };
}

function apiToHistory(f: ApiFee): PaymentHistory {
  const paidDate = f.payment_date
    ? new Date(f.payment_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : new Date(f.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return {
    id: f.id,
    date: paidDate,
    feeHead: f.fee_type,
    amount: f.amount_paid,
    mode: f.payment_method || "—",
    receiptNo: f.transaction_id || `TXN-${f.id.slice(0, 8).toUpperCase()}`,
  };
}

/** Build tuition month grid from API fees that look like tuition (fee_type contains "tuition") */
function buildTuitionMonths(allFees: ApiFee[]): MonthStatus[] {
  // Map month label → status from tuition fees
  const tuitionFees = allFees.filter((f) =>
    f.fee_type?.toLowerCase().includes("tuition")
  );

  const monthStatusMap: Record<string, "paid" | "pending" | "overdue" | "upcoming"> = {};
  for (const f of tuitionFees) {
    const date = new Date(f.due_date);
    const monthLabel = MONTH_INDEX[String(date.getMonth())];
    if (monthLabel) monthStatusMap[monthLabel] = f.status as any;
  }

  return ACADEMIC_MONTHS.map((label) => {
    const status = monthStatusMap[label];
    return {
      label,
      paid: status === "paid",
      pending: status === "pending" || status === "overdue",
      upcoming: !status || status === "upcoming",
    };
  });
}

/** Build exam terms from API fees that look like exam fees */
function buildExamTerms(allFees: ApiFee[]): ExamTerm[] {
  const examFees = allFees.filter((f) =>
    f.fee_type?.toLowerCase().includes("exam") ||
    f.fee_type?.toLowerCase().includes("examination") ||
    f.fee_type?.toLowerCase().includes("term")
  );

  if (examFees.length === 0) {
    // Fallback: show all non-tuition fees as exam terms
    return allFees
      .filter((f) => !f.fee_type?.toLowerCase().includes("tuition"))
      .slice(0, 4)
      .map((f, i) => ({
        label: f.fee_type || `Term ${i + 1}`,
        amount: f.amount,
        paid: f.status === "paid",
        pending: f.status === "pending" || f.status === "overdue",
        upcoming: f.status === "upcoming",
      }));
  }

  return examFees.map((f) => ({
    label: f.fee_type,
    amount: f.amount,
    paid: f.status === "paid",
    pending: f.status === "pending" || f.status === "overdue",
    upcoming: f.status === "upcoming",
  }));
}

/** Compute annual summary numbers */
function buildAnnualSummary(allFees: ApiFee[]) {
  const totalPaid = allFees.reduce((sum, f) => sum + (f.amount_paid ?? 0), 0);
  const totalAmount = allFees.reduce((sum, f) => sum + (f.amount ?? 0), 0);
  const totalPending = totalAmount - totalPaid;
  const percentCollected = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;

  return { totalPaid, totalPending, totalAmount, percentCollected };
}

// ── store ──────────────────────────────────────────────────────────────────────

export interface AnnualSummary {
  totalPaid: number;
  totalPending: number;
  totalAmount: number;
  percentCollected: number;
}

interface FeeStore {
  fees: LocalFee[];
  history: PaymentHistory[];
  tuitionMonths: MonthStatus[];
  examTerms: ExamTerm[];
  annualSummary: AnnualSummary;
  selectedFee: LocalFee | null;
  loading: boolean;
  paying: boolean;
  error: string | null;

  fetchFees: (studentId: string) => Promise<void>;
  fetchFeeById: (id: string) => Promise<void>;
  setSelectedFee: (fee: LocalFee | null) => void;
  recordPayment: (
    id: string,
    payload: { amount_paid: number; payment_method: string; transaction_id: string },
    studentId: string
  ) => Promise<void>;
  markPaid: (id: string, mode: string) => void;
}

export const useFeeStore = create<FeeStore>((set, get) => ({
  fees: [],
  history: [],
  tuitionMonths: [],
  examTerms: [],
  annualSummary: { totalPaid: 0, totalPending: 0, totalAmount: 0, percentCollected: 0 },
  selectedFee: null,
  loading: false,
  paying: false,
  error: null,

  fetchFees: async (studentId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await getAllFees({ student_id: studentId });
      if (!res.status) throw new Error(res.message ?? "Failed to load fees");

      const allFees: ApiFee[] = res.data ?? [];

      const pendingFees = allFees.filter((f) => f.status !== "paid").map(apiToLocalFee);
      const historyFees = allFees.filter((f) => f.status === "paid").map(apiToHistory);
      const tuitionMonths = buildTuitionMonths(allFees);
      const examTerms = buildExamTerms(allFees);
      const annualSummary = buildAnnualSummary(allFees);

      set({ fees: pendingFees, history: historyFees, tuitionMonths, examTerms, annualSummary });
    } catch (e: any) {
      set({ error: e.message ?? "Unknown error" });
    } finally {
      set({ loading: false });
    }
  },

  fetchFeeById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await getFeeById(id);
      if (!res.status) throw new Error(res.message ?? "Fee not found");
      set({ selectedFee: apiToLocalFee(res.data) });
    } catch (e: any) {
      set({ error: e.message ?? "Unknown error" });
    } finally {
      set({ loading: false });
    }
  },

  setSelectedFee: (fee) => set({ selectedFee: fee }),

  recordPayment: async (id, payload, studentId) => {
    set({ paying: true, error: null });
    try {
      const res = await payFee(id, payload);
      if (!res.status) throw new Error(res.message ?? "Payment failed");
      await get().fetchFees(studentId);
    } catch (e: any) {
      set({ error: e.message ?? "Payment error" });
      throw e;
    } finally {
      set({ paying: false });
    }
  },

  markPaid: (id, mode) =>
    set((state) => ({
      fees: state.fees.map((f) =>
        f.id === id ? { ...f, status: "paid" as const } : f
      ),
    })),
}));