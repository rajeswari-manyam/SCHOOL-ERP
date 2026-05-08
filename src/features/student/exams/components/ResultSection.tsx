// components/ResultsSection.tsx
import { ResultTable } from "./Resultstable";
import { Download, ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";
import type { ExamResult } from "../types/exams.types";

interface ResultsSectionProps {
  examResult: ExamResult;
}

export const ResultsSection = ({ examResult }: ResultsSectionProps) => {
  const { examName, totalMarks, obtainedMarks, percentage, grade, rank, status, results } = examResult;

  return (
   <div className="space-y-4 sm:space-y-6">
      {/* Header: Dropdown + Download Button */}
   <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div className="w-full sm:w-auto space-y-1">
  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
    Select Examination
  </p>

  <button className="w-full sm:w-auto flex items-center justify-between gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 hover:border-indigo-300 hover:shadow-sm transition-all active:scale-[0.99]">
    <span className="truncate">{examName}</span>
    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
  </button>
</div>
     <button className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all">
  <Download className="w-4 h-4" />
  Download Result PDF
</button>
      </div>

      {/* Overall Performance Card */}
     <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-8 text-center hover:border-indigo-300 hover:shadow-md transition-all duration-300">
        <p className="text-xs font-semaibold text-gray-500 uppercase tracking-wider mb-3">
          Overall Performance
        </p>
       <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4">
          {obtainedMarks} / {totalMarks}
        </h2>
      <div className="flex items-center justify-center gap-2 flex-wrap px-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
            {percentage}%
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
            {grade}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            status === 'pass' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {status === 'pass' ? (
              <CheckCircle2 className="w-3 h-3 mr-1" />
            ) : (
              <AlertCircle className="w-3 h-3 mr-1" />
            )}
            {status.toUpperCase()}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Rank {rank}
          </span>
        </div>
      </div>

      {/* Results Table */}
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-indigo-300 hover:shadow-sm transition-all duration-300">
        <ResultTable results={results} />
      </div>

      {/* Footer */}
    {/* Footer */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs bg-white rounded-xl border border-gray-200 p-3 transition-all">
  
  {/* Info */}
  <div className="flex items-center gap-1.5 text-gray-500">
    <AlertCircle className="w-3.5 h-3.5" />
    <span>
      Results published on 05 Feb 2025. This is a computer-generated report.
    </span>
  </div>

  {/* Action Cards */}
  <div className="flex flex-wrap gap-2 sm:gap-3">
    
    <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300 text-gray-700 hover:text-indigo-700 transition-all shadow-sm active:scale-[0.98]">
      <span className="font-medium">Raise a Dispute</span>
    </button>

    <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300 text-gray-700 hover:text-indigo-700 transition-all shadow-sm active:scale-[0.98]">
      <span className="font-medium">View Subject Analysis</span>
    </button>

  </div>

      </div>
    </div>
  );
};