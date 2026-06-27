import { Download, TrendingUp } from "lucide-react";
import type { AnnualSummary } from "../types/payslip.types";

const inr = (n: number | undefined | null) => "₹" + (n ?? 0).toLocaleString("en-IN");

interface Props {
  summary: AnnualSummary | null;
  onDownload: () => void;
}

const AnnualSummaryCard = ({ summary, onDownload }: Props) => {
  if (!summary) return null;

  const stats = [
    { label: "Total Earned",     value: inr(summary.totalEarned),    bg: "bg-gray-50",    text: "text-gray-900", sub: "text-gray-400"   },
    { label: "Total Deductions", value: inr(summary.totalDeductions), bg: "bg-rose-50",   text: "text-rose-700", sub: "text-rose-400"   },
    { label: "Net Received",     value: inr(summary.totalNet),        bg: "bg-indigo-50", text: "text-indigo-700", sub: "text-indigo-400" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Annual Summary</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            FY {summary.year}–{String(summary.year + 1).slice(-2)}
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
          <TrendingUp size={16} className="text-indigo-600" strokeWidth={2} />
        </div>
      </div>

      <div className="px-5 sm:px-6 py-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(({ label, value, bg, text, sub }) => (
            <div key={label} className={`${bg} rounded-xl p-4`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${sub} mb-1`}>{label}</p>
              <p className={`text-lg font-extrabold ${text} tabular-nums`}>{value}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onDownload}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border-2 border-indigo-600 text-indigo-600 text-sm font-bold hover:bg-indigo-600 hover:text-white active:scale-[0.98] transition-all duration-200"
        >
          <Download size={15} strokeWidth={2} />
          Download Annual Statement
        </button>
      </div>
    </div>
  );
};

export default AnnualSummaryCard;
