import { useState } from "react";
import { AlertCircle, RefreshCw, Plus, Bug } from "lucide-react";
import { useLeave } from "./hooks/useLeave";
import LeaveBalanceCards from "./components/LeaveBalanceCards";
import LeaveCalendar from "./components/LeaveCalendar";
import LeaveHistoryTable from "./components/LeaveHistoryTable";
import ApplyLeaveModal from "./components/ApplyLeaveModal";
import CancelLeaveModal from "./components/CancelLeaveModal";

const LeavePage = () => {
  const [showDebug, setShowDebug] = useState(false);
  const {
    balances,
    leaveHistory,
    loading,
    error,
    retry,
    applyModalOpen, openApplyModal, closeApplyModal,
    form, patchForm,
    totalDays, needsMedicalCert, formValid,
    submitting, submitSuccess, submitLeave,
    cancelId, confirmCancel, closeCancel, doCancel,
    calendarDays, calMonthLabel, prevMonth, nextMonth,
    previewDays, previewMonthLabel,
  } = useLeave();

  const pendingCount = leaveHistory.filter(l => l.status === "PENDING").length;

  return (
    <div className="flex flex-col gap-6 min-h-full">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Leave</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            AY 2025–26 · {pendingCount > 0 ? (
              <span className="text-amber-600 font-semibold">{pendingCount} pending approval</span>
            ) : (
              "No pending applications"
            )}
          </p>
        </div>
        <button
          onClick={openApplyModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold transition-colors shadow-sm self-start sm:self-auto"
        >
        <Plus size={15} className="text-current" strokeWidth={2.5} />
          Apply for Leave
        </button>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-sm font-semibold text-red-700">{error}</span>
          </div>
          <button
            onClick={retry}
            className="flex items-center gap-1.5 text-sm font-bold text-red-700 hover:text-red-900 transition-colors"
          >
            <RefreshCw size={14} className="text-current" strokeWidth={2} />
            Retry
          </button>
        </div>
      )}

      {/* ── Balance cards ── */}
      <LeaveBalanceCards balances={balances} loading={loading} error={error} onRetry={retry} />

      {/* ── Main grid: history table + calendar ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* History table — takes 2 cols */}
        <div className="xl:col-span-2">
          <LeaveHistoryTable
            applications={leaveHistory}
            loading={loading}
            onCancel={confirmCancel}
          />
        </div>

        {/* Calendar — 1 col */}
        <div>
          <LeaveCalendar
            days={calendarDays}
            monthLabel={calMonthLabel}
            onPrev={prevMonth}
            onNext={nextMonth}
          />
        </div>
      </div>

      {/* ── Apply Leave Modal ── */}
      <ApplyLeaveModal
        open={applyModalOpen}
        onClose={closeApplyModal}
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

      {/* ── Cancel confirmation modal ── */}
      <CancelLeaveModal
        open={!!cancelId}
        onClose={closeCancel}
        onConfirm={doCancel}
      />

      {/* ── Debug toggle ── */}
      <button
        onClick={() => setShowDebug(d => !d)}
        className="fixed bottom-4 right-4 z-50 w-9 h-9 rounded-full bg-gray-800 text-white flex items-center justify-center shadow-lg opacity-40 hover:opacity-100 transition-opacity"
        title="Toggle debug panel"
      >
        <Bug size={14} strokeWidth={2.5} />
      </button>

      {showDebug && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowDebug(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-auto p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-extrabold text-gray-900 mb-3">Debug: Raw API Data</h3>
            <div className="space-y-4 text-xs font-mono">
              <div>
                <p className="font-bold text-gray-500 mb-1">leaveHistory ({leaveHistory.length})</p>
                <pre className="bg-gray-50 rounded-xl p-3 overflow-auto max-h-[300px] text-gray-700">{JSON.stringify(leaveHistory, null, 2)}</pre>
              </div>
              <div>
                <p className="font-bold text-gray-500 mb-1">balances ({balances.length})</p>
                <pre className="bg-gray-50 rounded-xl p-3 overflow-auto max-h-[200px] text-gray-700">{JSON.stringify(balances, null, 2)}</pre>
              </div>
            </div>
            <button
              onClick={() => setShowDebug(false)}
              className="mt-4 w-full py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavePage;
