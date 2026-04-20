import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FeeTabs } from "../components/FeeTabs";
import { FilterBar } from "../components/FilterBar";
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

const stats = [
  { label: "Total Pending", value: "₹1,18,000", color: "text-red-600" },
  { label: "Collected Today", value: "₹24,500", color: "text-green-600" },
  { label: "Reminders Sent", value: "47", color: "text-blue-600" },
  { label: "Overdue 30+ days", value: "12 students", color: "text-amber-600" },
];

export default function FeeManagementPage() {
  const [activeTab, setActiveTab] = useState("Pending Fees");
  const { fees, transactions } = useFeeData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConcessionModal, setShowConcessionModal] = useState(false);

  // Tabs that don't show the standard filter bar
  const isFeeStructure = activeTab === "Fee Structure";
  const isTransportFees = activeTab === "Transport Fees";
  const isConcessions = activeTab === "Concessions";
  const hideFilterBar = isFeeStructure || isTransportFees || isConcessions;
  const hideStandardHeader = isFeeStructure || isTransportFees || isConcessions;

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const formattedMonth = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-0 bg-[#EFF4FF] min-h-screen">
      {/* Record Payment Modal */}
      {showPaymentModal && (
        <RecordFeePaymentModal onClose={() => setShowPaymentModal(false)} />
      )}

      {/* Add Concession Modal */}
      {showConcessionModal && (
        <AddFeeConcessionModal onClose={() => setShowConcessionModal(false)} />
      )}

      {/* Top Stats Bar — hidden on custom layout tabs */}
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
        {/* Card Header — hidden on custom layout tabs */}
        {!hideStandardHeader && (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-5 pt-5 pb-3 gap-4">
            <div>
              <h2 className={`${typography.heading.h6} font-medium text-gray-1000`}>
                Fee Management
              </h2>
              <p className={`${typography.body.xs} text-gray-500 mt-0.5`}>
                April 2025 — Academic Year 2024–25
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
              {/* Month Picker */}
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
              {/* Import Button */}
              <Button variant="outline" size="sm" className="text-xs h-8 text-[#3525CD] flex-1 sm:flex-none">
                Import Fee
              </Button>
              {/* Record Payment Button */}
              <Button
                size="sm"
                className={`${typography.body.xs} h-8 bg-[#3525CD] hover:bg-[#2a1fb5] text-white flex-1 sm:flex-none`}
                onClick={() => setShowPaymentModal(true)}
              >
                Record Payment
              </Button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="px-5 border-b border-gray-100 mt-2">
          <FeeTabs active={activeTab} setActive={setActiveTab} />
        </div>

        {/* Filter Bar — hidden on custom layout tabs */}
        {!hideFilterBar && (
          <div className="px-5 mt-4 mb-4">
            <FilterBar />
          </div>
        )}

        {/* Count row — Pending Fees only */}
        {activeTab === "Pending Fees" && (
          <div className="px-5 pb-3 text-xs text-gray-500">
            Showing{" "}
            <span className={`${typography.body.xs} text-gray-800`}>89 students</span>{" "}
            |{" "}
            <span className={`${typography.body.xs} font-bold`}>₹1,18,000</span>{" "}
            total pending
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "Pending Fees" && <PendingFeesTable data={fees} />}
        {activeTab === "All Transactions" && <AllTransactionsTable data={transactions} />}
        {activeTab === "Fee Structure" && <FeeStructure />}
        {activeTab === "Transport Fees" && <TransportFees />}
        {activeTab === "Concessions" && (
          <Concessions onAddConcession={() => setShowConcessionModal(true)} />
        )}

        {/* Footer Actions + Pagination — hidden on custom layout tabs */}
        {!hideStandardHeader && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              {activeTab === "Pending Fees" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 text-red-600 border-red-200 hover:bg-red-50"
                  >
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
                </>
              )}
            </div>
            <div className="flex gap-1 items-center">
              {["‹", "1", "2", "3", "›"].map((p) => (
                <button
                  key={p}
                  className={`w-7 h-7 text-xs rounded border flex items-center justify-center ${p === "1"
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