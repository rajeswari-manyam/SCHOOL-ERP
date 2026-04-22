import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Plus } from "lucide-react";

import { IncomeExpenseCards } from "../components/IncomeExpenseCard";
import { LedgerTable } from "../components/LedgerTable";
import { AddExpenseModal } from "../components/AddExpenseModal";
import { BalanceSheet } from "../components/BalanceSheet";
import { PettyCash } from "../components/PettyCash";
import { ExportModal } from "../components/ExportModal";
import { useLedger } from "../hooks/useLedger";

import type { LedgerEntry } from "../types/Ledger.types"; 
const TAB_ITEMS = [
  { value: "income",   label: "Income" },
  { value: "expenses", label: "Expenses" },
  { value: "balance",  label: "Balance Sheet" },
  { value: "petty",    label: "Petty Cash" },
];

export default function LedgerPage() {
  const [activeTab, setActiveTab] = useState("income");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingEntry, setEditingEntry] = useState<LedgerEntry | null>(null);

  const {
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
  } = useLedger();

  const incomeEntries  = entries.filter((e) => e.type === "Income");
  const expenseEntries = entries.filter((e) => e.type === "Expense");

  const handleAddExpense = (data: LedgerEntry) => {
    addEntry(data);
    setShowAddModal(false);
    setEditingEntry(null);
  };

  const handleEdit = (entry: LedgerEntry) => {
    setEditingEntry(entry);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingEntry(null);
  };

  const formatMonth = (date: Date) =>
    date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(prev.getMonth() - 1);
      return d;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(prev.getMonth() + 1);
      return d;
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>Accounts</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-700 font-medium">Ledger</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Income & Expense Ledger
          </h1>
          <p className="text-xs md:text-sm text-gray-500">
            Financial records — Hanamkonda Public School
          </p>
        </div>

        {/* Income / Expenses header actions */}
        {(activeTab === "income" || activeTab === "expenses") && (
          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm flex-1 md:flex-none justify-between md:justify-start">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevMonth}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-3 text-sm font-medium text-gray-700">
                {formatMonth(currentDate)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextMonth}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              className="flex-1 md:flex-none gap-2 text-xs md:text-sm text-gray-600 border-gray-200"
              onClick={() => setShowExportModal(true)}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              className="flex-1 md:flex-none gap-2 text-xs md:text-sm bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4" />
              Add Entry
            </Button>
          </div>
        )}

        {/* Petty Cash header actions */}
        {activeTab === "petty" && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            >
              Replenish Fund
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              + Add Petty Cash Entry
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs items={TAB_ITEMS} value={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      <div className="mt-6">
        {activeTab === "income" && (
          <>
            <IncomeExpenseCards
              type="income"
              totalIncome={income}
              feeCollection={feeCollection}
              otherIncome={otherIncome}
              totalExpense={expense}
              payrollExpense={payrollExpense}
              operatingExpenses={operatingExpenses}
            />
            <LedgerTable
              data={incomeEntries}
              type="income"
              onEdit={handleEdit}
            />
          </>
        )}

        {activeTab === "expenses" && (
          <>
            <IncomeExpenseCards
              type="expense"
              totalIncome={income}
              feeCollection={feeCollection}
              otherIncome={otherIncome}
              totalExpense={expense}
              payrollExpense={payrollExpense}
              operatingExpenses={operatingExpenses}
            />
            <LedgerTable
              data={expenseEntries}
              type="expense"
              onEdit={handleEdit}
            />
          </>
        )}

        {activeTab === "balance" && (
          <BalanceSheet income={income} expense={expense} chartData={chartData} />
        )}

       {activeTab === "petty" && (
  <PettyCash
    entries={pettyCash}

  />
)}

      </div>

      {showAddModal && (
        <AddExpenseModal
          initialData={
            editingEntry
              ? {
                  id:          editingEntry.id,
                  category:    editingEntry.category,
                  description: editingEntry.description,
                  amount:      String(editingEntry.amount),
                  reference:   editingEntry.reference,
                  date:        editingEntry.date,
                  paidVia:     editingEntry.paidVia ?? "Bank Transfer",
                  notes:       editingEntry.notes,
                }
              : undefined
          }
          onClose={handleCloseModal}
          onAdd={handleAddExpense}
        />
      )}

      {showExportModal && (
        <ExportModal onClose={() => setShowExportModal(false)} />
      )}

 
    </div>
  );
}