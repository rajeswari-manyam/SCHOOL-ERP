import type { RecentResult } from "../types/dashboard.types";
import { FileText } from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: RecentResult;
}

const BRAND = "#3525CD";

export const RecentResults = ({ data }: Props) => {
  const pct = Math.round((data.score / data.total) * 100);

  const chartData = [
    { name: "score", value: pct, fill: BRAND },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm transition-all duration-200 md:hover:border-[#3525CD] md:hover:shadow-md">

      {/* Title */}
      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">
        Recent Results
      </h3>

      {/* Radial Chart */}
      <div className="relative flex items-center justify-center mb-3 sm:mb-4">
        <ResponsiveContainer width="100%" height={120}>
          <RadialBarChart
            cx="50%"
            cy="100%"
            innerRadius="60%"
            outerRadius="90%"
            startAngle={180}
            endAngle={0}
            data={chartData}
          >
            <RadialBar
              background={{ fill: "#EEF0FF" }}
              dataKey="value"
              cornerRadius={6}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <p className="text-2xl sm:text-3xl font-black text-gray-900 leading-none">
            {data.score}
            <span className="text-sm sm:text-base font-medium text-gray-400">
              /{data.total}
            </span>
          </p>
          <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">
            {data.testName} • {data.date}
          </p>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-3 sm:mb-4">
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
        <span className="text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700">
          {pct}%
        </span>
      </div>

      {/* Button */}
      <button
        className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold bg-[#EEF0FF] transition-all duration-200 md:hover:bg-[#3525CD] md:hover:text-white"
        style={{ color: BRAND }}
      >
        <FileText size={16} strokeWidth={2.5} />
        View Detailed Report
      </button>
    </div>
  );
};
