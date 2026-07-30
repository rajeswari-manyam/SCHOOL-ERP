import { useMemo, useState, useCallback, useEffect } from "react";
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

export const useFeeData = () => {
  const [fees, setFees]                 = useState<FeeRow[]>([]);
  const [feesLoading, setFeesLoading]   = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const refreshTransactions = useCallback(() => {
    getAllRecordFeePayments()
      .then((res) => { setTransactions((res.data ?? []).map(recordToTransaction)); })
      .catch(() => {});
  }, []);

  const refreshFees = useCallback(() => {
    setFeesLoading(true);
    getAllPendingFees()
      .then((res) => { if (res.status) setFees((res.data ?? []).flatMap(pendingEntryToFeeRows)); })
      .catch(() => {})
      .finally(() => setFeesLoading(false));
  }, []);

  useEffect(() => {
    setFeesLoading(true);
    const p1 = getAllPendingFees()
      .then((res) => { if (res.status) setFees((res.data ?? []).flatMap(pendingEntryToFeeRows)); })
      .catch(() => {});
    const p2 = getAllRecordFeePayments()
      .then((res) => { setTransactions((res.data ?? []).map(recordToTransaction)); })
      .catch(() => {});
    Promise.all([p1, p2]).finally(() => setFeesLoading(false));
  }, []);

  return { fees, feesLoading, transactions, refreshTransactions, refreshFees };
};