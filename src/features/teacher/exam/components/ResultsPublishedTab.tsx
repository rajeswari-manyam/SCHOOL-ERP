import type { PublishedResult } from "../types/exam-marks.types";
import { GRADE_CONFIG } from "../hooks/useExamMarks";
import type { Grade } from "../types/exam-marks.types";

const RANK_MEDALS = ["🥇", "🥈", "🥉"];

interface Props {
  results: PublishedResult[];
  onDownload: () => void;
}

const ResultsPublishedTab = ({ results, onDownload }: Props) => {
  if (results.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
        <div className="text-4xl mb-3">📊</div>
        <p className="text-sm font-semibold text-gray-500">No published results yet</p>
      </div>
    );
  }

  const result = results[0]; // show first (latest)
  const maxAvg = Math.max(...result.subjectPerformance.map((s) => s.average));

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
        <div>
          <p className="text-base font-extrabold text-gray-900">{result.examLabel}</p>
          <p className="text-xs text-gray-400 mt-0.5">{result.className} · {result.academicYear} · Published {result.publishedOn}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Class Avg</p>
            <p className="text-lg font-extrabold text-indigo-600">{result.classAverage}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pass Rate</p>
            <p className="text-lg font-extrabold text-emerald-600">{result.overallPassRate}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Class performance bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Subject Performance</p>
          <div className="flex flex-col gap-4">
            {result.subjectPerformance.map((sp) => {
              const barWidth = maxAvg > 0 ? (sp.average / maxAvg) * 100 : 0;
              const passColor = sp.passRate >= 80 ? "text-emerald-600" : sp.passRate >= 60 ? "text-amber-600" : "text-red-500";
              return (
                <div key={sp.subject}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-gray-700">{sp.subject}</span>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-gray-400">Avg <span className="font-bold text-gray-700">{sp.average}</span></span>
                      <span className="text-gray-400">Pass <span className={`font-bold ${passColor}`}>{sp.passRate}%</span></span>
                      <span className="text-gray-400">↑ <span className="font-bold text-indigo-500">{sp.highest}</span></span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        sp.passRate >= 80 ? "bg-emerald-500" : sp.passRate >= 60 ? "bg-amber-400" : "bg-red-400"
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 3 students + Download */}
        <div className="flex flex-col gap-4">
          {/* Top 3 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Top Performers</p>
            <div className="flex flex-col gap-3">
              {result.topStudents.map((ts) => {
                const gradeCfg = GRADE_CONFIG[ts.grade as Grade];
                return (
                  <div key={ts.rank} className="flex items-center gap-3">
                    <span className="text-xl flex-shrink-0">{RANK_MEDALS[ts.rank - 1]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{ts.name}</p>
                      <p className="text-[11px] text-gray-400">#{ts.rollNo}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-extrabold text-gray-800">
                        {ts.marks}<span className="text-gray-400 font-normal text-[11px]">/{ts.maxMarks}</span>
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${gradeCfg.classes}`}>
                        {ts.grade}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Download Report */}
          <button
            onClick={onDownload}
            className="flex items-center gap-2 w-full justify-center h-11 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPublishedTab;
