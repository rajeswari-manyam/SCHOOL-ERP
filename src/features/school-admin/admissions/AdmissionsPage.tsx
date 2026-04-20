import { useState } from "react";
import { useAdmissions } from "../admissions/hooks/useAdmissions";

// UI Components
import AdmissionKanbanBoard from "../admissions/components/Admissionkanbanboard";
import AdmissionStatCards from "../admissions/components/Admissionstatcards";
import AddEnquiryModal from "../admissions/components/Addenquirymodal";
import ScheduleInterviewModal from "../admissions/components/Scheduleinterviewmodal";
import ConfirmAdmissionModal from "../admissions/components/Confirmadmissionmodal";
import DeclineEnquiryModal from "../admissions/components/Declineenquirymodal";

const AdmissionsPage = () => {
  const {
    byStage,
    stats,
    loading,
    selected,
    selectedId,
    setSelectedId,
    addEnquiry,
    moveToInterview,
    moveToDocs,
    confirmAdmission,
    declineAdmission,
  } = useAdmissions();

  // ─── Modal states ─────────────────────────────────────────────────────────
  const [showAdd, setShowAdd] = useState(false);
  const [showInterview, setShowInterview] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDecline, setShowDecline] = useState(false);

  if (loading) {
    return (
      <div className="p-6 text-gray-500 text-sm">Loading admissions...</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold text-gray-900">
            Admissions Pipeline
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage enquiries → interviews → confirmations
          </p>
        </div>
<button
  onClick={() => setShowAdd(true)}
  className="w-fit rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
>
  + New Enquiry
</button>
      </div>

      {/* ─── Stats ────────────────────────────────────────────────────────── */}
      <AdmissionStatCards stats={stats} />

      {/* ─── Board ────────────────────────────────────────────────────────── */}
      <AdmissionKanbanBoard
        byStage={byStage}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      {/* ─── Action Panel (Right Side Logic Simplified) ───────────────────── */}
      {selected && (
        <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-72 space-y-3">
          <p className="text-sm font-bold text-gray-800">
            {selected.studentName}
          </p>

          <p className="text-xs text-gray-500">
            Stage: {selected.stage}
          </p>

          {/* Actions based on stage */}
          {selected.stage === "ENQUIRY" && (
            <button
              onClick={() => setShowInterview(true)}
              className="w-full px-4 py-2 bg-amber-500 text-white text-sm rounded-xl hover:bg-amber-600"
            >
              Schedule Interview
            </button>
          )}

          {selected.stage === "INTERVIEW" && (
            <button
              onClick={() => moveToDocs(selected.id)}
              className="w-full px-4 py-2 bg-violet-500 text-white text-sm rounded-xl hover:bg-violet-600"
            >
              Mark Docs Verified
            </button>
          )}

          {selected.stage === "DOCS_VERIFIED" && (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full px-4 py-2 bg-emerald-600 text-white text-sm rounded-xl hover:bg-emerald-700"
            >
              Confirm Admission
            </button>
          )}

          {/* Decline always available except confirmed */}
          {selected.stage !== "CONFIRMED" && selected.stage !== "DECLINED" && (
            <button
              onClick={() => setShowDecline(true)}
              className="w-full px-4 py-2 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600"
            >
              Decline
            </button>
          )}
        </div>
      )}

      {/* ─── Modals ───────────────────────────────────────────────────────── */}

      {/* Add Enquiry */}
      {showAdd && (
        <AddEnquiryModal
          onClose={() => setShowAdd(false)}
          onSubmit={async (data) => {
            await addEnquiry(data);
          }}
        />
      )}

      {/* Schedule Interview */}
      {showInterview && selected && (
        <ScheduleInterviewModal
          studentName={selected.studentName}
          onClose={() => setShowInterview(false)}
          onConfirm={async (date, time) => {
            await moveToInterview(selected.id, date, time);
            setShowInterview(false);
          }}
        />
      )}

      {/* Confirm Admission */}
      {showConfirm && selected && (
        <ConfirmAdmissionModal
          admission={selected}
          onClose={() => setShowConfirm(false)}
          onConfirm={async (data) => {
            await confirmAdmission(selected.id, data);
            setShowConfirm(false);
          }}
        />
      )}

      {/* Decline */}
      {showDecline && selected && (
        <DeclineEnquiryModal
          studentName={selected.studentName}
          onClose={() => setShowDecline(false)}
          onConfirm={async (reason) => {
            await declineAdmission(selected.id, reason);
            setShowDecline(false);
          }}
        />
      )}
    </div>
  );
};

export default AdmissionsPage;