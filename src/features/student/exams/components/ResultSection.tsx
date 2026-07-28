// components/ResultsSection.tsx
import { ResultTable } from "./Resultstable";
import { Download, ChevronDown, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import type { ExamResult } from "../types/exams.types";
import type { ExamRecord } from "../../../../services/exam.api";
import { triggerMarksDownload } from "../../../../services/marks.api";

interface ResultsSectionProps {
  studentId: string;
  examResult: ExamResult | null;
  resultsLoading: boolean;
  resultsError: string | null;
  onRetry: () => void;
  examList: ExamRecord[];
  examListLoading: boolean;
  selectedResultExamId: string;
  onSelectExam: (id: string) => void;
}

export const ResultsSection = ({
  studentId,
  examResult,
  resultsLoading,
  resultsError,
  onRetry,
  examList,
  examListLoading,
  selectedResultExamId,
  onSelectExam,
}: ResultsSectionProps) => {
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!studentId || !selectedResultExamId) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      await triggerMarksDownload(studentId, selectedResultExamId);
    } catch (err) {
      console.error(err);
      setDownloadError("Failed to download result PDF.");
    } finally {
      setDownloading(false);
    }
  };

  const selectedExamName =
    examList.find((e) => e.id === selectedResultExamId)?.exam_name ??
    examResult?.examName ??
    "Exam";

  return (
    <div className="space-y-3">

      {/* Header: Dropdown + Download */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">
            Select Examination
          </p>

          {/* Exam dropdown */}
          <div className="relative">
            <button
              onClick={() => setExamDropdownOpen((o) => !o)}
              disabled={examListLoading}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-800 transition-all min-w-[140px]"
            >
              <span className="truncate">
                {examListLoading ? "Loading…" : selectedExamName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </button>

            {examDropdownOpen && examList.length > 0 && (
              <div className="absolute left-0 z-20 mt-1 w-52 rounded-lg border border-gray-200 bg-white shadow-lg">
                {examList.map((exam) => (
                  <button
                    key={exam.id}
                    onClick={() => {
                      onSelectExam(exam.id);
                      setExamDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm transition first:rounded-t-lg last:rounded-b-lg ${
                      selectedResultExamId === exam.id
                        ? "text-indigo-600 font-medium bg-indigo-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {exam.exam_name}
                  </button>
                ))}
              </div>
            )}

            {examDropdownOpen && examList.length === 0 && !examListLoading && (
              <div className="absolute left-0 z-20 mt-1 w-52 rounded-lg border border-gray-200 bg-white shadow-lg px-3 py-2 text-sm text-gray-400">
                No exams found
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <button
            onClick={handleDownload}
            disabled={downloading || !examResult || !selectedResultExamId}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            {downloading ? "Downloading…" : "Download Result PDF"}
          </button>
          {downloadError && (
            <p className="text-[11px] text-red-500">{downloadError}</p>
          )}
        </div>
      </div>

      {/* Loading state */}
      {resultsLoading && (
        <div className="flex items-center justify-center py-12 text-sm text-gray-400">
          <svg className="animate-spin h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Loading results…
        </div>
      )}

      {/* Error state */}
      {!resultsLoading && resultsError && (
        <div className="flex flex-col items-center gap-3 py-12 text-sm text-red-500">
          <AlertCircle className="h-8 w-8 text-red-300" />
          <p>{resultsError}</p>
          <button
            onClick={onRetry}
            className="rounded-lg border border-red-200 px-4 py-1.5 text-xs text-red-500 transition hover:bg-red-50"
          >
            Retry
          </button>
        </div>
      )}

      {/* No result state */}
      {!resultsLoading && !resultsError && !examResult && (
        <div className="flex flex-col items-center gap-2 py-12 text-sm text-gray-400">
          <AlertCircle className="h-8 w-8 text-gray-300" />
          <p>No results found for this exam.</p>
        </div>
      )}

      {/* Overall Performance */}
      {!resultsLoading && !resultsError && examResult && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 py-4 px-3 sm:px-4 text-center max-w-md mx-auto w-full">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
              Overall Performance
            </p>
            <h2 className="text-2xl font-bold text-indigo-700 mb-2">
              {examResult.obtainedMarks} / {examResult.totalMarks}
            </h2>
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                {examResult.percentage}%
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                {examResult.grade}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  examResult.status === "pass"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {examResult.status === "pass" ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                {examResult.status.toUpperCase()}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                Rank {examResult.rank}
              </span>
            </div>
          </div>

          {/* Results Table */}
          <div className="max-w-5xl mx-auto w-full">
            <ResultTable results={examResult.results} />
          </div>
        </>
      )}
    </div>
  );
};
