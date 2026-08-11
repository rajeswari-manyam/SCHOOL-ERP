import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { IncomeExpenseCards } from "../components/IncomeExpenseCard";
import { LedgerTable } from "../components/LedgerTable";
import { BalanceSheet } from "../components/BalanceSheet";
import { useLedger } from "../hooks/useledger";

import type { LedgerEntry } from "../types/Ledger.types";

const TAB_ITEMS = [
  { value: "income",   label: "Income" },
  { value: "expenses", label: "Expenses" },
  { value: "balance",  label: "Balance Sheet" },
];

export default function LedgerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state as { activeTab?: string; month?: number; year?: number } | null;

  const [activeTab,   setActiveTab]   = useState(navState?.activeTab ?? "income");
  const [currentDate, setCurrentDate] = useState(() =>
    navState?.month && navState?.year ? new Date(navState.year, navState.month - 1, 1) : new Date()
  );

  const {
    expenseEntries,
    incomeTransactions,
    totalIncome,
    feeCollection,
    otherIncome,
    totalExpenses,
    paidPayroll,
    balanceSheetData,
    expense,
    payrollExpense,
    operatingExpenses,
    deleteEntry,
  } = useLedger(currentDate.getMonth() + 1, currentDate.getFullYear());

  // ── Handlers ──────────────────────────────────────────────────────────────

  const goToAddExpense = () =>
    navigate("/accountant/ledger/expense/add", {
      state: { month: currentDate.getMonth() + 1, year: currentDate.getFullYear() },
    });

  const handleEdit = (entry: LedgerEntry) =>
    navigate(`/accountant/ledger/expense/edit/${entry.id}`, {
      state: { editData: entry, month: currentDate.getMonth() + 1, year: currentDate.getFullYear() },
    });

  const handleDelete = (entry: LedgerEntry) => {
    deleteEntry(entry.id);
  };

  const formatMonth = (date: Date) =>
    date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const handlePrevMonth = () =>
    setCurrentDate((prev) => { const d = new Date(prev); d.setMonth(prev.getMonth() - 1); return d; });

  const handleNextMonth = () =>
    setCurrentDate((prev) => { const d = new Date(prev); d.setMonth(prev.getMonth() + 1); return d; });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-2 pb-6 space-y-6 -mx-4 md:-mx-6 lg:-mx-8 -mt-4 md:-mt-6 lg:-mt-8">

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>Accounts</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-700 font-medium">Ledger</span>
          </div>
          <h1 className="text-sm md:text-base font-bold text-gray-900">
            Income & Expense Ledger
          </h1>
          <p className="text-[11px] text-gray-500">
            Financial records — Hanamkonda Public School
          </p>
        </div>

        {/* Month selector — always visible */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="flex items-center justify-between bg-white border rounded-lg px-2 py-1 shadow-sm w-full sm:w-auto">
            <button onClick={handlePrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs md:text-sm whitespace-nowrap">
              {formatMonth(currentDate)}
            </span>
            <button onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Extra buttons — expenses tab only */}
          {activeTab === "expenses" && (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button className="flex-1 sm:flex-none bg-indigo-600 text-white text-xs" onClick={goToAddExpense}>
                <Plus className="w-4 h-4" />
                Add Entry
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs items={TAB_ITEMS} value={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      <div className="mt-4 md:mt-6">

        {activeTab === "income" && (
          <>
            <IncomeExpenseCards
              type="income"
              totalIncome={totalIncome}
              feeCollection={feeCollection}
              otherIncome={otherIncome}
              totalExpense={expense}
              payrollExpense={payrollExpense}
              operatingExpenses={operatingExpenses}
            />
            {incomeTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-lg border border-gray-200">
                <span className="text-4xl mb-3">💰</span>
                <p className="text-sm font-medium">No income entries found</p>
                <p className="text-xs mt-1">Income entries will appear here once recorded</p>
              </div>
            ) : (
              <LedgerTable data={incomeTransactions} type="income" onEdit={handleEdit} />
            )}
          </>
        )}

        {activeTab === "expenses" && (
          <>
            <IncomeExpenseCards
              type="expense"
              totalIncome={totalIncome}
              feeCollection={feeCollection}
              otherIncome={otherIncome}
              totalExpense={expense}
              payrollExpense={payrollExpense}
              operatingExpenses={operatingExpenses}
              apiTotalExpenses={totalExpenses}
              apiPaidPayroll={paidPayroll}
            />
            {expenseEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-lg border border-gray-200">
                <span className="text-4xl mb-3">💸</span>
                <p className="text-sm font-medium">No expense entries found</p>
                <p className="text-xs mt-1">Expense entries will appear here once recorded</p>
              </div>
            ) : (
              <LedgerTable data={expenseEntries} type="expense" onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </>
        )}

        {activeTab === "balance" && (
          <BalanceSheet income={totalIncome} expense={expense} balanceSheetData={balanceSheetData} />
        )}

      </div>

    </div>
  );
}
