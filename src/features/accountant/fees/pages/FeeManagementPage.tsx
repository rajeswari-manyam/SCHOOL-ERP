import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FeeTabs } from "../components/FeeTabs";
import { FilterBar } from "../components/FilterBar";
import { PendingFeesTable } from "../components/PendingFeeTable";
import { useFeeData } from "../hooks/useFees";
import { ChevronLeft, ChevronRight } from "lucide-react";
import typography from "@/styles/typography";
import { AllTransactionsTable } from "../components/AllTransactionTable";
import { FeeStructure } from "../components/FeeStructure";
import { TransportFees } from "../components/TransportFee";
import { deleteRecordFeePayment } from "@/services/fee.api";
import { getStudentsByClassSection } from "@/services/attendance.api";
import { toast } from "sonner";

import { applyDueStatus, applySortBy } from "../utils/fee.utils";
import type { FeeRow, FilterValues, Transaction } from "../types/fees.types";

export default function FeeManagementPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    (location.state as { activeTab?: string } | null)?.activeTab ?? "Pending Fees"
  );
  const { fees, feesLoading, transactions, refreshTransactions, refreshFees } = useFeeData(activeTab);

  const handleDeleteRecord = useCallback(async (id: string) => {
    await deleteRecordFeePayment(id);
    toast.success("Payment record deleted");
    refreshTransactions();
  }, [refreshTransactions]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showFeeHeadModal, setShowFeeHeadModal] = useState(false);
  const [triggerAddSlab, setTriggerAddSlab] = useState(false);
  const [triggerEditSlabs, setTriggerEditSlabs] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterValues | null>(null);

  const isPendingFees   = activeTab === "Pending Fees";
  const isAllTx         = activeTab === "All Transactions";
  const isFeeStructure  = activeTab === "Fee Structure";
  const isTransportFees = activeTab === "Transport Fees";
  const hideFilterBar = isFeeStructure || isTransportFees;

  const handlePrevMonth = () =>
    setCurrentDate((prev) => { const d = new Date(prev); d.setMonth(d.getMonth() - 1); return d; });

  const handleNextMonth = () =>
    setCurrentDate((prev) => { const d = new Date(prev); d.setMonth(d.getMonth() + 1); return d; });

  const formattedMonth = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  // When a class + section are both picked, resolve the actual roster via
  // /tenant/studentsbyclasssection and filter fee/transaction rows down to
  // those students' IDs — pending-fee rows don't carry class/section info at
  // all, so matching by student id (not a guessed class-name string) is the
  // only thing that works for both tabs.
  const [classSectionStudentIds, setClassSectionStudentIds] = useState<Set<string> | null>(null);

  useEffect(() => {
    if (!activeFilters?.classId || !activeFilters?.sectionId) {
      setClassSectionStudentIds(null);
      return;
    }
    let cancelled = false;
    getStudentsByClassSection(activeFilters.classId, activeFilters.sectionId)
      .then((res) => {
        if (cancelled) return;
        const ids = new Set((res.data ?? []).map((s) => s.id).filter(Boolean));
        setClassSectionStudentIds(ids);
      })
      .catch(() => { if (!cancelled) setClassSectionStudentIds(new Set()); });
    return () => { cancelled = true; };
  }, [activeFilters?.classId, activeFilters?.sectionId]);

  const filteredFees: FeeRow[] = (() => {
    if (!activeFilters) return fees;

    let result = fees.filter((row) => {
      const q = activeFilters.search.toLowerCase();
      const matchSearch =
        !q ||
        row.student.toLowerCase().includes(q) ||
        row.admissionNo.toLowerCase().includes(q);
      const matchClass = !classSectionStudentIds || classSectionStudentIds.has(row.studentId ?? "");
      return matchSearch && matchClass;
    });

    result = applyDueStatus(result, activeFilters.dueStatus);
    result = applySortBy(result, activeFilters.sortBy);
    return result;
  })();

  const totalPending = (filteredFees || []).reduce((s, r) => s + r.amount, 0);

  const filteredTransactions: Transaction[] = (() => {
    const all = transactions ?? [];
    if (!activeFilters) return all;

    let result = all.filter((row) => {
      const q = activeFilters.search.toLowerCase();
      const matchSearch =
        !q ||
        row.student.toLowerCase().includes(q) ||
        (row.receiptNo ?? "").toLowerCase().includes(q);
      const matchClass = !classSectionStudentIds || classSectionStudentIds.has(row.studentId ?? "");
      const matchMode =
        activeFilters.selectedMode === "All Modes" ||
        row.mode === activeFilters.selectedMode;
      const matchDate =
        (!activeFilters.dateFrom || row.date >= activeFilters.dateFrom) &&
        (!activeFilters.dateTo || row.date <= activeFilters.dateTo);
      return matchSearch && matchClass && matchMode && matchDate;
    });

    if (activeFilters.sortBy === "Oldest First") {
      result = [...result].sort((a, b) => a.date.localeCompare(b.date));
    } else if (activeFilters.sortBy === "Amount (High to Low)") {
      result = [...result].sort((a, b) => b.paidAmount - a.paidAmount);
    } else if (activeFilters.sortBy === "Amount (Low to High)") {
      result = [...result].sort((a, b) => a.paidAmount - b.paidAmount);
    } else {
      result = [...result].sort((a, b) => b.date.localeCompare(a.date));
    }
    return result;
  })();

  return (
    <div className="flex flex-col w-full min-w-0 space-y-4 -mx-4 md:-mx-6 lg:-mx-8 -mt-4 md:-mt-6 lg:-mt-8 px-4 md:px-6 lg:px-8">
      {/* ── Main Card ── */}
      <div className="bg-white rounded-xl border border-gray-200 flex flex-col min-w-0 max-w-full overflow-hidden">

        {/* Header */}
        <div className="px-4 md:px-5 pt-5 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

            {/* LEFT: Title */}
            <div className="min-w-0 shrink-0">
              <h2 className={`${typography.heading.h6} font-medium text-gray-900 text-sm sm:text-base`}>
                Fee Management
              </h2>
              <p className={`${typography.body.xs} text-gray-500 mt-0.5 text-[11px] sm:text-xs`}>
                April 2025 — Academic Year 2024–25
              </p>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">

              {(isPendingFees || isAllTx) && (
                <>
                  {/* Month navigator */}
                  <div className="flex items-center h-8 px-3 rounded-full gap-2 bg-[#3525CD] text-white">
                    <button onClick={handlePrevMonth}>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs whitespace-nowrap">{formattedMonth}</span>
                    <button onClick={handleNextMonth}>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <Button
                    size="sm"
                    className="h-8 text-xs bg-[#3525CD] text-white"
                    onClick={() => navigate("/accountant/fees/payment/add", { state: { returnTab: activeTab } })}
                  >
                    Record Payment
                  </Button>
                </>
              )}

              {isFeeStructure && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 text-[#3525CD] border-[#3525CD]"
                  >
                    Copy from Last Year
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => setShowFeeHeadModal(true)}
                  >
                    + Add Fee Head
                  </Button>
                  <Button size="sm" className="h-8 text-xs bg-[#3525CD] text-white">
                    Save Structure
                  </Button>
                </>
              )}

              {isTransportFees && (
                <>
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-[#3525CD] text-white"
                    onClick={() => setTriggerAddSlab(true)}
                  >
                    + Add Slab
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs text-[#3525CD]"
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
        <div className="px-4 md:px-5 border-b border-gray-100 overflow-x-auto scrollbar-hide">
          <FeeTabs active={activeTab} setActive={setActiveTab} />
        </div>

        {/* ── Filter Bar ── */}
        {!hideFilterBar && (
          <div className="mx-4 md:mx-5 mt-4 mb-3 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-3 md:p-4">
              <FilterBar
                onSearch={setActiveFilters}
                showDueStatus={isPendingFees}
              />
            </div>
          </div>
        )}

        {/* ── Count Row ── */}
        {isPendingFees && (
          <div className="px-4 md:px-5 py-2 text-xs text-gray-500">
            Showing{" "}
            <span className="text-gray-800 font-medium">{filteredFees.length} students</span>{" "}
            |{" "}
            <span className="font-bold">₹{totalPending.toLocaleString("en-IN")}</span>{" "}
            total pending
          </div>
        )}

        {/* ── Tab Content ── */}
        <div className="min-h-[200px] overflow-x-auto">
          {isPendingFees && (filteredFees || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <span className="text-4xl mb-3">📋</span>
              <p className="text-sm font-medium">No pending fees found</p>
              <p className="text-xs mt-1">All fees are up to date for this period</p>
            </div>
          ) : isPendingFees && <PendingFeesTable data={filteredFees} isLoading={feesLoading} onConcessionApplied={refreshFees} />}

          {isAllTx && (
            <AllTransactionsTable
              data={filteredTransactions}
              onDelete={handleDeleteRecord}
            />
          )}

          {isFeeStructure && (
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

        </div>

        {/* ── Footer ── */}
        {isPendingFees && (
          <div className="flex items-center justify-end px-4 md:px-5 py-3 border-t border-gray-100 gap-3">
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