import { useState } from "react";
import { Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HistoryStats } from "./HistoryStats";
import { HistoryTable } from "./HistoryTable";
import type { PayrollHistory } from "../../types/payroll.types";

interface PayrollHistoryTabProps {
  history: PayrollHistory[];
  totalPayrollFY: number;
  avgMonthlyPayroll: number;
  staffCount: number;
}

const MONTHS = ["JUN","JUL","AUG","SEP","OCT","NOV","DEC","JAN","FEB","MAR"];

export const PayrollHistoryTab = ({
  history,
  totalPayrollFY,
  avgMonthlyPayroll,
  staffCount,
}: PayrollHistoryTabProps) => {
  const [selectedYear, setSelectedYear] = useState("2024-25");

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="h-9 px-3 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>2024-25</option>
          <option>2023-24</option>
          <option>2022-23</option>
        </select>

        <div className="h-9 px-3 rounded-lg border border-gray-200 bg-white flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="w-3.5 h-3.5" />
          <span>April 2024 — March 2025</span>
        </div>

        <Button variant="outline" size="sm" className="h-9 text-xs gap-2 ml-auto">
          <Download className="w-3.5 h-3.5" />
          Export All
        </Button>
      </div>

      {/* Stats */}
      <HistoryStats
        totalPayrollFY={totalPayrollFY}
        avgMonthlyPayroll={avgMonthlyPayroll}
        staffCount={staffCount}
      />

      {/* Trend Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-[#3525CD] hover:border-1">
        <div className="flex items-center justify-between mb-4">
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
        <div className="h-32 flex items-end justify-between gap-2 px-2">
          {MONTHS.map((month) => (
            <div key={month} className="flex flex-col items-center gap-1 flex-1">
              <div
                className="w-full bg-blue-100 rounded-t-sm relative"
                style={{ height: `${Math.random() * 60 + 20}%` }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-t-sm"
                  style={{ height: `${Math.random() * 40 + 30}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-500">{month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#3525CD] hover:border-1">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">
            Payroll History — 2024-25
          </h3>
        </div>

        <HistoryTable data={history} />

        <div className="flex justify-center p-4 border-t border-gray-100">
          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            Load Full History (10 months)
          </button>
        </div>
      </div>
    </div>
  );
};