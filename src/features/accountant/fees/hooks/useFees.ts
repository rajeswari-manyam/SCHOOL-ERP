import { useMemo, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { FeeRow, TransportSlab, TransportStudent, Transaction } from "../types/fees.types";
import { getAllPendingFees, getAllRecordFeePayments } from "../../../../services/fee.api";
import type { AllPendingFeesEntry, StudentFeeSummaryDetail, RecordFeePaymentRecord } from "../../../../services/fee.api";


export const useTransportFees = () => {
  const [slabs, setSlabs] = useState<TransportSlab[]>([]);
  const [students, setStudents] = useState<TransportStudent[]>([]);

  const [search, setSearch] = useState("");
  const [slabFilter, setSlabFilter] = useState<string | null>(null);

 
  const [pendingSlabs, setPendingSlabs] = useState<Record<string, string>>({});


  const filteredStudents = useMemo(() => {
    return students.filter((st) => {
      const matchSearch =
        search.trim() === "" ||
        st.name.toLowerCase().includes(search.toLowerCase()) ||
        st.cls.toLowerCase().includes(search.toLowerCase());

      const matchSlab =
        slabFilter == null ||
        (pendingSlabs[st.id] ?? st.slabId) === slabFilter;

      return matchSearch && matchSlab;
    });
  }, [students, search, slabFilter, pendingSlabs]);

  const totalStudents = students.length;

  const totalRevenue = useMemo(() => {
    return students.reduce((sum, st) => {
      const slabId = pendingSlabs[st.id] ?? st.slabId;
      const slab = slabs.find((s) => s.id === slabId);
      return sum + (slab?.monthly ?? 0);
    }, 0);
  }, [students, slabs, pendingSlabs]);

  const handleSaveSlab = useCallback(
    (
      existingSlab: TransportSlab | null,
      data: Omit<TransportSlab, "id" | "students">
    ) => {
      if (existingSlab) {
       
        setSlabs((prev) =>
          prev.map((s) =>
            s.id === existingSlab.id ? { ...s, ...data } : s
          )
        );
      } else {
       
        const newId = String(Math.max(0, ...slabs.map((s) => Number(s.id))) + 1);
        setSlabs((prev) => [...prev, { id: newId, students: 0, ...data }]);
      }
    },
    [slabs]
  );

  const handleDeleteSlab = useCallback((id: string) => {
    setSlabs((prev) => prev.filter((s) => s.id !== id));
  }, []);

 
  const handleSaveStudentSlab = useCallback(
    (studentId: string) => {
      const key = studentId;
      const newSlabId = pendingSlabs[key];
      if (newSlabId == null) return;

   
      setStudents((prev) =>
        prev.map((st) =>
          st.id === key ? { ...st, slabId: newSlabId } : st
        )
      );

    
      setSlabs((prev) => {
        const oldSlabId = students.find((st) => st.id === key)?.slabId;
        return prev.map((s) => {
          if (s.id === oldSlabId) return { ...s, students: Math.max(0, s.students - 1) };
          if (s.id === newSlabId) return { ...s, students: s.students + 1 };
          return s;
        });
      });

  
      setPendingSlabs((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [pendingSlabs, students]
  );

  return {
    slabs,
    students,
    search,
    setSearch,
    slabFilter,
    setSlabFilter,
    pendingSlabs,
    setPendingSlabs,
    totalStudents,
    totalRevenue,
    filteredStudents,
    handleSaveSlab,
    handleDeleteSlab,
    handleSaveStudentSlab,
  };
};


function recordToTransaction(r: RecordFeePaymentRecord): Transaction {
  const remaining = r.amount - r.topay;
  return {
    id:              r.id,
    studentId:       r.student_id,
    date:            r.payment_date,
    student:         r.studentName ?? "—",
    className:       r.sectionName ? `${r.className ?? ""} · ${r.sectionName}`.trim() : (r.className ?? "—"),
    amount:          r.amount,
    paidAmount:      r.topay,
    remainingAmount: Math.max(0, remaining),
    status:          remaining <= 0 ? "PAID" : r.topay > 0 ? "PARTIAL" : "PENDING",
    mode:            r.payment_mode as Transaction["mode"],
    transactionId:   r.transaction_id,
    receiptNo:       r.receipt_no,
  };
}

function pendingEntryToFeeRows(entry: AllPendingFeesEntry): FeeRow[] {
  return entry.details.map((d: StudentFeeSummaryDetail, i: number) => {
    const dueDate     = d.dueDate ? new Date(d.dueDate) : null;
    const diffDays    = dueDate ? Math.floor((Date.now() - dueDate.getTime()) / 86_400_000) : 0;
    const daysOverdue = Math.max(0, diffDays);
    const dueDateStr  = dueDate
      ? dueDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : "—";
    return {
      id:              `${entry.student.id}-${d.feeHeadName ?? "fee"}-${i}`,
      studentId:       entry.student.id,
      feeStructureId:  d.feeHeadMappingId,
      student:         entry.student.name,
      admissionNo:     "—",
      className:       "—",
      feeHead:         d.feeHeadName ?? "Fee",
      originalAmount:  d.originalAmount,
      discountAmount:  d.discountAmount,
      amount:          d.finalAmount,
      paidAmount:      d.paidAmount,
      remainingAmount: d.dueAmount,
      dueDate:         dueDateStr,
      daysOverdue,
      lateFee:         0,
      reminders:       0,
      status:          d.dueAmount <= 0 ? "paid" : d.paidAmount > 0 ? "warning" : daysOverdue > 0 ? "overdue" : "warning",
      paymentStatus:   d.status,
    } satisfies FeeRow;
  });
}

// Query keys centralized here so refreshFees/refreshTransactions below can
// invalidate precisely — same pattern as useledger.ts.
const feeDataKeys = {
  pending: ["fees", "pending", "all"] as const,
  transactions: ["fees", "transactions", "all"] as const,
};

/**
 * @param activeTab   Which Fee Management tab is currently open ("Pending
 *                     Fees" / "All Transactions" / "Fee Structure" /
 *                     "Transport Fees"). The two queries below are each only
 *                     needed by one tab, so they're gated behind `enabled` —
 *                     landing on Fee Structure or Transport Fees no longer
 *                     fires either request, and revisiting a tab within the
 *                     global 5-minute staleTime serves cached data instead
 *                     of refetching.
 */
export const useFeeData = (activeTab: string) => {
  const queryClient = useQueryClient();

  const pendingFeesQuery = useQuery({
    queryKey: feeDataKeys.pending,
    queryFn: async (): Promise<FeeRow[]> => {
      const res = await getAllPendingFees();
      return res.status ? (res.data ?? []).flatMap(pendingEntryToFeeRows) : [];
    },
    enabled: activeTab === "Pending Fees",
  });

  const transactionsQuery = useQuery({
    queryKey: feeDataKeys.transactions,
    queryFn: async (): Promise<Transaction[]> => {
      const res = await getAllRecordFeePayments();
      return (res.data ?? []).map(recordToTransaction);
    },
    enabled: activeTab === "All Transactions",
  });

  // Callers (PendingFeesTable's onConcessionApplied, handleDeleteRecord) are
  // only reachable while their tab is mounted, so the matching query is
  // always `enabled` when these fire — invalidate triggers an immediate
  // refetch instead of the old manual re-fetch-and-setState.
  const refreshTransactions = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: feeDataKeys.transactions });
  }, [queryClient]);

  const refreshFees = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: feeDataKeys.pending });
  }, [queryClient]);

  return {
    fees: pendingFeesQuery.data ?? [],
    feesLoading: pendingFeesQuery.isFetching,
    transactions: transactionsQuery.data ?? [],
    refreshTransactions,
    refreshFees,
  };
};