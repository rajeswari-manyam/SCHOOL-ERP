import { MOCK_ANNUAL_SUMMARY } from "../hooks/usePayslip";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

interface Props {
  onDownload: () => void;
}

const AnnualSummaryCard = ({ onDownload }: Props) => {
  const s = MOCK_ANNUAL_SUMMARY;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">Annual Summary</p>
          <p className="text-base font-extrabold text-gray-900">FY {s.year}–{String(s.year + 1).slice(-2)}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
      </div>

      {/* Three stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Earned</p>
          <p className="text-base font-extrabold text-gray-900">{inr(s.totalEarned)}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1">Deductions</p>
          <p className="text-base font-extrabold text-red-600">{inr(s.totalDeductions)}</p>
        </div>
        <div className="bg-indigo-50 rounded-xl p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1">Total Net</p>
          <p className="text-base font-extrabold text-indigo-700">{inr(s.totalNet)}</p>
        </div>
      </div>

      {/* Download Annual Statement */}
      <button
        onClick={onDownload}
        className="flex items-center gap-2 w-full justify-center h-10 rounded-xl border-2 border-indigo-600 text-indigo-600 text-sm font-semibold hover:bg-indigo-600 hover:text-white transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Download Annual Statement
      </button>
    </div>
  );
};

export default AnnualSummaryCard;
