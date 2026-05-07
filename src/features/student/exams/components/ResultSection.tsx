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
    <div className="space-y-6">
      {/* Header: Dropdown + Download Button */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1.5 block">
            Select Examination
          </label>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">
            {examName}
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          <Download className="w-4 h-4" />
          Download Result PDF
        </button>
      </div>

      {/* Overall Performance Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Overall Performance
        </p>
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">
          {obtainedMarks} / {totalMarks}
        </h2>
        <div className="flex items-center justify-center gap-2 flex-wrap">
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
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <ResultTable results={results} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-gray-500">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Results published on 05 Feb 2025. This is a computer-generated report.</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-indigo-600 hover:text-indigo-700 font-medium">
            Raise a Dispute
          </button>
          <button className="text-indigo-600 hover:text-indigo-700 font-medium">
            View Subject Analysis
          </button>
        </div>
      </div>
    </div>
  );
};