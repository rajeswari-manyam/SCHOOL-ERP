import type { ExamResult } from "../types/Student dashboard.types";
import { RESULT_STATUS_STYLES } from "../utils/Student dashboard.utils";

interface RecentResultsProps {
  results: ExamResult[];
  onViewDetailedReport?: (result: ExamResult) => void;
}

const RecentResults = ({ results, onViewDetailedReport }: RecentResultsProps) => {
  const latest = results[0];

  if (!latest) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Results</h2>
        <p className="text-sm text-gray-400 text-center py-6">No results yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
      <h2 className="text-lg font-bold text-gray-900">Recent Results</h2>

      {/* Latest exam highlight */}
      <div className="flex flex-col items-center gap-3 py-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {latest.examName} • {latest.month.toUpperCase()} {latest.year}
        </span>

        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-extrabold text-gray-900">
            {latest.marksObtained}
          </span>
          <span className="text-xl text-gray-400 font-semibold">
            /{latest.totalMarks}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              RESULT_STATUS_STYLES[latest.status]
            }`}
          >
            {latest.status}
          </span>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Rank {latest.rank}
          </span>
        </div>
      </div>

      {/* View report button */}
      {latest.reportUrl && (
        <button
          onClick={() => onViewDetailedReport?.(latest)}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-indigo-200 hover:text-indigo-600 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          View Detailed Report
        </button>
      )}
    </div>
  );
};

export default RecentResults;