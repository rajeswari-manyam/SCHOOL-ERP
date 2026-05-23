import { useState, useMemo, useCallback } from "react";
import {
  initialEntries,
  initialPettyCash,
  monthlyChartData,
} from "../data/ledger.data";

import type { LedgerEntry, PettyCashEntry } from "../types/Ledger.types";

export const useLedger = () => {
  const [entries, setEntries] = useState<LedgerEntry[]>(initialEntries);
  const [pettyCash, setPettyCash] =
    useState<PettyCashEntry[]>(initialPettyCash);


  const income = useMemo(() => {
    return entries
      .filter((e) => e.type === "Income")
      .reduce((sum, e) => sum + e.amount, 0);
  }, [entries]);


  const expense = useMemo(() => {
    return entries
      .filter((e) => e.type === "Expense")
      .reduce((sum, e) => sum + e.amount, 0);
  }, [entries]);

  const feeCollection = useMemo(() => {
    return entries
      .filter(
        (e) => e.type === "Income" && e.category === "Fee Collection"
      )
      .reduce((sum, e) => sum + e.amount, 0);
  }, [entries]);

  const otherIncome = useMemo(() => {
    return entries
      .filter(
        (e) => e.type === "Income" && e.category === "Other Income"
      )
      .reduce((sum, e) => sum + e.amount, 0);
  }, [entries]);


  const payrollExpense = useMemo(() => {
    return entries
      .filter((e) => e.type === "Expense" && e.category === "Salaries")
      .reduce((sum, e) => sum + e.amount, 0);
  }, [entries]);

  const operatingExpenses = useMemo(() => {
    return entries
      .filter((e) => e.type === "Expense" && e.category !== "Salaries")
      .reduce((sum, e) => sum + e.amount, 0);
  }, [entries]);

  
  const addEntry = useCallback((entry: LedgerEntry) => {
    setEntries((prev) => [entry, ...prev]);
  }, []);

  const addPettyCashEntry = useCallback((entry: PettyCashEntry) => {
    setPettyCash((prev) => [...prev, entry]);
  }, []);

  const resetLedger = useCallback(() => {
    setEntries(initialEntries);
    setPettyCash(initialPettyCash);
  }, []);


  return {
    // data
    entries,
    pettyCash,
    chartData: monthlyChartData,

    // summary
    income,
    expense,
    feeCollection,
    otherIncome,
    payrollExpense,
    operatingExpenses,

    // actions
    addEntry,
    addPettyCashEntry,
    resetLedger,
  };
};