import { FeeStatCards } from "../fees/components/Feestatcards";
import { PendingFeesFilterBar } from "../fees/components/Pendingfeesfilterbar";
import { PendingFeesTable } from "../fees/components/Pendingfeestable";
import { RecordPaymentModal } from "../fees/components/Recordpaymentmodal";
import { PaymentSuccessModal } from "../fees/components/Paymentsuccessmodal";
import { AllTransactionsTab } from "../fees/components/Alltransactionstab";
import { FeeStructureTab } from "../fees/components/Feestructuretab";
import { CommunicationCenter } from "./components/Communicationcenter";

import { useFeeCollection } from "./hooks/Usefeecollection";
import { Button } from "@/components/ui/button";

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { key: "pending",      label: "Pending Fees",  icon: "⏳" },
  { key: "transactions", label: "Transactions",  icon: "💳" },
  { key: "structure",    label: "Fee Structure", icon: "🏗️" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ─── FeeCollectionPage ────────────────────────────────────────────────────────
const FeeCollectionPage = () => {
  const {
    activeTab, setActiveTab,
    stats,
    filteredFees, filteredTransactions,
    feeHeads, transportSlabs, classFeeStructure,
    loading,
    searchQuery, setSearchQuery,
    classFilter, setClassFilter,
    sectionFilter, setSectionFilter,
    statusFilter, setStatusFilter,
    feeHeadFilter, setFeeHeadFilter,
    sortOption, setSortOption,
    selectedIds, toggleSelect, toggleSelectAll,
    selectedClass, setSelectedClass,
    showRecordPayment, recordPaymentStudent,
    openRecordPayment, closeRecordPayment, submitPayment,
    lastReceipt, showSuccessModal, setShowSuccessModal,
    sendReminders,
  } = useFeeCollection();

  if (loading || !stats) {
    return (
      <div className="flex min-h-[200px] items-center justify-center p-6">
        <p className="text-sm text-gray-400 animate-pulse">
          Loading fee collection…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 sm:p-6">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Fee Collection
          </h1>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-slate-500">
            Manage pending dues, payments, and fee structure
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                 
                  <Button
                    onClick={() => openRecordPayment()}
                    className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 gap-1.5 text-sm px-3 sm:px-4 py-2 whitespace-nowrap"
                  >
                    <span className="text-base leading-none">+</span>
                    <span className="hidden sm:inline">Record Payment</span>
                    <span className="sm:hidden">Record Payment</span>
                  </Button>
                </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <FeeStatCards stats={stats} />

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      {/*
        On mobile: horizontally scrollable strip — tabs never wrap or overflow
        On desktop: normal inline row against the border
      */}
      <div className="relative">
        {/* Fade-right hint so users know it scrolls on mobile */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white dark:from-slate-950 to-transparent sm:hidden"
        />

        <div
          role="tablist"
          aria-label="Fee collection sections"
          className={[
            "flex gap-0 overflow-x-auto border-b border-gray-200 dark:border-slate-700",
            // hide scrollbar visually but keep it functional
            "scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
          ].join(" ")}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={active}
                aria-controls={`tabpanel-${tab.key}`}
                id={`tab-${tab.key}`}
                type="button"
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={[
                  // layout
                  "relative shrink-0 flex items-center gap-1.5 px-4 py-2.5",
                  "text-sm font-semibold whitespace-nowrap",
                  "transition-colors duration-150 outline-none",
                  // focus ring
                  "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500",
                  // active state
                  active
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200",
                ].join(" ")}
              >
                {/* Icon — hidden on very small screens to save space */}
                <span aria-hidden="true" className="hidden min-[360px]:inline">
                  {tab.icon}
                </span>
                {tab.label}

                {/* Active underline */}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-0.5 w-full rounded-t-full bg-indigo-600 dark:bg-indigo-400"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab panels ───────────────────────────────────────────────────── */}

      {/* 1️⃣ Pending Fees */}
      <div
        role="tabpanel"
        id="tabpanel-pending"
        aria-labelledby="tab-pending"
        hidden={activeTab !== "pending"}
        className="space-y-4"
      >
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
      </div>

      {/* 2️⃣ Transactions */}
      <div
        role="tabpanel"
        id="tabpanel-transactions"
        aria-labelledby="tab-transactions"
        hidden={activeTab !== "transactions"}
      >
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
      </div>

      {/* 3️⃣ Fee Structure */}
      <div
        role="tabpanel"
        id="tabpanel-structure"
        aria-labelledby="tab-structure"
        hidden={activeTab !== "structure"}
      >
        <FeeStructureTab
          feeHeads={feeHeads}
          transportSlabs={transportSlabs}
          classFeeStructure={classFeeStructure}
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
        />
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      {showRecordPayment && (
        <RecordPaymentModal
          fee={recordPaymentStudent}
          pendingFees={filteredFees}
          onClose={closeRecordPayment}
          onSubmit={submitPayment}
        />
      )}

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