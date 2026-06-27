import { useEffect } from "react";
import { useFeeStore } from "../store/fee.store";

export const useFees = (studentId?: string) => {
  const store = useFeeStore();
  const fetchFees = useFeeStore((s) => s.fetchFees);

  useEffect(() => {
    if (studentId) fetchFees(studentId);
  }, [studentId, fetchFees]);

  const pending = store.fees.filter((f) => f.status !== "paid");
  const allPaid = pending.length === 0 && store.fees.length > 0 && !store.loading;

  return {
    ...store,
    pending,
    allPaid,
    history: store.history,
    fetchFees,
  };
};
