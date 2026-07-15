import { Send } from "lucide-react";
import SubmittedMarksFilter from "@/features/teacher/exam/components/SubmittedMarksFilter";
import SubmittedMarksTab from "@/features/teacher/exam/components/SubmittedMarksTab";
import { useResults } from "./hooks/useResults";

const ResultsPage = () => {
  const {
    filter, setFilter,
    activeFilter,
    handleSearch,
    results,
    marksLoading, marksError, refetchMarks,
    enabled,
    handlePublish, publishingId, publishError,
  } = useResults();

  return (
    <div className="flex flex-col gap-4 min-h-full px-6 pt-2 pb-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h1 className="text-sm font-semibold text-gray-900">Results</h1>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Search submitted exam results and publish them to students & parents
          </p>
        </div>

        {publishError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-2 rounded-xl animate-pulse" role="alert">
            <Send size={14} className="text-current" strokeWidth={2.5} />
            {publishError}
          </div>
        )}
      </div>

      {/* Filter bar */}
      <SubmittedMarksFilter
        filter={filter}
        onChange={setFilter}
        onSearch={handleSearch}
        loading={marksLoading}
      />

      {/* Results table */}
      <SubmittedMarksTab
        exams={results}
        loading={marksLoading}
        error={enabled && marksError}
        onRetry={refetchMarks}
        hasSearched={Boolean(
          activeFilter.class_id && activeFilter.section_id && activeFilter.subject_id
        )}
        showPublish
        onPublish={handlePublish}
        publishingId={publishingId}
      />
    </div>
  );
};

export default ResultsPage;
