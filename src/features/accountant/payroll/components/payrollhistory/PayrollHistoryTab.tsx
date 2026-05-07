import { useState } from "react";
import { Download, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HistoryStats } from "./HistoryStats";
import { HistoryTable } from "./HistoryTable";
import type { PayrollHistoryTabProps } from "../../types/payroll.types";

const MONTHS = ["JUN","JUL","AUG","SEP","OCT","NOV","DEC","JAN","FEB","MAR"];

export const PayrollHistoryTab = ({
  history,
  totalPayrollFY,
  avgMonthlyPayroll,
  staffCount,
}: PayrollHistoryTabProps) => {
  const [selectedYear, setSelectedYear] = useState("2024-25");
  const [showChart, setShowChart] = useState(true);

  return (
    <div className="space-y-4">
      {/* Filters - Stack on mobile */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3">
        <div className="flex gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="h-9 px-3 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-none"
          >
            <option>2024-25</option>
            <option>2023-24</option>
            <option>2022-23</option>
          </select>

          <div className="h-9 px-3 rounded-lg border border-gray-200 bg-white flex items-center gap-2 text-xs text-gray-600 flex-1 sm:flex-none justify-center">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">April 2024 — March 2025</span>
            <span className="sm:hidden">Apr 24 — Mar 25</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 text-xs gap-2 sm:ml-auto w-full sm:w-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export All</span>
          <span className="sm:hidden">Export</span>
        </Button>
      </div>

      {/* Stats */}
      <HistoryStats
        totalPayrollFY={totalPayrollFY}
        avgMonthlyPayroll={avgMonthlyPayroll}
        staffCount={staffCount}
      />

      {/* Trend Chart - Collapsible on mobile */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:border-[#3525CD] transition-colors">
        {/* Mobile: Collapsible header */}
        <button
          className="sm:hidden flex items-center justify-between w-full mb-2"
          onClick={() => setShowChart(!showChart)}
        >
          <h3 className="text-sm font-semibold text-gray-900">
            Monthly Trend
          </h3>
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform ${showChart ? "rotate-180" : ""}`} 
          />
        </button>

        {/* Desktop: Always visible header */}
        <div className="hidden sm:flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Monthly Payroll Trend — 2024-25
          </h3>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Spending
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              Average
            </span>
          </div>
        </div>

        {/* Chart content */}
        <div className={`${showChart ? "block" : "hidden sm:block"}`}>
          {/* Mobile: Simplified legend */}
          <div className="flex sm:hidden gap-3 mb-3 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Spending
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              Avg
            </span>
          </div>

          <div className="h-28 sm:h-32 flex items-end justify-between gap-1 sm:gap-2 px-1 sm:px-2">
            {MONTHS.map((month) => (
              <div key={month} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <div
                  className="w-full bg-blue-100 rounded-t-sm relative"
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-t-sm"
                    style={{ height: `${Math.random() * 40 + 30}%` }}
                  />
                </div>
                <span className="text-[9px] sm:text-[10px] text-gray-500">{month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#3525CD] transition-colors">
        <div className="px-3 sm:px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">
            Payroll History — 2024-25
          </h3>
        </div>

        <div className="p-2 sm:p-0">
          <HistoryTable data={history} />
        </div>

        <div className="flex justify-center p-3 sm:p-4 border-t border-gray-100">
          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            Load Full History (10 months)
          </button>
        </div>
      </div>
    </div>
  );
};