import { useState } from "react";
import { AlertCircle, RefreshCw, Plus } from "lucide-react";
import { useLeave } from "./hooks/useLeave";
import LeaveBalanceCards from "./components/LeaveBalanceCards";
import LeaveCalendar from "./components/LeaveCalendar";
import LeaveHistoryTable from "./components/LeaveHistoryTable";
import ApplyLeaveModal from "./components/ApplyLeaveModal";
import CancelLeaveModal from "./components/CancelLeaveModal";

const LeavePage = () => {
  const {
    balances, leaveHistory, loading, error, retry,
    applyModalOpen, openApplyModal, closeApplyModal,
    form, patchForm,
    totalDays, needsMedicalCert, formValid,
    submitting, submitSuccess, submitLeave,
    cancelId, confirmCancel, closeCancel, doCancel,
    calendarDays, calMonthLabel, prevMonth, nextMonth,
    previewDays, previewMonthLabel,
  } = useLeave();

  const pendingCount = leaveHistory.filter((l) => l.status === "PENDING").length;

  return (
    <div className="flex flex-col gap-6 min-h-full p-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Leave</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            AY 2025–26 ·{" "}
            {pendingCount > 0 ? (
              <span className="text-amber-600 font-medium">{pendingCount} pending approval</span>
            ) : (
              "No pending applications"
            )}
          </p>
        </div>
        <button
          onClick={openApplyModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors self-start sm:self-auto"
        >
          <Plus size={15} strokeWidth={2.5} />
          Apply for Leave
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-sm font-medium text-red-700">{error}</span>
          </div>
          <button
            onClick={retry}
            className="flex items-center gap-1.5 text-sm font-medium text-red-700 hover:text-red-900 transition-colors"
          >
            <RefreshCw size={14} strokeWidth={2} />
            Retry
          </button>
        </div>
      )}

      {/* Balance cards */}
      <LeaveBalanceCards balances={balances} loading={loading} error={error} onRetry={retry} />

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <LeaveHistoryTable applications={leaveHistory} loading={loading} onCancel={confirmCancel} />
        </div>
        <div className="xl:col-span-1">
          <LeaveCalendar days={calendarDays} monthLabel={calMonthLabel} onPrev={prevMonth} onNext={nextMonth} />
        </div>
      </div>

      <ApplyLeaveModal
        open={applyModalOpen}
        onClose={closeApplyModal}
        balances={balances}
        form={form}
        patchForm={patchForm}
        totalDays={totalDays}
        needsMedicalCert={needsMedicalCert}
        formValid={formValid}
        submitting={submitting}
        submitSuccess={submitSuccess}
        onSubmit={submitLeave}
        previewDays={previewDays}
        previewMonthLabel={previewMonthLabel}
      />
      <CancelLeaveModal open={!!cancelId} onClose={closeCancel} onConfirm={doCancel} />
    </div>
  );
};

export default LeavePage;
