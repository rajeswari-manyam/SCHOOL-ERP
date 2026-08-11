import { Check, ChevronRight, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExamMarks } from "./hooks/useExamMarks";
import ExamSelectorForm from "./components/ExamSelectorForm";
import MarksEntryTable from "./components/MarksEntryTable";
import SummaryBar from "./components/SummaryBar";
import SubmitMarksModal from "./components/SubmitMarksModal";
import SubmittedMarksTab from "./components/SubmittedMarksTab";
import SubmittedMarksFilter from "./components/SubmittedMarksFilter";
import type { ExamTab } from "./hooks/useExamMarks";

const TABS: { key: ExamTab; label: string }[] = [
  { key: "enter",     label: "Enter Marks" },
  { key: "submitted", label: "Submitted Marks" },
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
    draftMsg, submitMsg,
    handleSaveDraft, handleOpenSubmit, handleConfirmSubmit,
    submittedExams,
    studentsError,
    marksLoading, marksError, refetchMarks,
    submitting, submitError,
    // filter
    submittedFilter, setSubmittedFilter,
    activeFilter,
    handleFilterSearch,
    marksEnabled,
  } = useExamMarks();

  return (
    <div className="flex flex-col gap-4 min-h-full px-3 sm:px-6 pt-2 pb-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h1 className="text-sm font-semibold text-gray-900">Exam & Marks</h1>
          <p className="text-[11px] text-gray-500 mt-0.5">Class 8-A · Mathematics · Academic Year 2024-25</p>
        </div>

        {/* Toasts */}
        <div className="flex flex-col gap-2">
          {draftMsg && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-4 py-2 rounded-xl animate-pulse">
              <Check size={14} className="text-current" strokeWidth={2.5} />
              Draft saved!
            </div>
          )}
          {submitMsg && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-xl animate-pulse">
              <Check size={14} className="text-current" strokeWidth={2.5} />
              Marks submitted for review!
            </div>
          )}
          {submitError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-2 rounded-xl animate-pulse" role="alert">
              <Send size={14} className="text-current" strokeWidth={2.5} />
              {submitError}
            </div>
          )}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-0.5 border-b border-gray-200 mb-3 overflow-x-auto flex-nowrap">
        {TABS.map((t) => (
          <Button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            variant={activeTab === t.key ? "default" : "outline"}
            size="sm"
            className={`px-3 py-1.5 text-[11px] font-semibold transition-all border-b-2 -mb-px ${
              activeTab === t.key
                ? "text-gray-900 border-indigo-600"
                : "text-gray-400 border-transparent hover:text-gray-700"
            }`}
          >
            {t.label}
            {t.key === "submitted" && submittedExams.length > 0 && (
              <span className="ml-1.5 bg-amber-100 text-amber-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {submittedExams.length}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* ── Tab: Enter Marks ─────────────────────────────────────────── */}
      {activeTab === "enter" && (
        <div className="flex flex-col gap-5">
          <ExamSelectorForm
            selector={selector}
            onChange={setSelector}
            onLoad={handleLoadStudents}
            studentsLoaded={studentsLoaded}
            apiError={!!studentsError}
            errorMessage={studentsError}
          />

          <SummaryBar summary={summary} visible={studentsLoaded && entries.length > 0} />

          <MarksEntryTable entries={entries} onUpdate={updateEntry} />

          {studentsLoaded && entries.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                onClick={handleSaveDraft}
                variant="outline"
                size="md"
                className="flex items-center justify-center gap-2 px-5 rounded-xl text-sm font-semibold w-full sm:w-auto"
              >
                <Save size={14} className="text-current" />
                Save Draft
              </Button>

              <Button
                type="button"
                onClick={handleOpenSubmit}
                variant="default"
                size="md"
                disabled={submitting}
                className="flex items-center justify-center gap-2 px-5 rounded-xl text-sm font-semibold disabled:opacity-50 w-full sm:w-auto"
              >
                <Send size={14} className="text-current" />
                {submitting ? "Submitting..." : "Submit for Review"}
              </Button>

              <Button
                type="button"
                onClick={() => setActiveTab("submitted")}
                variant="outline"
                size="md"
                className="flex items-center justify-center gap-2 px-5 rounded-xl text-sm font-semibold w-full sm:w-auto sm:ml-auto"
              >
                View Results
                <ChevronRight size={14} className="text-current" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Submitted Marks ──────────────────────────────────────── */}
      {activeTab === "submitted" && (
        <div className="flex flex-col gap-0">
          {/* Filter bar */}
          <SubmittedMarksFilter
            filter={submittedFilter}
            onChange={setSubmittedFilter}
            onSearch={handleFilterSearch}
            loading={marksLoading}
          />

          {/* Results table */}
          <SubmittedMarksTab
            exams={submittedExams}
            loading={marksLoading}
            error={marksEnabled && marksError}
            onRetry={refetchMarks}
            // Pass whether a search has been triggered (to show idle state vs error)
            hasSearched={Boolean(
              activeFilter.class_id && activeFilter.section_id && activeFilter.subject_id
            )}
            classId={activeFilter.class_id}
            sectionId={activeFilter.section_id}
            subjectId={activeFilter.subject_id}
            academicYearId={activeFilter.academicYearId}
          />
        </div>
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
