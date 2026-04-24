import {FeeStatCards}from "../fees/components/Feestatcards";
import {PendingFeesFilterBar} from "../fees/components/Pendingfeesfilterbar";
import {PendingFeesTable} from "../fees/components/Pendingfeestable";
import {RecordPaymentModal} from "../fees/components/Recordpaymentmodal";
import {PaymentSuccessModal} from "../fees/components/Paymentsuccessmodal";
import {AllTransactionsTab} from "../fees/components/Alltransactionstab";
import {FeeStructureTab} from "../fees/components/Feestructuretab";
import {CommunicationCenter} from "./components/Communicationcenter";
import { Button } from "@/components/ui/button";

import { useFeeCollection } from "./hooks/Usefeecollection";

const FeeCollectionPage = () => {
  const {
    // Tab
    activeTab,
    setActiveTab,

    // Data
    stats,
    filteredFees,
    filteredTransactions,
    feeHeads,
    transportSlabs,
    classFeeStructure,
    loading,

    // Filters
    searchQuery,
    setSearchQuery,
    classFilter,
    setClassFilter,
    sectionFilter,
    setSectionFilter,
    statusFilter,
    setStatusFilter,
    feeHeadFilter,
    setFeeHeadFilter,
    sortOption,
    setSortOption,

    // Selection
    selectedIds,
    toggleSelect,
    toggleSelectAll,

    // Structure
    selectedClass,
    setSelectedClass,

    // Modals
    showRecordPayment,
    recordPaymentStudent,
    openRecordPayment,
    closeRecordPayment,
    submitPayment,
    lastReceipt,
    showSuccessModal,
    setShowSuccessModal,

    // Actions
    sendReminders,
  } = useFeeCollection();

  if (loading || !stats) {
    return (
      <div className="p-6 text-sm text-gray-500">Loading fee collection...</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* ─── Header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">
            Fee Collection
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage pending dues, payments, and fee structure
          </p>
        </div>
      </div>

      {/* ─── Stats ───────────────────────────────────────── */}
      <FeeStatCards stats={stats} />

      {/* ─── Tabs ───────────────────────────────────────── */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { key: "pending", label: "Pending Fees" },
          { key: "transactions", label: "Transactions" },
          { key: "structure", label: "Fee Structure" },
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "ghost"}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition ${
              activeTab === tab.key
                ? "border-b-0 border-gray-200 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* ─── TAB CONTENT ───────────────────────────────────────── */}

      {/* 1️⃣ Pending Fees */}
      {activeTab === "pending" && (
        <>
          <PendingFeesFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            classFilter={classFilter}
            onClassChange={setClassFilter}
            sectionFilter={sectionFilter}
            onSectionChange={setSectionFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            feeHeadFilter={feeHeadFilter}
            onFeeHeadChange={setFeeHeadFilter}
            sortOption={sortOption}
            onSortChange={setSortOption}
          />

          <PendingFeesTable
            fees={filteredFees}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            onMarkPaid={openRecordPayment}
            onSendReminder={() => {}}
            totalRecords={filteredFees.length}
          />

          <CommunicationCenter
            onSendReminderToAll={() => sendReminders()}
            onSendReminderToDueToday={() => {}}
            onExportDefaultersPDF={() => {}}
            onExportCSV={() => {}}
          />
        </>
      )}

      {/* 2️⃣ Transactions */}
      {activeTab === "transactions" && (
        <AllTransactionsTab
          transactions={filteredTransactions}
          periodSummary={null}
          txSearch=""
          onTxSearchChange={() => {}}
          txClassFilter="All Classes"
          onTxClassChange={() => {}}
          txModeFilter="All Modes (Cash, UPI, Cheque, Bank)"
          onTxModeChange={() => {}}
          txDateRange=""
        />
      )}

      {/* 3️⃣ Fee Structure */}
      {activeTab === "structure" && (
        <FeeStructureTab
          feeHeads={feeHeads}
          transportSlabs={transportSlabs}
          classFeeStructure={classFeeStructure}
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
        />
      )}

      {/* ─── MODALS ───────────────────────────────────────── */}

      {/* Record Payment */}
      {showRecordPayment && recordPaymentStudent && (
        <RecordPaymentModal
          fee={recordPaymentStudent}
          onClose={closeRecordPayment}
          onSubmit={submitPayment}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && lastReceipt && (
        <PaymentSuccessModal
          receipt={lastReceipt}
          onRecordAnother={() => setShowSuccessModal(false)}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default FeeCollectionPage;