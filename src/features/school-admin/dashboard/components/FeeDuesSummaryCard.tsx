import { useNavigate } from "react-router-dom";
import type { FeeDuesSummary } from "../types/sa-dashboard.types";

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const Avatar = ({ initials }: { initials: string }) => (
  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
    {initials}
  </div>
);

const FeeDuesSummaryCard = ({ dues }: { dues?: FeeDuesSummary }) => {
  const navigate = useNavigate();
  
  if (!dues) return null;
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <h2 className="text-base font-extrabold text-gray-900">Fee Dues Summary</h2>

      {/* Total outstanding */}
      <div className="bg-indigo-50 rounded-2xl px-4 py-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 mb-1">Total Outstanding</p>
        <p className="text-3xl font-extrabold text-indigo-700">{fmt(dues.totalOutstanding)}</p>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 mb-1">
            <span>PAID ({dues.paidPct}%)</span>
            <span>PENDING ({dues.pendingPct}%)</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-amber-200">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${dues.paidPct}%` }} />
          </div>
        </div>
      </div>

      {/* Top defaulters */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Top Defaulters</p>
        <div className="flex flex-col gap-3">
          {dues.topDefaulters.map((d) => (
            <div key={d.id} className="flex items-center gap-3">
              <Avatar initials={d.initials} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{d.name}</p>
                <p className="text-xs text-gray-400">{d.class}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-gray-900">{fmt(d.amount)}</p>
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide">OVERDUE {d.overdueDays}D</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate("/school-admin/fees")}
        className="w-full py-2.5 rounded-xl border border-indigo-200 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"
      >
        View All Defaulters
      </button>
    </div>
  );
};

export default FeeDuesSummaryCard;
