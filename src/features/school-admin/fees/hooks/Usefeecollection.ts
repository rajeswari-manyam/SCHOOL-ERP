import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "@/store/uiStore";
import {
  getAllPendingFees,
  getAllRecordFeePayments,
  getFeeHeads,
  getFeeStructures,
  getAllTransportFees,
  getAllConcessions,
  getStudentsByClassSection,
  createRecordFeePayment,
} from "@/services/fee.api";
import { getAllClasses, getSectionsByClassId } from "@/services/class.api";
import type { AllPendingFeesEntry, RecordFeePaymentRecord, ConcessionRecord } from "@/services/fee.api";
import { sortPendingFees } from "../utils/Fee.utils";
import type {
  PendingFee,
  FeeTransaction,
  FeeHead,
  TransportSlab,
  ClassFeeStructure,
  FeeStats,
  PeriodSummary,
  RecordPaymentForm,
} from "../types/fees.types";

export type FeeTab = "pending" | "transactions" | "structure" | "staffsalary";

// Query keys for the Structure-tab-only data (fee heads / transport slabs /
// concessions / per-class fee structure). Kept out of the shared `load()`
// effect below and fetched via `useQuery` with `enabled` gated on
// `activeTab === "structure"` so they're only requested when that panel is
// actually on screen — mirrors the pattern in useLedger.ts.
const feeKeys = {
  structureStatic: (academicYearId: string) => ["fees", "structure-static", academicYearId] as const,
  classFeeStructure: (classId: string) => ["fees", "class-fee-structure", classId] as const,
};

function computeDueInfo(dueDate: string | null | undefined) {
  if (!dueDate) return { daysOverdue: null, daysRemaining: null, isDueToday: false };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - due.getTime()) / 86_400_000);
  if (diff === 0) return { daysOverdue: null, daysRemaining: null, isDueToday: true };
  if (diff > 0) return { daysOverdue: diff, daysRemaining: null, isDueToday: false };
  return { daysOverdue: null, daysRemaining: -diff, isDueToday: false };
}

function pendingEntryToRows(entry: AllPendingFeesEntry): PendingFee[] {
  const initials = entry.student.name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
  return entry.details.map((d) => {
    const rawType = d.fee_type ?? d.type;
    const isConcession = rawType === "concession" || !!d.feeConcessionId;
    const isTransport =
      !isConcession &&
      (rawType === "transport" ||
        (d.feeHeadName ?? "").toLowerCase().includes("transport") ||
        !!d.transportfeeId);
    const feeType: PendingFee["feeType"] = isConcession ? "concession" : isTransport ? "transport" : "feehead";

    return {
      studentId: entry.student.id,
      studentName: entry.student.name,
      admissionNo: entry.student.id,
      initials,
      class: "",
      section: "",
      feeHead: d.feeHeadName ?? "Fee",
      amount: d.dueAmount,
      feeStructureId: d.feeHeadMappingId,
      feeType,
      transportfeeId: d.transportfeeId,
      feeConcessionId: d.feeConcessionId,
      originalAmount: d.originalAmount,
      dueDate: d.dueDate ?? "",
      ...computeDueInfo(d.dueDate),
      reminders: { sent: 0, total: 0 },
      parentPhone: "",
    };
  });
}

function recordToTransaction(r: RecordFeePaymentRecord): FeeTransaction {
  return {
    receiptNo: r.receipt_no,
    dateTime: `${r.payment_date}\n${new Date(r.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`,
    studentName: r.studentName ?? "",
    class: r.className && r.sectionName ? `${r.className} ${r.sectionName}` : (r.className ?? ""),
    className: r.className ?? "",
    sectionName: r.sectionName ?? "",
    feeHead: "",
    amount: r.amount,
    mode: r.payment_mode as FeeTransaction["mode"],
    sentToParent: false,
  };
}

export function useFeeCollection() {
  const academicYearId = useUIStore((s) => s.academicYearId);

  // Tab
  const [activeTab, setActiveTab] = useState<FeeTab>("pending");

  // Data
  const [stats, setStats] = useState<FeeStats | null>(null);
  const [pendingFees, setPendingFees] = useState<PendingFee[]>([]);
  const [transactions, setTransactions] = useState<FeeTransaction[]>([]);
  const [periodSummary, setPeriodSummary] = useState<PeriodSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [classMap, setClassMap] = useState<Map<string, string>>(new Map());
  const [sectionMap, setSectionMap] = useState<Map<string, string>>(new Map()); // sectionName → sectionId

  // Class / section options for filter bar
  const [classOptions, setClassOptions] = useState<string[]>(["All Classes"]);
  const [sectionOptions, setSectionOptions] = useState<string[]>(["All Sections"]);

  // Filters - Pending Fees
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [sectionFilter, setSectionFilter] = useState("All Sections");

  // Student IDs for the selected class+section (null = show all)
  const [classStudentIds, setClassStudentIds] = useState<Set<string> | null>(null);

  // Filters - Transactions
  const [txSearch, setTxSearch] = useState("");
  const [txClassFilter, setTxClassFilter] = useState("All Classes");
  const [txSectionFilter, setTxSectionFilter] = useState("All Sections");
  const [txSectionOptions, setTxSectionOptions] = useState<string[]>(["All Sections"]);
  const [txDateRange, setTxDateRange] = useState("");

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Structure
  const [selectedClass, setSelectedClass] = useState("");

  // Month navigation
  const [currentMonth, setCurrentMonth] = useState("");

  // Modals
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [recordPaymentStudent, setRecordPaymentStudent] = useState<PendingFee | null>(null);
  const [lastReceipt, setLastReceipt] = useState<{
    receiptNo: string;
    studentName: string;
    class: string;
    admissionNo: string;
    feeHead: string;
    amount: number;
    mode: string;
    upiRef?: string;
    date: string;
    parentPhone: string;
  } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Reset filters when academic year changes so stale class/section names are cleared
  useEffect(() => {
    setClassFilter("All Classes");
    setSectionFilter("All Sections");
    setTxClassFilter("All Classes");
    setTxSectionFilter("All Sections");
    setSelectedIds(new Set());
    setClassStudentIds(null);
  }, [academicYearId]);

  // Load initial data; re-runs whenever the selected academic year changes
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [pendingRes, recordsRes, classesRes] = await Promise.all([
          getAllPendingFees(),
          getAllRecordFeePayments(),
          getAllClasses(),
        ]);

        // Build class name → id map
        const cm = new Map<string, string>();
        if (classesRes.status) {
          for (const c of classesRes.data) {
            cm.set(c.class_name, c.id);
          }
        }
        setClassMap(cm);
        setClassOptions(["All Classes", ...[...cm.keys()]]);
        if (cm.size > 0) setSelectedClass([...cm.keys()][0]);

        // Pending fees → flatten details to rows
        const rows: PendingFee[] = [];
        if (pendingRes.status) {
          for (const entry of pendingRes.data) {
            rows.push(...pendingEntryToRows(entry));
          }
        }
        setPendingFees(rows);

        // Record fee payments → transactions
        const txs: FeeTransaction[] = [];
        if (recordsRes.status) {
          for (const r of recordsRes.data) {
            txs.push(recordToTransaction(r));
          }
        }
        setTransactions(txs);

        // Note: fee heads / transport slabs / concessions (Structure-tab-only
        // static data) are fetched separately below via `structureStaticQuery`,
        // gated on `activeTab === "structure"` — they used to be fetched here
        // unconditionally on every mount/academic-year change regardless of tab.

        // Stats - compute from real data
        const totalDue = rows.reduce((s, r) => s + r.amount, 0);
        const uniqueStudents = new Set(rows.map((r) => r.studentId)).size;
        const thisMonthCollected = txs.reduce((s, t) => s + t.amount, 0);
        const overdueCount = rows.filter((r) => r.amount > 0).length;
        setStats({
          totalOutstanding: totalDue,
          pendingStudents: uniqueStudents,
          collectedThisMonth: thisMonthCollected,
          collectedPercent: totalDue > 0 ? Math.round((thisMonthCollected / (totalDue + thisMonthCollected)) * 100) : 0,
          remindersToday: 0,
          reminderTime: "8:00 AM",
          severelyOverdue: overdueCount,
        });

        // Period summary with real mode breakdown
        const breakdown = txs.reduce(
          (acc, t) => {
            const m = t.mode?.toLowerCase() ?? "";
            if (m === "cash") acc.cash += t.amount;
            else if (m === "upi") acc.upi += t.amount;
            else if (m === "cheque") acc.cheque += t.amount;
            else acc.bankTransfer += t.amount;
            return acc;
          },
          { cash: 0, upi: 0, cheque: 0, bankTransfer: 0 }
        );
        setPeriodSummary({
          totalPayments: txs.length,
          collected: thisMonthCollected,
          breakdown,
        });

        // Month label
        const now = new Date();
        setCurrentMonth(now.toLocaleDateString("en-IN", { month: "long", year: "numeric" }));
        setTxDateRange(`01 ${now.toLocaleDateString("en-IN", { month: "short", year: "numeric" })} — ${now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`);
      } catch (e) {
        console.error("Failed to load fee data", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [academicYearId]);

  // Load sections for transactions tab when txClassFilter changes
  useEffect(() => {
    if (txClassFilter === "All Classes") {
      setTxSectionOptions(["All Sections"]);
      setTxSectionFilter("All Sections");
      return;
    }
    const classId = classMap.get(txClassFilter);
    if (!classId) return;
    getSectionsByClassId(classId)
      .then((res) => {
        if (!res.status) return;
        setTxSectionOptions(["All Sections", ...res.data.map((s) => s.sectionName)]);
        setTxSectionFilter("All Sections");
      })
      .catch(() => {});
  }, [txClassFilter, classMap]);

  // ── Structure-tab-only data ────────────────────────────────────────────────
  // Fee heads / transport slabs / concessions used to be fetched unconditionally
  // in the `load()` effect above on every mount and academic-year change, even
  // though they're only ever displayed on the Fee Structure tab. Gated here via
  // `enabled` so they're only requested while that tab is actually active —
  // same pattern as the tab-only queries in useLedger.ts.
  const structureStaticQuery = useQuery({
    queryKey: feeKeys.structureStatic(academicYearId ?? ""),
    queryFn: async () => {
      const [headsRes, transportRes, concessionsRes] = await Promise.all([
        getFeeHeads(),
        getAllTransportFees(),
        getAllConcessions(),
      ]);

      const heads: FeeHead[] = [];
      if (headsRes.status) {
        for (const h of headsRes.data) {
          heads.push({ id: h.id, name: h.feeName, code: "", mandatory: false, taxable: false, gstPercent: 0, status: h.status === "Active" ? "Active" : "Inactive" });
        }
      }

      const slabs: TransportSlab[] = [];
      if (transportRes.status) {
        for (const t of transportRes.data) {
          slabs.push({ slab: t.slab_name, range: `${t.from_km}–${t.to_km} KM`, monthly: t.monthly_fee, students: 0 });
        }
      }

      const concessionRecords: ConcessionRecord[] = concessionsRes?.status ? (concessionsRes.data ?? []) : [];

      return { heads, slabs, concessions: concessionRecords };
    },
    enabled: activeTab === "structure",
  });

  const feeHeads = structureStaticQuery.data?.heads ?? [];
  const transportSlabs = structureStaticQuery.data?.slabs ?? [];
  const concessions = structureStaticQuery.data?.concessions ?? [];

  // Load class fee structure when class changes — also Structure-tab-only.
  const selectedClassId = classMap.get(selectedClass);
  const classFeeStructureQuery = useQuery({
    queryKey: feeKeys.classFeeStructure(selectedClassId ?? ""),
    queryFn: async () => {
      const res = await getFeeStructures({
        class_id: selectedClassId!,
        section_id: "",
        fromDate: "2000-01-01",
        toDate: "2100-12-31",
      });
      if (!res.status) return [];
      const mapped: ClassFeeStructure[] = res.data.map((f) => ({
        feeHeadId: f.feeHeadId,
        feeHeadName: f.feeHeadName,
        subtitle: "",
        billingCycle: (f.billingCycle as "Monthly" | "Quarterly" | "Annually") || "Monthly",
        dueDate: f.dueDate,
        amount: f.amount,
        annualTotal: f.amount * (f.billingCycle === "Monthly" ? 12 : f.billingCycle === "Quarterly" ? 4 : 1),
      }));
      return mapped;
    },
    enabled: activeTab === "structure" && !!selectedClassId,
  });

  const classFeeStructure = classFeeStructureQuery.data ?? [];

  // Load sections when class filter changes
  useEffect(() => {
    if (classFilter === "All Classes") {
      setSectionOptions(["All Sections"]);
      setSectionFilter("All Sections");
      setSectionMap(new Map());
      setClassStudentIds(null);
      return;
    }
    const classId = classMap.get(classFilter);
    if (!classId) return;
    getSectionsByClassId(classId)
      .then((res) => {
        if (!res.status) return;
        const sm = new Map<string, string>();
        for (const s of res.data) sm.set(s.sectionName, s.id);
        setSectionMap(sm);
        setSectionOptions(["All Sections", ...[...sm.keys()]]);
        setSectionFilter("All Sections");
        setClassStudentIds(null);
      })
      .catch(() => {});
  }, [classFilter, classMap]);

  // Load student IDs when class+section both selected
  useEffect(() => {
    if (classFilter === "All Classes" || sectionFilter === "All Sections") {
      setClassStudentIds(null);
      return;
    }
    const classId = classMap.get(classFilter);
    const sectionId = sectionMap.get(sectionFilter);
    if (!classId || !sectionId) return;
    getStudentsByClassSection(classId, sectionId)
      .then((res) => {
        if (!res.status) { setClassStudentIds(new Set()); return; }
        setClassStudentIds(new Set((res.data ?? []).map((s) => s.id)));
      })
      .catch(() => setClassStudentIds(null));
  }, [classFilter, sectionFilter, classMap, sectionMap]);

  // Filtered & sorted pending fees
  const filteredFees = useMemo(() => {
    let fees = pendingFees;
    // Class+section filter via student IDs
    if (classStudentIds !== null) {
      fees = fees.filter((f) => classStudentIds.has(f.studentId));
    }
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      fees = fees.filter(
        (f) => f.studentName.toLowerCase().includes(q) || f.admissionNo.toLowerCase().includes(q)
      );
    }
    return sortPendingFees(fees, "Amount");
  }, [pendingFees, classStudentIds, searchQuery]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    let txs = transactions;
    if (txClassFilter !== "All Classes") {
      txs = txs.filter((t) => t.className === txClassFilter);
    }
    if (txSectionFilter !== "All Sections") {
      txs = txs.filter((t) => t.sectionName === txSectionFilter);
    }
    if (txSearch) {
      const q = txSearch.toLowerCase();
      txs = txs.filter(
        (t) => t.studentName.toLowerCase().includes(q) || t.receiptNo.toLowerCase().includes(q)
      );
    }
    return txs;
  }, [transactions, txClassFilter, txSectionFilter, txSearch]);

  // Selection handlers
  const toggleSelect = useCallback((studentId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) =>
      prev.size === filteredFees.length
        ? new Set()
        : new Set(filteredFees.map((f) => f.studentId))
    );
  }, [filteredFees]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  // Open record payment modal
  const openRecordPayment = useCallback((fee?: PendingFee) => {
    setRecordPaymentStudent(fee || null);
    setShowRecordPayment(true);
  }, []);

  const closeRecordPayment = useCallback(() => {
    setShowRecordPayment(false);
    setRecordPaymentStudent(null);
  }, []);

  // Submit payment
  const submitPayment = useCallback(
    async (form: RecordPaymentForm) => {
      try {
        const result = await createRecordFeePayment({
          class_id: "",
          section_id: "",
          student_id: form.studentId,
          payment_mode: form.paymentMode,
          amount: form.amountReceived,
          topay: form.amountReceived,
          receipt_no: form.receiptNumber,
          transaction_id: form.upiReference,
          payment_date: form.paymentDate,
        });
        const fee = recordPaymentStudent;
        setLastReceipt({
          receiptNo: result.receipt_no,
          studentName: fee?.studentName || form.studentId,
          class: fee ? `${fee.class}${fee.section}` : "",
          admissionNo: fee?.admissionNo || "",
          feeHead: form.feeHead,
          amount: form.amountReceived,
          mode: form.paymentMode,
          upiRef: form.upiReference,
          date: form.paymentDate,
          parentPhone: form.parentPhone,
        });
        setPendingFees((prev) => prev.filter((f) => f.studentId !== form.studentId));
        closeRecordPayment();
        setShowSuccessModal(true);
      } catch {
        console.error("Failed to record payment");
      }
    },
    [recordPaymentStudent, closeRecordPayment]
  );

  // Send reminders (placeholder — no real API)
  const sendReminders = useCallback(
    async (_studentIds?: string[]) => {
      // No dedicated reminder API available
    },
    []
  );

  // Re-fetch just the pending-fees rows (e.g. after applying a concession
  // changes a row's amounts) without re-running the full page load.
  const refreshPendingFees = useCallback(() => {
    getAllPendingFees()
      .then((res) => {
        if (!res.status) return;
        const rows: PendingFee[] = [];
        for (const entry of res.data) {
          rows.push(...pendingEntryToRows(entry));
        }
        setPendingFees(rows);
      })
      .catch(() => {});
  }, []);

  return {
    // Tab
    activeTab,
    setActiveTab,

    // Data
    stats,
    pendingFees,
    filteredFees,
    transactions,
    filteredTransactions,
    feeHeads,
    transportSlabs,
    classFeeStructure,
    concessions,
    periodSummary,
    loading,

    // Filters - pending
    searchQuery, setSearchQuery,
    classFilter, setClassFilter,
    sectionFilter, setSectionFilter,
    classOptions,
    sectionOptions,

    // Filters - transactions
    txSearch, setTxSearch,
    txClassFilter, setTxClassFilter,
    txSectionFilter, setTxSectionFilter,
    txSectionOptions,
    txDateRange,

    // Selection
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    clearSelection,

    // Structure
    selectedClass, setSelectedClass,

    // Month nav
    currentMonth, setCurrentMonth,

    // Modals
    showRecordPayment,
    recordPaymentStudent,
    openRecordPayment,
    closeRecordPayment,
    submitPayment,
    lastReceipt,
    showSuccessModal,
    setShowSuccessModal,

    // Actions
    sendReminders,
    refreshPendingFees,
  };
}