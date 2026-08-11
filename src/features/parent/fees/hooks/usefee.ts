import { useEffect } from "react";
import { useFeeStore } from "../store/fee.store";

export const useFees = (studentId?: string) => {
  // ✅ Select each field individually so this hook only re-renders (and
  // downstream useCallbacks stay stable) when the specific field it reads
  // actually changes — `const store = useFeeStore()` subscribes to every
  // field and returns a new object on every single store update, which is
  // the exact pattern that caused the dashboard/attendance browser-freeze
  // bug elsewhere in the app.
  const fees           = useFeeStore((s) => s.fees);
  const history         = useFeeStore((s) => s.history);
  const tuitionMonths   = useFeeStore((s) => s.tuitionMonths);
  const examTerms       = useFeeStore((s) => s.examTerms);
  const annualSummary   = useFeeStore((s) => s.annualSummary);
  const selectedFee     = useFeeStore((s) => s.selectedFee);
  const loading         = useFeeStore((s) => s.loading);
  const paying          = useFeeStore((s) => s.paying);
  const error           = useFeeStore((s) => s.error);
  const academicYearId  = useFeeStore((s) => s.academicYearId);

  const fetchFees      = useFeeStore((s) => s.fetchFees);
  const fetchFeeById   = useFeeStore((s) => s.fetchFeeById);
  const setSelectedFee = useFeeStore((s) => s.setSelectedFee);
  const recordPayment  = useFeeStore((s) => s.recordPayment);
  const deletePayment  = useFeeStore((s) => s.deletePayment);
  const markPaid       = useFeeStore((s) => s.markPaid);

  useEffect(() => {
    if (studentId) fetchFees(studentId);
  }, [studentId, fetchFees]);

  const pending = fees.filter((f) => f.status !== "paid");
  const allPaid = pending.length === 0 && fees.length > 0 && !loading;

  return {
    fees,
    history,
    tuitionMonths,
    examTerms,
    annualSummary,
    selectedFee,
    loading,
    paying,
    error,
    academicYearId,
    pending,
    allPaid,
    fetchFees,
    fetchFeeById,
    setSelectedFee,
    recordPayment,
    deletePayment,
    markPaid,
  };
};
