import { useFeeStore } from "../store/fee.store";

export const useFees = () => {
  const store = useFeeStore();

  const pending = store.fees.filter(
    (f) => f.status === "pending" || f.status === "overdue" || f.status === "upcoming"
  );

  const allPaid = pending.length === 0;

  return {
    ...store,
    pending,
    allPaid,
  };
};