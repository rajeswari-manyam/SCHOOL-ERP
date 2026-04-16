import React from "react";
import { useFeeCollection } from "../hooks/Usefeecollection";
import { FeeStatCards } from "../components/Feestatcards";
import { PendingFeesFilterBar } from "../components/Pendingfeesfilterbar";
import { PendingFeesTable } from "../components/Pendingfeestable";
import { AllTransactionsTab } from "../components/Alltransactionstab";
import { FeeStructureTab } from "../components/Feestructuretab";
import { RecordPaymentModal } from "../components/Recordpaymentmodal";
import { PaymentSuccessModal } from "../components/Paymentsuccessmodal";
import { CommunicationCenter } from "../components/Communicationcenter";

const MONTHS = [
  "January 2025", "February 2025", "March 2025", "April 2025",
  "May 2025", "June 2025",
];

export function FeeCollectionPage() {
  const fee = useFeeCollection();

  const handlePrevMonth = () => {
    const idx = MONTHS.indexOf(fee.currentMonth);
    if (idx > 0) fee.setCurrentMonth(MONTHS[idx - 1]);
  };

  const handleNextMonth = () => {
    const idx = MONTHS.indexOf(fee.currentMonth);
    if (idx < MONTHS.length - 1) fee.setCurrentMonth(MONTHS[idx + 1]);
  };

  if (fee.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading fee data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Collection</h1>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-2">
              <button onClick={handlePrevMonth} className="text-gray-400 hover:text-gray-600 text-lg leading-none">‹</button>
              <span className="text-sm font-semibold text-gray-700">{fee.currentMonth}</span>
              <button onClick={handleNextMonth} className="text-gray-400 hover:text-gray-600 text-lg leading-none">›</button>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Collection Cycle Active
            </span>
          </div>
        </div>
        <button
          onClick={() => fee.openRecordPayment()}
          className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          💳 Record Payment
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {[
          { key: "pending", label: "Pending Fees", count: fee.stats?.pendingStudents },
          { key: "transactions", label: "All Transactions" },
          { key: "structure", label: "Fee Structure" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => fee.setActiveTab(tab.key as any)}
            className={`relative px-4 py-2 text-sm font-semibold transition-colors ${
              fee.activeTab === tab.key
                ? "text-indigo-600 border-b-2 border-indigo-600 -mb-px"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5">
                {tab.count} Due
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Pending Fees Tab */}
      {fee.activeTab === "pending" && (
        <div>
          {fee.stats && <FeeStatCards stats={fee.stats} />}

          <PendingFeesFilterBar
            searchQuery={fee.searchQuery}
            onSearchChange={fee.setSearchQuery}
            classFilter={fee.classFilter}
            onClassChange={fee.setClassFilter}
            sectionFilter={fee.sectionFilter}
            onSectionChange={fee.setSectionFilter}
            statusFilter={fee.statusFilter}
            onStatusChange={fee.setStatusFilter}
            feeHeadFilter={fee.feeHeadFilter}
            onFeeHeadChange={fee.setFeeHeadFilter}
            sortOption={fee.sortOption}
            onSortChange={fee.setSortOption}
          />

          <PendingFeesTable
            fees={fee.filteredFees}
            selectedIds={fee.selectedIds}
            onToggleSelect={fee.toggleSelect}
            onToggleSelectAll={fee.toggleSelectAll}
            onMarkPaid={(f) => fee.openRecordPayment(f)}
            onSendReminder={(f) => fee.sendReminders([f.studentId])}
            totalRecords={fee.stats?.pendingStudents || 0}
          />

          <CommunicationCenter
            onSendReminderToAll={() => fee.sendReminders(fee.filteredFees.map(f => f.studentId))}
            onSendReminderToDueToday={() => fee.sendReminders(
              fee.filteredFees.filter(f => f.isDueToday).map(f => f.studentId)
            )}
            onExportDefaultersPDF={() => alert("Export PDF triggered")}
            onExportCSV={() => alert("Export CSV triggered")}
          />
        </div>
      )}

      {/* All Transactions Tab */}
      {fee.activeTab === "transactions" && (
        <AllTransactionsTab
          transactions={fee.filteredTransactions}
          periodSummary={fee.periodSummary}
          txSearch={fee.txSearch}
          onTxSearchChange={fee.setTxSearch}
          txClassFilter={fee.txClassFilter}
          onTxClassChange={fee.setTxClassFilter}
          txModeFilter={fee.txModeFilter}
          onTxModeChange={fee.setTxModeFilter}
          txDateRange={fee.txDateRange}
        />
      )}

      {/* Fee Structure Tab */}
      {fee.activeTab === "structure" && (
        <FeeStructureTab
          feeHeads={fee.feeHeads}
          transportSlabs={fee.transportSlabs}
          classFeeStructure={fee.classFeeStructure}
          selectedClass={fee.selectedClass}
          onClassChange={fee.setSelectedClass}
        />
      )}

      {/* Record Payment Modal */}
      {fee.showRecordPayment && fee.recordPaymentStudent && (
        <RecordPaymentModal
          fee={fee.recordPaymentStudent}
          onClose={fee.closeRecordPayment}
          onSubmit={fee.submitPayment}
        />
      )}

      {/* Success Modal */}
      {fee.showSuccessModal && fee.lastReceipt && (
        <PaymentSuccessModal
          receipt={fee.lastReceipt}
          onRecordAnother={() => {
            fee.setShowSuccessModal(false);
            fee.openRecordPayment();
          }}
          onClose={() => fee.setShowSuccessModal(false)}
        />
      )}
    </div>
  );
}