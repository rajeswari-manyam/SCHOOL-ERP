import { useMemo } from "react";
import { mockFees, mockTransactions } from "../data/fee.data";

export const useFeeData = () => {
  const fees = useMemo(() => mockFees, []);
  const transactions = useMemo(() => mockTransactions, []);

  return {
    fees,
    transactions,
  };
};