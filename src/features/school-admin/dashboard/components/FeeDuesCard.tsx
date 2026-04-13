import type { FeeSummary } from "../types/dashboard.types";
import { AVATAR_COLOR_MAP } from "../utils/constants.ts";
import { getAvatarColor } from "../utils/formatters.ts";

interface Props {
  fees: FeeSummary;
  onViewDefaulters: () => void;
}

export function FeeDuesCard({ fees, onViewDefaulters }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="font-bold text-gray-900 text-base mb-4">Fee Dues Summary</h2>

      <div className="bg-indigo-50 rounded-xl p-4 mb-4">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Total Outstanding</p>
        <p className="text-3xl font-bold text-indigo-700">{fees.totalOutstanding}</p>
        <div className="flex justify-between text-xs text-gray-500 mt-2 mb-1">
          <span>PAID ({fees.paidPercent}%)</span>
          <span>PENDING ({100 - fees.paidPercent}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${fees.paidPercent}%` }} />
        </div>
      </div>

      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Top Defaulters</p>
      <div className="space-y-3">
        {fees.defaulters.map((defaulter) => (
          <div key={defaulter.initials} className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${getAvatarColor(
                defaulter.initials,
                AVATAR_COLOR_MAP
              )}`}
            >
              {defaulter.initials}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">{defaulter.name}</p>
              <p className="text-xs text-gray-400">{defaulter.cls}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{defaulter.amount}</p>
              <p className="text-xs text-red-500 font-semibold">{defaulter.overdueLabel}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onViewDefaulters}
        className="mt-4 w-full text-center text-blue-600 text-sm font-medium hover:underline"
      >
        View All Defaulters
      </button>
    </div>
  );
}
