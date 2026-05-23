import type { ExamSummary } from "../types/exam-marks.types";

interface Props {
  summary: ExamSummary;
  visible: boolean;
}

const SummaryBar = ({ summary, visible }: Props) => {
  if (!visible) return null;

  const stats = [
    { label: "Total",     value: summary.total,                     color: "text-gray-800" },
    { label: "Appeared",  value: summary.appeared,                   color: "text-emerald-600" },
    { label: "Absent",    value: summary.absent,                     color: "text-red-500" },
    { label: "Highest",   value: summary.appeared ? summary.highest : "—", color: "text-indigo-600" },
    { label: "Lowest",    value: summary.appeared ? summary.lowest  : "—", color: "text-amber-600" },
    { label: "Average",   value: summary.appeared ? summary.average : "—", color: "text-blue-600" },
    { label: "Pass Rate", value: summary.appeared ? `${summary.passRate}%` : "—", color: "text-emerald-600" },
    { label: "Failed",    value: summary.appeared ? summary.failCount : "—", color: "text-red-500" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Class Summary</p>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="text-center">
            <p className={`text-lg font-extrabold ${color}`}>{value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Pass rate visual bar */}
      {summary.appeared > 0 && (
        <div className="mt-3">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                summary.passRate >= 75 ? "bg-emerald-500" : summary.passRate >= 50 ? "bg-amber-400" : "bg-red-400"
              }`}
              style={{ width: `${summary.passRate}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryBar;
