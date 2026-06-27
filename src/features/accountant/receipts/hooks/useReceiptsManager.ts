import { useState, useRef, useEffect, useCallback } from "react";
import type { Receipt, Student, PaymentMode } from "../types/receipts.types";
import { STUDENTS_DATA } from "../data/receipts.data";
import {
  getAllRecordFeePayments,
  createRecordFeePayment,
  deleteRecordFeePayment,
} from "@/services/fee.api";
import type { RecordFeePaymentRecord } from "@/services/fee.api";

const mapRecord = (r: RecordFeePaymentRecord): Receipt => ({
  id: r.id,
  receiptNo: r.receipt_no,
  date: new Date(r.payment_date).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  }),
  time: new Date(r.createdAt).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  }),
  student: r.studentName ?? "—",
  className: [r.className, r.sectionName].filter(Boolean).join(" ") || "—",
  feeHead: "Fee",
  amount: r.amount,
  mode: r.payment_mode as PaymentMode,
  status: "Not Sent",
  waStatus: "Not Sent",
});

export const useReceiptsManager = (
  onClose?: () => void,
  onSuccess?: (receiptNo: string) => void
) => {
  const [receipts, setReceipts]               = useState<Receipt[]>([]);
  const [isLoadingReceipts, setIsLoadingReceipts] = useState(false);

  const [query, setQuery]                     = useState("");
  const [suggestions, setSuggestions]         = useState<Student[]>([]);
  const [showDropdown, setShowDropdown]       = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const dropdownRef                           = useRef<HTMLDivElement>(null);

  const [feeHead, setFeeHead]         = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode | null>(null);
  const [period, setPeriod]           = useState("");
  const [amount, setAmount]           = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [receiptNo, setReceiptNo]     = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess]       = useState(false);

  const canGenerate =
    !!selectedStudent && !!feeHead && !!paymentMode && !!amount && !!paymentDate && !!receiptNo && !isSubmitting;

  const fetchReceipts = useCallback(async () => {
    setIsLoadingReceipts(true);
    try {
      const res = await getAllRecordFeePayments();
      setReceipts((res.data ?? []).map(mapRecord));
    } catch {
      // silent
    } finally {
      setIsLoadingReceipts(false);
    }
  }, []);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (!val.trim()) { setSuggestions([]); setShowDropdown(false); return; }
    const lower = val.toLowerCase();
    const matches = STUDENTS_DATA.filter(
      (s) => s.name.toLowerCase().includes(lower) || s.admissionNo.toLowerCase().includes(lower)
    );
    setSuggestions(matches);
    setShowDropdown(matches.length > 0);
  };

  const handleSelectStudent = (s: Student) => {
    setSelectedStudent(s);
    setQuery(s.name);
    setShowDropdown(false);
  };

  const handleGenerate = async () => {
    if (!canGenerate || !selectedStudent) return;
    setIsSubmitting(true);
    try {
      await createRecordFeePayment({
        class_id: selectedStudent.classId ?? "",
        section_id: selectedStudent.sectionId ?? "",
        student_id: selectedStudent.id,
        payment_mode: paymentMode!,
        amount: Number(amount),
        topay: Number(amount),
        receipt_no: receiptNo,
        payment_date: paymentDate,
      });
      setIsSuccess(true);
      onSuccess?.(receiptNo);
      setTimeout(() => onClose?.(), 1000);
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRecordFeePayment(id);
      setReceipts((prev) => prev.filter((r) => r.id !== id));
    } catch {
      // silent
    }
  };

  return {
    receipts,
    isLoadingReceipts,
    refetchReceipts: fetchReceipts,

    query,
    suggestions,
    showDropdown,
    selectedStudent,
    dropdownRef,

    feeHead,
    paymentMode,
    period,
    amount,
    paymentDate,
    receiptNo,

    isSubmitting,
    isSuccess,
    canGenerate,

    setFeeHead,
    setPaymentMode,
    setPeriod,
    setAmount,
    setPaymentDate,
    setReceiptNo,

    handleQueryChange,
    handleSelectStudent,
    handleGenerate,
    handleDelete,
  };
};

export const useReceipts = useReceiptsManager;
