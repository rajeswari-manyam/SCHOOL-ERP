import { useState, useMemo } from "react";
import {
  initialEntries,
  initialPettyCash,
  monthlyChartData,
} from "../data/ledger.data";
import type { LedgerEntry } from "../types/Ledger.types";

export function useLedger() {
  const [entries, setEntries] = useState<LedgerEntry[]>(initialEntries);

  const income = useMemo(
    () => entries.filter((e) => e.type === "Income").reduce((s, e) => s + e.amount, 0),
    [entries]
  );

  const expense = useMemo(
    () => entries.filter((e) => e.type === "Expense").reduce((s, e) => s + e.amount, 0),
    [entries]
  );

  const feeCollection = useMemo(
    () =>
      entries
        .filter((e) => e.type === "Income" && e.category === "Fee Collection")
        .reduce((s, e) => s + e.amount, 0),
    [entries]
  );

  const otherIncome = useMemo(
    () =>
      entries
        .filter((e) => e.type === "Income" && e.category === "Other Income")
        .reduce((s, e) => s + e.amount, 0),
    [entries]
  );

  const payrollExpense = useMemo(
    () =>
      entries
        .filter((e) => e.type === "Expense" && e.category === "Salaries")
        .reduce((s, e) => s + e.amount, 0),
    [entries]
  );

  const operatingExpenses = useMemo(
    () =>
      entries
        .filter((e) => e.type === "Expense" && e.category !== "Salaries")
        .reduce((s, e) => s + e.amount, 0),
    [entries]
  );

  const pettyCash = useState(initialPettyCash)[0];

  const chartData = monthlyChartData;

  const addEntry = (data: LedgerEntry) => {
    setEntries((prev) => [data, ...prev]);
  };

  return {
    entries,
    pettyCash,
    income,
    expense,
    feeCollection,
    otherIncome,
    payrollExpense,
    operatingExpenses,
    chartData,
    addEntry,
  };
}
