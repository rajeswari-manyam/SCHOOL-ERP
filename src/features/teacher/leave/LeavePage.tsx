import { useLeave } from "./hooks/useLeave";
import { Plus } from "lucide-react";
import LeaveBalanceCards from "./components/LeaveBalanceCards";
import LeaveCalendar from "./components/LeaveCalendar";
import LeaveHistoryTable from "./components/LeaveHistoryTable";
import ApplyLeaveModal from "./components/ApplyLeaveModal";
import CancelLeaveModal from "./components/CancelLeaveModal";





const LeavePage = () => {
  const {
    balances,
    leaveHistory,
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

      {/* ── Balance cards ── */}
      <LeaveBalanceCards balances={balances} />

      {/* ── Main grid: history table + calendar ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* History table — takes 2 cols */}
        <div className="xl:col-span-2">
          <LeaveHistoryTable
            applications={leaveHistory}
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
    </div>
  );
};

export default LeavePage;
