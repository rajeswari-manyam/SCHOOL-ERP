import { useEffect } from "react";
import { useFeeStore } from "../store/fee.store";

export const useFees = (studentId?: string) => {
  const fetchFees = useFeeStore((s) => s.fetchFees);
  const store = useFeeStore();

  useEffect(() => {
    if (studentId && studentId.trim() !== "") {
      fetchFees(studentId);
    }
  }, [studentId, fetchFees]);

  const pending = store.fees.filter(
    (f) =>
      f.status === "pending" ||
      f.status === "overdue" ||
      f.status === "upcoming"
  );

  const allPaid = !store.loading && pending.length === 0;

  return {
    ...store,
    fetchFees,
    pending,
    allPaid,
    // Annual overview data — already computed in store from API
    tuitionMonths: store.tuitionMonths,
    examTerms: store.examTerms,
    annualSummary: store.annualSummary,
  };
};