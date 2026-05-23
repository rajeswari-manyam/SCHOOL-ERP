import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FeeTabs } from "../components/FeeTabs";
import { FilterBar } from "../components/FilterBar";
import { PendingFeesTable } from "../components/PendingFeeTable";
import { useFeeData } from "../hooks/useFees";
import { StatCard } from "../../../../components/ui/statcard";
import { ChevronLeft, ChevronRight, Send, Download} from "lucide-react";
import typography from "@/styles/typography";
import { RecordFeePaymentModal } from "../components/RecordPaymentModal";
import { AllTransactionsTable } from "../components/AllTransactionTable";
import { FeeStructure } from "../components/FeeStructure";
import { TransportFees } from "../components/TransportFee";
import { Concessions } from "../components/ConcessionTable";
import { AddFeeConcessionModal } from "../components/AddFeeConcessionModal";
import { FEE_STATS } from "../constants/fee.constants";
import { applyDueStatus, applySortBy } from "../utils/fee.utils";
import type { FeeRow, FilterValues } from "../types/fees.types";

export default function FeeManagementPage() {
  const [activeTab, setActiveTab] = useState("Pending Fees");
  const { fees, transactions } = useFeeData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConcessionModal, setShowConcessionModal] = useState(false);
  const [showFeeHeadModal, setShowFeeHeadModal] = useState(false);
  const [triggerAddSlab, setTriggerAddSlab] = useState(false);
  const [triggerEditSlabs, setTriggerEditSlabs] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterValues | null>(null);

  const isPendingFees   = activeTab === "Pending Fees";
  const isAllTx         = activeTab === "All Transactions";
  const isFeeStructure  = activeTab === "Fee Structure";
  const isTransportFees = activeTab === "Transport Fees";
  const isConcessions   = activeTab === "Concessions";

  
  const hideFilterBar      = isFeeStructure || isTransportFees || isConcessions;
  const hideStandardHeader = isFeeStructure || isTransportFees || isConcessions || isAllTx;

  const handlePrevMonth = () =>
    setCurrentDate((prev) => { const d = new Date(prev); d.setMonth(d.getMonth() - 1); return d; });

  const handleNextMonth = () =>
    setCurrentDate((prev) => { const d = new Date(prev); d.setMonth(d.getMonth() + 1); return d; });

  const formattedMonth = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

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

      {/* ── Stats Cards ── */}
      {!hideStandardHeader && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 md:px-6 pt-4 sm:pt-5 pb-2">
          {FEE_STATS.map((s) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={<span className={`${s.color} font-bold text-sm md:text-base`}>{s.value}</span>}
            />
          ))}
        </div>
      )}

      {/* ── Main Card ── */}
      <div className="mx-0 sm:mx-3 md:sm:mx-6 my-2 sm:my-4 bg-white rounded-none sm:rounded-xl border-y sm:border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="flex flex-col gap-3 px-3 sm:px-4 md:px-5 pt-4 sm:pt-5 pb-3">
          {/* Title Row */}
        {/* Header Row (Title + Actions side by side) */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

  {/* LEFT: Title */}
  <div className="min-w-0">
    <h2 className={`${typography.heading.h6} font-medium text-gray-900 text-sm sm:text-base`}>
      Fee Management
    </h2>
    <p className={`${typography.body.xs} text-gray-500 mt-0.5 text-[11px] sm:text-xs`}>
      April 2025 — Academic Year 2024–25
    </p>
  </div>

  {/* RIGHT: ALL ACTIONS (context-aware) */}
  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">

    {/* Pending / All Transactions */}
    {(isPendingFees || isAllTx) && (
      <>
        {/* Month */}
        <div className="flex items-center px-3 sm:px-4 h-9 sm:h-8 rounded-full gap-2 bg-[#3525CD] text-white">
          <button onClick={handlePrevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs whitespace-nowrap">
            {formattedMonth}
          </span>

          <button onClick={handleNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <Button variant="outline" size="sm">
          Import Fee
        </Button>

        <Button
          size="sm"
          className="bg-[#3525CD] text-white"
          onClick={() => setShowPaymentModal(true)}
        >
          Record Payment
        </Button>
      </>
    )}

    {/* ✅ Fee Structure INLINE buttons (FIXED) */}
    {isFeeStructure && (
      <>
        <Button
          variant="outline"
          size="sm"
          className="text-[11px] sm:text-xs font-semibold text-[#3525CD] border-[#3525CD]"
        >
          Copy from Last Year
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="text-[11px] sm:text-xs font-semibold text-slate-700 border-slate-300"
          onClick={() => setShowFeeHeadModal(true)}
        >
          + Add Fee Head
        </Button>

        <Button
          size="sm"
          className="text-[11px] sm:text-xs font-semibold bg-[#3525CD] text-white"
        >
          Save Structure
        </Button>
      </>
    )}

    {/* Transport */}
    {isTransportFees && (
      <>
        <Button
          size="sm"
          className="bg-[#3525CD] text-white"
          onClick={() => setTriggerAddSlab(true)}
        >
          + Add Slab
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="text-[#3525CD]"
          onClick={() => setTriggerEditSlabs(true)}
        >
          Edit Slabs
        </Button>
      </>
    )}

  </div>
</div>
         </div>

        {/* ── Tabs ── */}
        <div className="px-3 sm:px-5 border-b border-gray-100 mt-1 sm:mt-2 overflow-x-auto scrollbar-hide">
          <FeeTabs active={activeTab} setActive={setActiveTab} />
        </div>

        {/* ── Filter Bar ── */}
        {!hideFilterBar && (
          <div className="mx-3 sm:mx-5 mt-3 sm:mt-4 mb-3 sm:mb-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-3 sm:p-4">
              <FilterBar
                onSearch={setActiveFilters}
                showDueStatus={isPendingFees}
              />
            </div>
          </div>
        )}

        {/* ── Count Row ── */}
        {isPendingFees && (
          <div className="px-3 sm:px-5 py-2 text-[11px] sm:text-xs text-gray-500">
            Showing{" "}
            <span className={`${typography.body.xs} text-gray-800 font-medium`}>
              {filteredFees.length} students
            </span>{" "}
            |{" "}
            <span className={`${typography.body.xs} font-bold`}>
              ₹{totalPending.toLocaleString("en-IN")}
            </span>{" "}
            total pending
          </div>
        )}

        {/* ── Tab Content ── */}
        <div className="min-h-[200px]">
          {isPendingFees   && <PendingFeesTable data={filteredFees} />}
          {isAllTx         && <AllTransactionsTable data={transactions} />}
          {isFeeStructure  && (
            <FeeStructure
              showModal={showFeeHeadModal}
              setShowModal={setShowFeeHeadModal}
            />
          )}
          {isTransportFees && (
            <TransportFees
              triggerAddSlab={triggerAddSlab}
              onAddSlabHandled={() => setTriggerAddSlab(false)}
              triggerEditSlabs={triggerEditSlabs}
              onEditSlabsHandled={() => setTriggerEditSlabs(false)}
            />
          )}
          {isConcessions && (
            <Concessions onAddConcession={() => setShowConcessionModal(true)} />
          )}
        </div>

        {/* ── Footer ── */}
        {isPendingFees && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-5 py-3 border-t border-gray-100 gap-3">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-[11px] sm:text-xs h-8 text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
              >
                <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="whitespace-nowrap">Overdue (29)</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-[11px] sm:text-xs h-8 flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
              >
                <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="whitespace-nowrap">Due Today (12)</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-[11px] sm:text-xs h-8 flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
              >
                <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                CSV
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-[11px] sm:text-xs h-8 flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
              >
                <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                PDF
              </Button>
            </div>

            <div className="flex gap-1 items-center self-center sm:self-auto">
              {["‹", "1", "2", "3", "›"].map((p) => (
                <button
                  key={p}
                  className={`w-8 h-8 sm:w-7 sm:h-7 text-xs rounded border flex items-center justify-center ${
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