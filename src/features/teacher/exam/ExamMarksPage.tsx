import { useExamMarks } from "./hooks/useExamMarks";
import ExamSelectorForm from "./components/ExamSelectorForm";
import MarksEntryTable from "./components/MarksEntryTable";
import SummaryBar from "./components/SummaryBar";
import SubmitMarksModal from "./components/SubmitMarksModal";
import SubmittedMarksTab from "./components/SubmittedMarksTab";
import ResultsPublishedTab from "./components/ResultsPublishedTab";
import type { ExamTab } from "./hooks/useExamMarks";

const TABS: { key: ExamTab; label: string }[] = [
  { key: "enter",     label: "Enter Marks" },
  { key: "submitted", label: "Submitted Marks" },
  { key: "published", label: "Results Published" },
];

const ExamMarksPage = () => {
  const {
    activeTab, setActiveTab,
    selector, setSelector,
    entries, studentsLoaded,
    handleLoadStudents, updateEntry,
    summary, selectorLabel,
    showSubmitModal, setShowSubmitModal,
    confirmChecked, setConfirmChecked,
    draftMsg, submitMsg, dlMsg,
    handleSaveDraft, handleOpenSubmit, handleConfirmSubmit,
    handleDownloadReport,
    submittedExams, publishedResults,
  } = useExamMarks();

  return (
    <div className="flex flex-col gap-0 min-h-full">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Exam &amp; Marks</h1>
          <p className="text-sm text-gray-400 mt-0.5">Class 8-A · Mathematics · Academic Year 2024-25</p>
        </div>

        {/* Toasts */}
        <div className="flex flex-col gap-2">
          {draftMsg && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-4 py-2 rounded-xl animate-pulse">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Draft saved!
            </div>
          )}
          {submitMsg && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-xl animate-pulse">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Marks submitted for review!
            </div>
          )}
          {dlMsg && (
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-4 py-2 rounded-xl animate-pulse">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Report downloading!
            </div>
          )}
        </div>
      </div>

      {/* 3-Tab navigation */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === t.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
            {t.key === "submitted" && submittedExams.length > 0 && (
              <span className="ml-1.5 bg-amber-100 text-amber-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {submittedExams.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab: Enter Marks ─────────────────────────────────────────── */}
      {activeTab === "enter" && (
        <div className="flex flex-col gap-5">
          {/* Exam selector */}
          <ExamSelectorForm
            selector={selector}
            onChange={setSelector}
            onLoad={handleLoadStudents}
            studentsLoaded={studentsLoaded}
          />

          {/* Summary bar */}
          <SummaryBar summary={summary} visible={studentsLoaded && entries.length > 0} />

          {/* Marks entry table */}
          <MarksEntryTable entries={entries} onUpdate={updateEntry} />

          {/* Action bar */}
          {studentsLoaded && entries.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-2 h-10 px-5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                Save Draft
              </button>

              <button
                onClick={handleOpenSubmit}
                className="flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Submit for Review
              </button>

              <button
                onClick={() => setActiveTab("submitted")}
                className="flex items-center gap-2 h-10 px-5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors ml-auto"
              >
                View Results
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Submitted Marks ──────────────────────────────────────── */}
      {activeTab === "submitted" && (
        <SubmittedMarksTab exams={submittedExams} />
      )}

      {/* ── Tab: Results Published ────────────────────────────────────── */}
      {activeTab === "published" && (
        <ResultsPublishedTab results={publishedResults} onDownload={handleDownloadReport} />
      )}

      {/* Submit Modal */}
      <SubmitMarksModal
        open={showSubmitModal}
        selectorLabel={selectorLabel}
        summary={summary}
        confirmChecked={confirmChecked}
        onConfirmChange={setConfirmChecked}
        onSubmit={handleConfirmSubmit}
        onClose={() => setShowSubmitModal(false)}
      />
    </div>
  );
};

export default ExamMarksPage;
