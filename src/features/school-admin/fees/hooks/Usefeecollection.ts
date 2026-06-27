import { useState, useEffect, useCallback, useMemo } from "react";
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
import type { ClassRecord } from "@/services/class.api";
import { sortPendingFees } from "../utils/Fee.utils";
import type {
  PendingFee,
  FeeTransaction,
  FeeHead,
  TransportSlab,
  ClassFeeStructure,
  FeeStats,
  PeriodSummary,
  SortOption,
  RecordPaymentForm,
} from "../types/fees.types";

export type FeeTab = "pending" | "transactions" | "structure";

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
  return entry.details.map((d) => ({
    studentId: entry.student.id,
    studentName: entry.student.name,
    admissionNo: entry.student.id,
    initials,
    class: "",
    section: "",
    feeHead: d.feeHeadName ?? "Fee",
    amount: d.dueAmount,
    dueDate: d.dueDate ?? "",
    ...computeDueInfo(d.dueDate),
    reminders: { sent: 0, total: 0 },
    parentPhone: "",
  }));
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
  // Tab
  const [activeTab, setActiveTab] = useState<FeeTab>("pending");

  // Data
  const [stats, setStats] = useState<FeeStats | null>(null);
  const [pendingFees, setPendingFees] = useState<PendingFee[]>([]);
  const [transactions, setTransactions] = useState<FeeTransaction[]>([]);
  const [feeHeads, setFeeHeads] = useState<FeeHead[]>([]);
  const [transportSlabs, setTransportSlabs] = useState<TransportSlab[]>([]);
  const [classFeeStructure, setClassFeeStructure] = useState<ClassFeeStructure[]>([]);
  const [periodSummary, setPeriodSummary] = useState<PeriodSummary | null>(null);
  const [concessions, setConcessions] = useState<ConcessionRecord[]>([]);
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

  // Load initial data
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [pendingRes, recordsRes, headsRes, classesRes, transportRes, concessionsRes] = await Promise.all([
          getAllPendingFees(),
          getAllRecordFeePayments(),
          getFeeHeads(),
          getAllClasses(),
          getAllTransportFees(),
          getAllConcessions(),
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

        // Fee heads
        const heads: FeeHead[] = [];
        if (headsRes.status) {
          for (const h of headsRes.data) {
            heads.push({ id: h.id, name: h.feeName, code: "", mandatory: false, taxable: false, gstPercent: 0, status: h.status === "Active" ? "Active" : "Inactive" });
          }
        }
        setFeeHeads(heads);

        // Transport fees → slabs
        const slabs: TransportSlab[] = [];
        if (transportRes.status) {
          for (const t of transportRes.data) {
            slabs.push({ slab: t.slab_name, range: `${t.from_km}–${t.to_km} KM`, monthly: t.monthly_fee, students: 0 });
          }
        }
        setTransportSlabs(slabs);

        // Concessions
        if (concessionsRes?.status) {
          setConcessions(concessionsRes.data ?? []);
        }

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
  }, []);

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

  // Load class fee structure when class changes
  useEffect(() => {
    if (!selectedClass || classMap.size === 0) return;
    const classId = classMap.get(selectedClass);
    if (!classId) return;
    getFeeStructures({
      class_id: classId,
      section_id: "",
      fromDate: "2000-01-01",
      toDate: "2100-12-31",
    })
      .then((res) => {
        if (!res.status) return;
        const mapped: ClassFeeStructure[] = res.data.map((f) => ({
          feeHeadId: f.feeHeadId,
          feeHeadName: f.feeHeadName,
          subtitle: "",
          billingCycle: (f.billingCycle as "Monthly" | "Quarterly" | "Annually") || "Monthly",
          dueDate: f.dueDate,
          amount: f.amount,
          annualTotal: f.amount * (f.billingCycle === "Monthly" ? 12 : f.billingCycle === "Quarterly" ? 4 : 1),
        }));
        setClassFeeStructure(mapped);
      })
      .catch(() => {});
  }, [selectedClass, classMap]);

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
  };
}