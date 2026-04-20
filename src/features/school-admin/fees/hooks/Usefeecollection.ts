import { useState, useEffect, useCallback, useMemo } from "react";
import { feeApi } from "../api/fees.api";
import { filterPendingFees, sortPendingFees } from "../utils/Fee.utils";
import type {
  PendingFee,
  FeeTransaction,
  FeeHead,
  TransportSlab,
  ClassFeeStructure,
  FeeStats,
  PeriodSummary,
  FeeStatusFilter,
  SortOption,
  RecordPaymentForm,
} from "../types/fees.types";

export type FeeTab = "pending" | "transactions" | "structure";

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
  const [loading, setLoading] = useState(true);

  // Filters - Pending Fees
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [sectionFilter, setSectionFilter] = useState("All Sections");
  const [statusFilter, setStatusFilter] = useState<FeeStatusFilter>("Overdue");
  const [feeHeadFilter, setFeeHeadFilter] = useState("All Fee Heads");
  const [sortOption, setSortOption] = useState<SortOption>("Days Overdue");

  // Filters - Transactions
  const [txSearch, setTxSearch] = useState("");
  const [txDateRange, setTxDateRange] = useState("01 Apr 2025 — 07 Apr 2025");
  const [txClassFilter, setTxClassFilter] = useState("All Classes");
  const [txModeFilter, setTxModeFilter] = useState("All Modes (Cash, UPI, Cheque, Bank)");

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Structure
  const [selectedClass, setSelectedClass] = useState("Class 10");

  // Month navigation
  const [currentMonth, setCurrentMonth] = useState("April 2025");

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
      const [s, p, t, fh, ts, ps] = await Promise.all([
        feeApi.getStats(),
        feeApi.getPendingFees(),
        feeApi.getTransactions(),
        feeApi.getFeeHeads(),
        feeApi.getTransportSlabs(),
        feeApi.getPeriodSummary(),
      ]);
      setStats(s);
      setPendingFees(p);
      setTransactions(t);
      setFeeHeads(fh);
      setTransportSlabs(ts);
      setPeriodSummary(ps);
      setLoading(false);
    }
    load();
  }, []);

  // Load class fee structure when class changes
  useEffect(() => {
    feeApi.getClassFeeStructure(selectedClass).then(setClassFeeStructure);
  }, [selectedClass]);

  // Filtered & sorted pending fees
  const filteredFees = useMemo(
    () =>
      sortPendingFees(
        filterPendingFees(pendingFees, statusFilter, searchQuery, classFilter, sectionFilter, feeHeadFilter),
        sortOption
      ),
    [pendingFees, statusFilter, searchQuery, classFilter, sectionFilter, feeHeadFilter, sortOption]
  );

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    if (!txSearch) return transactions;
    const q = txSearch.toLowerCase();
    return transactions.filter(
      (t) => t.studentName.toLowerCase().includes(q) || t.receiptNo.toLowerCase().includes(q)
    );
  }, [transactions, txSearch]);

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
      const result = await feeApi.recordPayment(form);
      if (result.success) {
        const fee = recordPaymentStudent;
        setLastReceipt({
          receiptNo: result.receiptNo,
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
        // Remove from pending list if fully paid
        setPendingFees((prev) => prev.filter((f) => f.studentId !== form.studentId));
        closeRecordPayment();
        setShowSuccessModal(true);
      }
    },
    [recordPaymentStudent, closeRecordPayment]
  );

  // Send reminders
  const sendReminders = useCallback(
    async (studentIds?: string[]) => {
      const ids = studentIds || Array.from(selectedIds);
      await feeApi.sendReminder(ids);
      alert(`Reminder sent to ${ids.length} student(s) via WhatsApp`);
    },
    [selectedIds]
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
    periodSummary,
    loading,

    // Filters - pending
    searchQuery, setSearchQuery,
    classFilter, setClassFilter,
    sectionFilter, setSectionFilter,
    statusFilter, setStatusFilter,
    feeHeadFilter, setFeeHeadFilter,
    sortOption, setSortOption,

    // Filters - transactions
    txSearch, setTxSearch,
    txDateRange, setTxDateRange,
    txClassFilter, setTxClassFilter,
    txModeFilter, setTxModeFilter,

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