import type { RecentResult } from "../types/dashboard.types";

interface Props {
  data: RecentResult;
}

export const RecentResults = ({ data }: Props) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Recent Results</h3>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
          {data.testName} · {data.date}
        </p>
        <p className="text-3xl font-bold text-gray-900 leading-tight">
          {data.score}
          <span className="text-sm font-normal text-gray-400">/{data.total}</span>
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          {data.passed && (
            <span className="text-[11px] font-medium bg-green-100 text-green-700 px-2.5 py-0.5 rounded">
              Pass
            </span>
          )}
          <span className="text-[11px] font-medium bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded">
            Rank {data.rank}
          </span>
        </div>
      </div>

      <button className="w-full mt-3 flex items-center justify-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 transition-colors">
        📄 View Detailed Report
      </button>
    </div>
  );
};
