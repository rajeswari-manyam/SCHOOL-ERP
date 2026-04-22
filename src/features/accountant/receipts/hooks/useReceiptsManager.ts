// useReceiptsManager.ts

import { useState, useRef, useEffect } from "react";
import type { Receipt, Student, PaymentMode } from"../types/receipts.types";
import { RECEIPTS_DUMMY_DATA, STUDENTS_DATA } from "../data/receipts.data";

export const useReceiptsManager = (
  onClose?: () => void,
  onSuccess?: (receiptNo: string) => void
) => {
  // ─── Receipts List ─────────────────────────────────────────────────────────
  const [receipts, setReceipts] = useState<Receipt[]>(RECEIPTS_DUMMY_DATA);

  // ─── Student Search ────────────────────────────────────────────────────────
  const [query, setQuery]                   = useState("");
  const [suggestions, setSuggestions]       = useState<Student[]>([]);
  const [showDropdown, setShowDropdown]     = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const dropdownRef                         = useRef<HTMLDivElement>(null);

  // ─── Form Fields ───────────────────────────────────────────────────────────
  const [feeHead, setFeeHead]           = useState("");
  const [paymentMode, setPaymentMode]   = useState<PaymentMode | null>(null);
  const [period, setPeriod]             = useState("");
  const [amount, setAmount]             = useState("");
  const [paymentDate, setPaymentDate]   = useState("");
  const [receiptNo, setReceiptNo]       = useState("");

  // ─── Submission State ──────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess]       = useState(false);

  // ─── Derived ───────────────────────────────────────────────────────────────
  const canGenerate =
    !!selectedStudent &&
    !!feeHead &&
    !!paymentMode &&
    !!amount &&
    !!paymentDate &&
    !!receiptNo &&
    !isSubmitting;

  // ─── Close dropdown on outside click ──────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const lower = val.toLowerCase();
    const matches = STUDENTS_DATA.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.admissionNo.toLowerCase().includes(lower)
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

    await new Promise((r) => setTimeout(r, 800));

    const newReceipt: Receipt = {
      id:        Date.now().toString(),
      receiptNo,
      date:      new Date(paymentDate).toLocaleDateString("en-IN", {
                   day: "numeric", month: "short", year: "numeric",
                 }),
      time:      new Date().toLocaleTimeString("en-IN", {
                   hour: "2-digit", minute: "2-digit",
                 }),
      student:   selectedStudent.name,
      className: `${selectedStudent.className}${selectedStudent.section}`,
      feeHead,
      amount:    Number(amount),
      mode:      paymentMode!,
      status:    "Not Sent",
      waStatus:  "Not Sent",
    };

    setReceipts((prev) => [newReceipt, ...prev]);
    setIsSubmitting(false);
    setIsSuccess(true);

    onSuccess?.(receiptNo);
    setTimeout(() => onClose?.(), 1000);
  };

  return {
    // data
    receipts,

    // search
    query,
    suggestions,
    showDropdown,
    selectedStudent,
    dropdownRef,

    // form
    feeHead,
    paymentMode,
    period,
    amount,
    paymentDate,
    receiptNo,

    // status
    isSubmitting,
    isSuccess,
    canGenerate,

    // setters
    setFeeHead,
    setPaymentMode,
    setPeriod,
    setAmount,
    setPaymentDate,
    setReceiptNo,

    // handlers
    handleQueryChange,
    handleSelectStudent,
    handleGenerate,
  };
};

// alias for backwards compatibility
export const useReceipts = useReceiptsManager;