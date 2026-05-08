import type { RecentResult } from "../types/dashboard.types";
import { FileText } from "lucide-react";

interface Props {
  data: RecentResult;
}

const BRAND = "#3525CD";

export const RecentResults = ({ data }: Props) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm transition-all duration-200 md:hover:border-[#3525CD] md:hover:shadow-md">
      
      {/* Title */}
      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">
        Recent Results
      </h3>

      {/* Score Card */}
      <div
        className="
          text-center
          py-5 sm:py-6
          px-3 sm:px-4
          rounded-xl
          mb-3 sm:mb-4
          bg-[#EEF0FF]
          transition-all duration-200
          md:hover:shadow-sm md:hover:-translate-y-[2px]
        "
      >
        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 mb-2 sm:mb-3">
          {data.testName} • {data.date}
        </p>

        <p className="leading-none mb-3 sm:mb-4">
          <span className="text-4xl sm:text-6xl font-black text-gray-900">
            {data.score}
          </span>
          <span className="text-base sm:text-xl font-medium text-gray-400">
            /{data.total}
          </span>
        </p>

        {/* Status badges */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {data.passed && (
            <span className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full bg-[#D1FAE5] text-[#065F46]">
              PASS
            </span>
          )}

          <span
            className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full text-white"
            style={{ backgroundColor: BRAND }}
          >
            Rank {data.rank}
          </span>
        </div>
      </div>

      {/* Button */}
      <button
        className="
          w-full
          flex items-center justify-center gap-2
          py-2.5 sm:py-3
          rounded-xl
          text-xs sm:text-sm font-semibold
          bg-[#EEF0FF]
          transition-all duration-200
          md:hover:bg-[#3525CD] md:hover:text-white
        "
        style={{ color: BRAND }}
      >
        <FileText size={16} strokeWidth={2.5} />
        View Detailed Report
      </button>
    </div>
  );
};