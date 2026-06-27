import { useState, useMemo } from "react";
import { Download, Filter, FileSpreadsheet, TrendingUp, Wallet, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HistoryTable } from "./HistoryTable";
import { formatINR as formatCurrency } from "../../../../../utils/formatters";
import type { PayrollHistoryTabProps, PayrollHistory } from "../../types/payroll.types";

const MONTHS_LIST = ["All", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS_LIST  = ["2024-25", "2023-24", "2022-23"];
const STATUS_LIST = ["All", "Paid", "Pending"];
const CHART_MONTHS = ["JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR"];

const BAR_HEIGHTS = [65, 72, 58, 80, 70, 62, 75, 68, 85, 60];

export const PayrollHistoryTab = ({
  history,
  totalPayrollFY,
  avgMonthlyPayroll,
  staffCount,
}: PayrollHistoryTabProps) => {
  const [selectedYear,   setSelectedYear]   = useState("2024-25");
  const [selectedMonth,  setSelectedMonth]  = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filtered: PayrollHistory[] = useMemo(() => {
    return history.filter((h) => {
      const monthMatch  = selectedMonth === "All" || h.month.startsWith(selectedMonth);
      const statusMatch = selectedStatus === "All" || h.status === selectedStatus;
      return monthMatch && statusMatch;
    });
  }, [history, selectedMonth, selectedStatus]);

  const filteredGross = filtered.reduce((s, h) => s + h.totalGross, 0);
  const filteredNet   = filtered.reduce((s, h) => s + h.netPaid, 0);

  const selectCls =
    "h-9 px-3 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3525CD]/20 focus:border-[#3525CD]";

  return (
    <div className="space-y-5">
      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className={selectCls}>
            {YEARS_LIST.map((y) => <option key={y}>{y}</option>)}
          </select>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className={selectCls}>
            {MONTHS_LIST.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className={selectCls}>
            {STATUS_LIST.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 border-slate-200">
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
          <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Excel</span>
            <span className="sm:hidden">Excel</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-[#3525CD]" />
            </div>
            <p className="text-xs font-medium text-slate-500">Total Payroll {selectedYear}</p>
          </div>
          <p className="text-xl font-bold text-[#3525CD]">{formatCurrency(totalPayrollFY)}</p>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">+12.5% vs last FY</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <p className="text-xs font-medium text-slate-500">Total Staff</p>
          </div>
          <p className="text-xl font-bold text-slate-800">{staffCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">staff members on payroll</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-xs font-medium text-slate-500">Avg Monthly Payroll</p>
          </div>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(avgMonthlyPayroll)}</p>
          <p className="text-[11px] text-slate-400 mt-1">based on active records</p>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Monthly Payroll Trend</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">FY {selectedYear}</p>
          </div>
          <div className="flex gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#3525CD]" />
              Spending
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-200" />
              Average
            </span>
          </div>
        </div>
        <div className="h-32 flex items-end gap-2">
          {CHART_MONTHS.map((month, i) => (
            <div key={month} className="flex flex-col items-center gap-1 flex-1 min-w-0">
              <div
                className="w-full bg-slate-100 rounded-t-md relative overflow-hidden"
                style={{ height: `${BAR_HEIGHTS[i]}%` }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 bg-[#3525CD]/80 rounded-t-md"
                  style={{ height: "60%" }}
                />
              </div>
              <span className="text-[9px] text-slate-400 font-medium">{month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter result summary */}
      {(selectedMonth !== "All" || selectedStatus !== "All") && (
        <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
          <span>Filtered: <span className="font-semibold text-slate-700">{filtered.length} records</span></span>
          <span className="text-slate-300">|</span>
          <span>Gross: <span className="font-semibold text-slate-700">{formatCurrency(filteredGross)}</span></span>
          <span className="text-slate-300">|</span>
          <span>Net: <span className="font-semibold text-[#3525CD]">{formatCurrency(filteredNet)}</span></span>
        </div>
      )}

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Payroll History — {selectedYear}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{filtered.length} records found</p>
          </div>
        </div>
        <HistoryTable data={filtered} />
        <div className="flex justify-center px-5 py-3 border-t border-slate-100">
          <button className="text-xs text-[#3525CD] hover:text-[#2a1fb5] font-medium hover:underline">
            Load Full History ({history.length} months)
          </button>
        </div>
      </div>
    </div>
  );
};
