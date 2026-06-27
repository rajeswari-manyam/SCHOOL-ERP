import { create } from "zustand";
import type { Fee as LocalFee, PaymentHistory, MonthStatus, ExamTerm } from "../types/fee.types";
import {
  getPendingFeesByStudentId,
  getPaymentsByStudentId,
  createPayment,
  deletePaymentById,
  type StudentFeeSummaryDetail,
} from "../../../../services/fee.api";
import { getAllAcademicYears } from "../../../../services/academicYear.api";

const TODAY_STR = () =>
  new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

// ── Helpers ────────────────────────────────────────────────────────────────────

function buildFees(details: StudentFeeSummaryDetail[]): LocalFee[] {
  return details
    .filter((d) => d.dueAmount > 0)
    .map((d) => {
      const rawType = d.fee_type ?? d.type;
      const isConcession = rawType === "concession" || !!d.feeConcessionId;
      const isTransport  =
        !isConcession &&
        (rawType === "transport" ||
          (d.feeHeadName ?? "").toLowerCase().includes("transport") ||
          !!d.transportfeeId);

      const feeType = isConcession ? "concession" : isTransport ? "transport" : "feehead";
      const feeid   = isConcession
        ? (d.feeConcessionId ?? d.id)
        : isTransport
        ? (d.transportfeeId ?? d.id)
        : (d.feeHeadMappingId ?? d.id);

      const dueDate  = d.dueDate ? new Date(d.dueDate) : null;
      const diffDays = dueDate
        ? Math.floor((Date.now() - dueDate.getTime()) / 86_400_000)
        : 0;
      return {
        id:             d.id,
        feeid,
        fee_type:       feeType,
        academicYearId: "",
        term:           d.feeHeadName ?? "Fee",
        totalFee:       d.finalAmount,
        originalAmount: d.originalAmount,
        discountAmount: d.discountAmount,
        paidAmount:     d.paidAmount,
        amount:         d.dueAmount,
        dueDate:        dueDate
          ? dueDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
          : TODAY_STR(),
        status:         (diffDays > 0 ? "overdue" : "pending") as LocalFee["status"],
        daysOverdue:    diffDays > 0 ? diffDays : undefined,
      };
    });
}

const ACADEMIC_MONTHS = ["OCT","NOV","DEC","JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP"];

function buildTuitionMonths(details: StudentFeeSummaryDetail[]): MonthStatus[] {
  const tuition = details.find((d) =>
    (d.feeHeadName ?? "").toLowerCase().includes("tuition") ||
    (d.feeHeadName ?? "").toLowerCase().includes("school")
  );
  return ACADEMIC_MONTHS.map((label) => ({
    label,
    paid:     tuition?.status === "PAID",
    pending:  tuition?.status === "PENDING" || tuition?.status === "PARTIAL",
    upcoming: !tuition,
  }));
}

function buildExamTerms(details: StudentFeeSummaryDetail[]): ExamTerm[] {
  return details.slice(0, 4).map((d) => ({
    label:    d.feeHeadName ?? "Fee",
    amount:   d.finalAmount,
    paid:     d.status === "PAID",
    pending:  d.status === "PENDING" || d.status === "PARTIAL",
    upcoming: false,
  }));
}

// ── Store ──────────────────────────────────────────────────────────────────────

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
  academicYearId: string;

  fetchFees: (studentId: string) => Promise<void>;
  fetchFeeById: (id: string) => Promise<void>;
  setSelectedFee: (fee: LocalFee | null) => void;
  recordPayment: (
    id: string,
    payload: { amount_paid: number; payment_method: string; transaction_id: string },
    studentId: string
  ) => Promise<string>;
  deletePayment: (paymentId: string, studentId: string) => Promise<void>;
  markPaid: (id: string, mode: string) => void;
}

export const useFeeStore = create<FeeStore>((set, get) => ({
  fees:           [],
  history:        [],
  tuitionMonths:  [],
  examTerms:      [],
  annualSummary:  { totalPaid: 0, totalPending: 0, totalAmount: 0, percentCollected: 0 },
  selectedFee:    null,
  loading:        false,
  paying:         false,
  error:          null,
  academicYearId: "",

  fetchFees: async (studentId: string) => {
    if (!studentId) return;
    set({ loading: true, error: null });
    try {
      const [summaryRes, paymentsRes] = await Promise.all([
        getPendingFeesByStudentId(studentId).catch(() => null),
        getPaymentsByStudentId(studentId).catch(() => null),
      ]);

      const details = summaryRes?.data?.details ?? [];
      const s       = summaryRes?.data?.summary;

      const fees          = buildFees(details);
      const tuitionMonths = buildTuitionMonths(details);
      const examTerms     = buildExamTerms(details);

      const annualSummary: AnnualSummary = s
        ? {
            totalAmount:        s.totalFinal,
            totalPaid:          s.totalPaid,
            totalPending:       s.totalDue,
            percentCollected:   s.totalFinal > 0
              ? Math.round((s.totalPaid / s.totalFinal) * 100)
              : 0,
          }
        : { totalPaid: 0, totalPending: 0, totalAmount: 0, percentCollected: 0 };

      const feeSummaries = paymentsRes?.data?.fee_summaries ?? [];
      const payments     = paymentsRes?.data?.payments ?? [];
      const history: PaymentHistory[] = payments.map((p) => ({
        id:        p.id,
        date:      new Date(p.payment_date).toLocaleDateString("en-IN", {
          day: "numeric", month: "long", year: "numeric",
        }),
        feeHead:   feeSummaries.find((s) => s.id === p.fee_reference_id)?.feeName
                   ?? p.feeName
                   ?? "Fee",
        amount:    p.amount_received,
        mode:      p.payment_mode,
        receiptNo: p.receipt_no,
      }));

      // Resolve academicYearId for createpayment — UIStore is not set in parent context.
      // Prefer an ID from existing payment records; fall back to the active academic year.
      let academicYearId = payments[0]?.academicYearId ?? "";
      if (!academicYearId) {
        try {
          const yearsRes = await getAllAcademicYears();
          const active   = yearsRes.data.find((y) => y.isActive || y.active);
          academicYearId = active?.id ?? yearsRes.data[0]?.id ?? "";
        } catch { /* leave empty */ }
      }

      set({ fees, history, tuitionMonths, examTerms, annualSummary, academicYearId });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : "Unknown error" });
    } finally {
      set({ loading: false });
    }
  },

  fetchFeeById: async (_id: string) => { /* not used */ },

  setSelectedFee: (fee) => set({ selectedFee: fee }),

  recordPayment: async (id, payload, studentId) => {
    set({ paying: true, error: null });
    try {
      const fee = get().fees.find((f) => f.id === id);
      if (!fee) throw new Error("Fee not found");

      const academicYearId = get().academicYearId;
      const today = new Date().toISOString().slice(0, 10);
      const modeMap: Record<string, string> = {
        "UPI":         "UPI",
        "Net Banking": "NET_BANKING",
        "Card":        "CARD",
        "Cash":        "CASH",
      };

      const feeRef =
        fee.fee_type === "transport"   ? { transportfeeId:   fee.feeid } :
        fee.fee_type === "concession"  ? { feeConcessionId:  fee.feeid } :
                                         { feeHeadMappingId: fee.feeid };

      const res = await createPayment({
        student_id:      studentId,
        academicYearId,
        ...feeRef,
        amount_received: payload.amount_paid,
        payment_mode:    modeMap[payload.payment_method] ?? payload.payment_method.toUpperCase(),
        reference_no:    payload.transaction_id,
        payment_date:    today,
        notes:           "",
      });
      if (!res.status) throw new Error(res.message ?? "Payment failed");
      await get().fetchFees(studentId);
      return res.data.receipt_no;
    } catch (e: any) {
      set({ error: e.message ?? "Payment error" });
      throw e;
    } finally {
      set({ paying: false });
    }
  },

  deletePayment: async (paymentId, studentId) => {
    const res = await deletePaymentById(paymentId);
    if (!res.status) throw new Error(res.message ?? "Delete failed");
    await get().fetchFees(studentId);
  },

  markPaid: (id) =>
    set((state) => ({
      fees: state.fees.map((f) =>
        f.id === id ? { ...f, status: "paid" as const } : f
      ),
    })),
}));
