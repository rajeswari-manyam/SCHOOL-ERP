import { useState } from "react";
import type { LedgerEntry } from "../types/Ledger.types";

export const useLedger = () => {
  const [entries, setEntries] = useState<LedgerEntry[]>([
    {
      id: "1",
      date: "2026-04-14",
      category: "Fees",
      description: "Tuition Fees",
      amount: 5000,
      recordedBy: "Admin",
      type: "Income",
    },
    {
      id: "2",
      date: "2026-04-13",
      category: "Stationery",
      description: "Books purchase",
      amount: 2000,
      recordedBy: "Admin",
      type: "Expense",
    },
  ]);

  const addExpense = (entry: LedgerEntry) => {
    setEntries((prev) => [...prev, entry]);
  };

  return { entries, addExpense };
};