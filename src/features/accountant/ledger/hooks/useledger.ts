import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUIStore } from "@/store/uiStore";
import {
  getRecentIncomeTransactions,
  getTotalExpensesByMonth,
  getMonthlyPaidPayroll,
  getBalanceSheet,
} from "@/services/accountant-reports.api";
import {
  getAllLedgerEntries,
  createLedgerEntry,
  updateLedgerEntryById,
  deleteLedgerEntryById,
} from "@/services/ledger.api";
import { initialPettyCash, monthlyChartData } from "../data/ledger.data";
import type { LedgerEntry, ExpenseFormInput } from "../types/Ledger.types";

export type LedgerTab = "income" | "expenses" | "balance";

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

// Query keys centralized here so mutations below can invalidate precisely —
// same pattern to copy into any other hook you convert.
const ledgerKeys = {
  expenses: ["ledger", "expenses", "all"] as const,
  income: ["ledger", "income", "all"] as const,
  expenseStats: (m: number, y: number, academicYearId: string) =>
    ["ledger", "expense-stats", m, y, academicYearId] as const,
  balanceSheet: (m: number, y: number) => ["ledger", "balance-sheet", m, y] as const,
};

/**
 * @param activeTab   Which of the 3 Ledger tabs is currently open. Tab-only
 *                     APIs are gated behind `enabled` so switching tabs never
 *                     fires a request the visible panel doesn't need — and
 *                     revisiting a tab within the global 5-minute staleTime
 *                     (see src/config/queryClient.ts) serves cached data
 *                     instead of refetching.
 */
export function useLedger(activeTab: LedgerTab, month?: number, year?: number) {
  const now = new Date();
  const m   = month ?? (now.getMonth() + 1);
  const y   = year  ?? now.getFullYear();
  const academicYearId = useUIStore((s) => s.academicYearId) ?? "";
  const queryClient = useQueryClient();

  // ── Base data — needed by every tab (Income/Expense tabs cross-reference
  //    each other's totals, and Balance derives from both), so these two
  //    stay unconditional. Gating them would just trade "fetch once" for
  //    "refetch on every tab switch", which is the opposite of the goal. ──

  const expensesQuery = useQuery({
    queryKey: ledgerKeys.expenses,
    queryFn: async (): Promise<LedgerEntry[]> => {
      const res = await getAllLedgerEntries();
      if (!res.status) throw new Error("Failed to load expense entries");
      return res.data.map((r) => ({
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
      }));
    },
  });
  if (expensesQuery.isError) toast.error("Failed to load expense entries");

  const incomeQuery = useQuery({
    queryKey: ledgerKeys.income,
    queryFn: async (): Promise<LedgerEntry[]> => {
      const res = await getRecentIncomeTransactions();
      if (!res.status) throw new Error("Failed to load income transactions");
      return res.data.map((tx, i) => ({
        id:          String(i),
        date:        tx.date,
        category:    tx.type,
        description: tx.description,
        reference:   tx.references?.join(", ") ?? "",
        amount:      tx.total_amount,
        recordedBy:  tx.collected_by,
        type:        "Income" as const,
      }));
    },
  });

  // ── Expense-tab-only stat totals — only ever requested while that panel
  //    is the one on screen. ──
  const expenseStatsQuery = useQuery({
    queryKey: ledgerKeys.expenseStats(m, y, academicYearId),
    queryFn: async () => {
      const [totalRes, payrollRes] = await Promise.all([
        getTotalExpensesByMonth(m, y),
        getMonthlyPaidPayroll(m, academicYearId),
      ]);
      return {
        totalExpenses: totalRes.status ? totalRes.data.totalExpenses : 0,
        paidPayroll:   payrollRes.status ? payrollRes.data.total_paid : 0,
      };
    },
    enabled: activeTab === "expenses",
  });

  // ── Balance-tab-only ──
  const balanceSheetQuery = useQuery({
    queryKey: ledgerKeys.balanceSheet(m, y),
    queryFn: async () => {
      const res = await getBalanceSheet(m, y);
      if (!res.status) throw new Error("Failed to load balance sheet");
      return res.data;
    },
    enabled: activeTab === "balance",
  });

  // ── Client-side month filtering ───────────────────────────────────────────

  const allExpenses = expensesQuery.data ?? [];
  const allIncomeTransactions = incomeQuery.data ?? [];

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

  // ── CRUD — mutate then invalidate, instead of the old re-fetch-manually
  //    `loadEntries()` call. Only the "expenses" query is affected; income
  //    and the two tab-gated queries are untouched. ──────────────────────────

  const invalidateExpenses = () => queryClient.invalidateQueries({ queryKey: ledgerKeys.expenses });

  const createEntry = async (data: ExpenseFormInput, file?: File) => {
    const res = await createLedgerEntry(buildFormData(data, file));
    if (res.status) {
      toast.success("Expense entry added");
      invalidateExpenses();
    } else {
      toast.error(res.message || "Failed to add entry");
      throw new Error();
    }
  };

  const updateEntry = async (id: string, data: ExpenseFormInput, file?: File) => {
    const res = await updateLedgerEntryById(id, buildFormData(data, file));
    if (res.status) {
      toast.success("Entry updated successfully");
      invalidateExpenses();
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
        invalidateExpenses();
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
    totalExpenses: expenseStatsQuery.data?.totalExpenses ?? 0,
    paidPayroll:   expenseStatsQuery.data?.paidPayroll ?? 0,
    balanceSheetData: balanceSheetQuery.data ?? null,
    pettyCash,
    expense,
    payrollExpense,
    operatingExpenses,
    chartData,
    createEntry,
    updateEntry,
    deleteEntry,
    isLoading: expensesQuery.isLoading || incomeQuery.isLoading,
  };
}
