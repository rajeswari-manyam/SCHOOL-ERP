import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FeeTabs } from "../components/FeeTabs";
import { FilterBar, type FilterValues } from "../components/FilterBar";
import { PendingFeesTable } from "../components/PendingFeeTable";
import { useFeeData } from "../hooks/useFees";
import { StatCard } from "../../../../components/ui/statcard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import typography from "@/styles/typography";
import { RecordFeePaymentModal } from "../components/RecordPaymentModal";
import { AllTransactionsTable } from "../components/AllTransactions";
import { FeeStructure } from "../components/FeeStructure";
import { TransportFees } from "../components/TransportFee";
import { Concessions } from "../components/ConcessionTable";
import { AddFeeConcessionModal } from "../components/AddConcession";
import type { FeeRow } from "../types/fees.types";

const stats = [
  { label: "Total Pending", value: "₹1,18,000", color: "text-red-600" },
  { label: "Collected Today", value: "₹24,500", color: "text-green-600" },
  { label: "Reminders Sent", value: "47", color: "text-blue-600" },
  { label: "Overdue 30+ days", value: "12 students", color: "text-amber-600" },
];

// ── helpers ────────────────────────────────────────────────────────────────

function applyDueStatus(rows: FeeRow[], status: string): FeeRow[] {
  switch (status) {
    case "3-Day Warning":    return rows.filter((r) => r.daysOverdue > 0 && r.daysOverdue <= 3);
    case "Due Today":        return rows.filter((r) => r.daysOverdue === 0);
    case "Overdue":          return rows.filter((r) => r.daysOverdue > 0 && r.daysOverdue <= 30);
    case "Severely Overdue": return rows.filter((r) => r.daysOverdue > 30);
    default:                 return rows;
  }
}

function applySortBy(rows: FeeRow[], sortBy: string): FeeRow[] {
  const copy = [...rows];
  switch (sortBy) {
    case "Oldest First":         return copy.sort((a, b) => a.daysOverdue - b.daysOverdue);
    case "Amount (High to Low)": return copy.sort((a, b) => b.amount - a.amount);
    case "Amount (Low to High)": return copy.sort((a, b) => a.amount - b.amount);
    default:                     return copy.sort((a, b) => b.daysOverdue - a.daysOverdue);
  }
}

// ── component ──────────────────────────────────────────────────────────────

export default function FeeManagementPage() {
  const [activeTab, setActiveTab] = useState("Pending Fees");
  const { fees, transactions } = useFeeData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConcessionModal, setShowConcessionModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterValues | null>(null);

  const isPendingFees   = activeTab === "Pending Fees";
  const isAllTx         = activeTab === "All Transactions";
  const isFeeStructure  = activeTab === "Fee Structure";
  const isTransportFees = activeTab === "Transport Fees";
  const isConcessions   = activeTab === "Concessions";

  // Month nav + Import Fee + Record Payment only on Pending Fees & All Transactions
  const showHeaderButtons = isPendingFees || isAllTx;

  // Filter bar hidden on Fee Structure / Transport / Concessions
  const hideFilterBar = isFeeStructure || isTransportFees || isConcessions;

  // Stats hidden on Fee Structure / Transport / Concessions / All Transactions
  const hideStandardHeader = isFeeStructure || isTransportFees || isConcessions || isAllTx;

  const handlePrevMonth = () =>
    setCurrentDate((prev) => { const d = new Date(prev); d.setMonth(d.getMonth() - 1); return d; });

  const handleNextMonth = () =>
    setCurrentDate((prev) => { const d = new Date(prev); d.setMonth(d.getMonth() + 1); return d; });

  const formattedMonth = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  // ── filtered + sorted fee rows ───────────────────────────────────────────
  const filteredFees: FeeRow[] = (() => {
    if (!activeFilters) return fees;

    let result = fees.filter((row) => {
      const q = activeFilters.search.toLowerCase();
      const matchSearch =
        !q ||
        row.student.toLowerCase().includes(q) ||
        row.admissionNo.toLowerCase().includes(q);
      const matchClass =
        activeFilters.selectedClass === "All Classes" ||
        row.className.replace("-", "") === activeFilters.selectedClass;
      return matchSearch && matchClass;
    });

    result = applyDueStatus(result, activeFilters.dueStatus);
    result = applySortBy(result, activeFilters.sortBy);
    return result;
  })();

  const totalPending = filteredFees.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-0 bg-[#EFF4FF] min-h-screen">
      {showPaymentModal && (
        <RecordFeePaymentModal onClose={() => setShowPaymentModal(false)} />
      )}
      {showConcessionModal && (
        <AddFeeConcessionModal onClose={() => setShowConcessionModal(false)} />
      )}

      {/* Stats — only on Pending Fees */}
      {!hideStandardHeader && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-4 md:px-6 pt-5 pb-2">
          {stats.map((s) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={<span className={`${s.color} font-bold text-sm md:text-base`}>{s.value}</span>}
            />
          ))}
        </div>
      )}

      {/* Main Card */}
      <div className="mx-0 sm:mx-6 my-4 bg-white rounded-none sm:rounded-xl border-y sm:border border-gray-200 overflow-hidden">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-5 pt-5 pb-3 gap-4">
          {/* Heading always visible */}
          <div>
            <h2 className={`${typography.heading.h6} font-medium text-gray-1000`}>
              Fee Management
            </h2>
            <p className={`${typography.body.xs} text-gray-500 mt-0.5`}>
              April 2025 — Academic Year 2024–25
            </p>
          </div>

          {/* Month nav + action buttons — Pending Fees & All Transactions only */}
          {showHeaderButtons && (
            <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
              <div className="flex items-center px-4 h-8 rounded-full gap-3 bg-[#3525CD] w-full sm:w-auto justify-between sm:justify-start">
                <button onClick={handlePrevMonth}>
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <span className="text-xs font-medium text-white whitespace-nowrap">
                  {formattedMonth}
                </span>
                <button onClick={handleNextMonth}>
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>

              <Button variant="outline" size="sm" className="text-xs h-8 text-[#3525CD] flex-1 sm:flex-none">
                Import Fee
              </Button>

              <Button
                size="sm"
                className={`${typography.body.xs} h-8 bg-[#3525CD] hover:bg-[#2a1fb5] text-white flex-1 sm:flex-none`}
                onClick={() => setShowPaymentModal(true)}
              >
                Record Payment
              </Button>
            </div>
          )}

          {/* Fee Structure buttons — inline with heading */}
          {isFeeStructure && (
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-4 text-xs font-semibold text-[#3525CD] border-[#3525CD] hover:bg-indigo-50"
              >
                Copy from Last Year
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-4 text-xs font-semibold border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                + Add Fee Head
              </Button>
              <Button
                size="sm"
                className="h-8 px-4 text-xs font-semibold bg-[#3525CD] hover:bg-[#2a1fb5] text-white"
              >
                Save Fee Structure
              </Button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="px-5 border-b border-gray-100 mt-2">
          <FeeTabs active={activeTab} setActive={setActiveTab} />
        </div>

        {/* Filter Bar — hidden on Fee Structure / Transport / Concessions */}
        {!hideFilterBar && (
          <div className="mx-5 mt-4 mb-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4">
              <FilterBar
                onSearch={setActiveFilters}
                showDueStatus={isPendingFees}
              />
            </div>
          </div>
        )}

        {/* Count row — Pending Fees only */}
        {isPendingFees && (
          <div className="px-5 py-2 text-xs text-gray-500">
            Showing{" "}
            <span className={`${typography.body.xs} text-gray-800`}>
              {filteredFees.length} students
            </span>{" "}
            |{" "}
            <span className={`${typography.body.xs} font-bold`}>
              ₹{totalPending.toLocaleString("en-IN")}
            </span>{" "}
            total pending
          </div>
        )}

        {/* Tab content */}
        {isPendingFees   && <PendingFeesTable data={filteredFees} />}
        {isAllTx         && <AllTransactionsTable data={transactions} />}
        {isFeeStructure  && <FeeStructure />}
        {isTransportFees && <TransportFees />}
        {isConcessions   && (
          <Concessions onAddConcession={() => setShowConcessionModal(true)} />
        )}

        {/* Footer — Pending Fees only */}
        {isPendingFees && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="text-xs h-8 text-red-600 border-red-200 hover:bg-red-50">
                📤 Send Reminder to All Overdue (29 students)
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-8">
                📤 Send Reminder Due Today (12 students)
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-8">
                ⬇ Export CSV
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-8">
                ⬇ Export Full Defaulters PDF
              </Button>
            </div>

            <div className="flex gap-1 items-center">
              {["‹", "1", "2", "3", "›"].map((p) => (
                <button
                  key={p}
                  className={`w-7 h-7 text-xs rounded border flex items-center justify-center ${
                    p === "1"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}