import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getRecentIncomeTransactions,
  getTotalExpensesByMonth,
  getMonthlyPaidPayroll,
  getBalanceSheet,
} from "@/services/accountant-reports.api";
import type { BalanceSheetData } from "@/services/accountant-reports.api";
import {
  getAllLedgerEntries,
  createLedgerEntry,
  updateLedgerEntryById,
  deleteLedgerEntryById,
} from "@/services/ledger.api";
import { initialPettyCash, monthlyChartData } from "../data/ledger.data";
import type { LedgerEntry, ExpenseFormInput } from "../types/Ledger.types";

function buildFormData(data: ExpenseFormInput, file?: File): FormData {
  const fd = new FormData();
  fd.append("category",    data.category);
  fd.append("description", data.description);
  fd.append("amount",      String(data.amount));
  fd.append("date",        data.date);
  fd.append("paidVia",     data.paidVia);
  if (data.reference) fd.append("reference", data.reference);
  if (data.notes)     fd.append("notes",     data.notes);
  if (file)           fd.append("attachment", file);
  return fd;
}

function matchesMonth(dateStr: string, m: number, y: number): boolean {
  const d = new Date(dateStr);
  return d.getFullYear() === y && d.getMonth() + 1 === m;
}

export function useLedger(month?: number, year?: number) {
  const now = new Date();
  const m   = month ?? (now.getMonth() + 1);
  const y   = year  ?? now.getFullYear();

  // ── Raw data (all records from API) ──────────────────────────────────────

  const [allExpenses,         setAllExpenses]         = useState<LedgerEntry[]>([]);
  const [allIncomeTransactions,setAllIncomeTransactions]=useState<LedgerEntry[]>([]);
  const [totalExpenses,       setTotalExpenses]       = useState<number>(0);
  const [paidPayroll,         setPaidPayroll]         = useState<number>(0);
  const [balanceSheetData,    setBalanceSheetData]    = useState<BalanceSheetData | null>(null);

  // ── Fetch all expense entries once (re-fetch after CRUD) ─────────────────

  const loadEntries = useCallback(async () => {
    try {
      const res = await getAllLedgerEntries();
      if (res.status) {
        setAllExpenses(
          res.data.map((r) => ({
            id:          r.id,
            date:        r.date,
            category:    r.category,
            description: r.description,
            reference:   r.reference ?? undefined,
            amount:      r.amount,
            recordedBy:  "",
            type:        "Expense" as const,
            paidVia:     r.paidVia,
            notes:       r.notes ?? undefined,
          }))
        );
      }
    } catch {
      toast.error("Failed to load expense entries");
    }
  }, []);

  useEffect(() => { loadEntries(); }, [loadEntries]);

  // ── Fetch all income transactions once ───────────────────────────────────

  useEffect(() => {
    getRecentIncomeTransactions()
      .then((res) => {
        if (res.status) {
          setAllIncomeTransactions(
            res.data.map((tx, i) => ({
              id:          String(i),
              date:        tx.date,
              category:    tx.type,
              description: tx.description,
              reference:   tx.references?.join(", ") ?? "",
              amount:      tx.total_amount,
              recordedBy:  tx.collected_by,
              type:        "Income" as const,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  // ── Expense stat card + balance sheet APIs (support month/year) ──────────

  useEffect(() => {
    getTotalExpensesByMonth(m, y)
      .then((res) => { if (res.status) setTotalExpenses(res.data.totalExpenses); })
      .catch(() => {});
    getMonthlyPaidPayroll(m, y)
      .then((res) => { if (res.status) setPaidPayroll(res.data.total_paid); })
      .catch(() => {});
    getBalanceSheet(m, y)
      .then((res) => { if (res.status) setBalanceSheetData(res.data); })
      .catch(() => {});
  }, [m, y]);

  // ── Client-side month filtering ───────────────────────────────────────────

  const expenseEntries = useMemo(
    () => allExpenses.filter((e) => matchesMonth(e.date, m, y)),
    [allExpenses, m, y]
  );

  const incomeTransactions = useMemo(
    () => allIncomeTransactions.filter((e) => matchesMonth(e.date, m, y)),
    [allIncomeTransactions, m, y]
  );

  // ── Income stat card totals from filtered transactions ────────────────────

  const totalIncome = useMemo(
    () => incomeTransactions.reduce((s, e) => s + e.amount, 0),
    [incomeTransactions]
  );

  const feeCollection = useMemo(
    () => incomeTransactions.filter((e) => e.category === "Fee Collection").reduce((s, e) => s + e.amount, 0),
    [incomeTransactions]
  );

  const otherIncome = useMemo(
    () => incomeTransactions.filter((e) => e.category !== "Fee Collection").reduce((s, e) => s + e.amount, 0),
    [incomeTransactions]
  );

  // ── Expense derived totals ────────────────────────────────────────────────

  const expense = useMemo(
    () => expenseEntries.reduce((s, e) => s + e.amount, 0),
    [expenseEntries]
  );

  const payrollExpense = useMemo(
    () => expenseEntries.filter((e) => e.category === "Salaries").reduce((s, e) => s + e.amount, 0),
    [expenseEntries]
  );

  const operatingExpenses = useMemo(
    () => expenseEntries.filter((e) => e.category !== "Salaries").reduce((s, e) => s + e.amount, 0),
    [expenseEntries]
  );

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const createEntry = async (data: ExpenseFormInput, file?: File) => {
    const res = await createLedgerEntry(buildFormData(data, file));
    if (res.status) {
      toast.success("Expense entry added");
      loadEntries();
    } else {
      toast.error(res.message || "Failed to add entry");
      throw new Error();
    }
  };

  const updateEntry = async (id: string, data: ExpenseFormInput, file?: File) => {
    const res = await updateLedgerEntryById(id, buildFormData(data, file));
    if (res.status) {
      toast.success("Entry updated successfully");
      loadEntries();
    } else {
      toast.error(res.message || "Failed to update entry");
      throw new Error();
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const res = await deleteLedgerEntryById(id);
      if (res.status) {
        toast.success("Entry deleted");
        loadEntries();
      }
    } catch {
      toast.error("Failed to delete entry");
    }
  };

  const pettyCash = initialPettyCash;
  const chartData = monthlyChartData;

  return {
    expenseEntries,
    incomeTransactions,
    totalIncome,
    feeCollection,
    otherIncome,
    totalExpenses,
    paidPayroll,
    balanceSheetData,
    pettyCash,
    expense,
    payrollExpense,
    operatingExpenses,
    chartData,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}
