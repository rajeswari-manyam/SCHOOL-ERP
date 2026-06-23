import { useFeeStore } from "../store/fee.store";
import type { Fee, PaymentHistory } from "../types/fee.types";

export const useFees = (_studentId?: string) => {
  const store = useFeeStore();
  const fetchFees = useFeeStore((s) => s.fetchFees);

  // API not yet available — no fetch on mount
  const fees: Fee[] = [];
  const history: PaymentHistory[] = [];
  const pending: Fee[] = [];
  const allPaid = false;

  return {
    ...store,
    fees,
    history,
    pending,
    allPaid,
    loading: false,
    error: null,
    fetchFees,
    tuitionMonths: store.tuitionMonths,
    examTerms: store.examTerms,
    annualSummary: store.annualSummary,
  };
};