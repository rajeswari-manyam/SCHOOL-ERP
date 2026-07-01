import { TrendingUp, Wallet, Users } from "lucide-react";
import { HistoryTable } from "./HistoryTable";
import { formatINR as formatCurrency } from "../../../../../utils/formatters";
import type { PayrollHistoryTabProps } from "../../types/payroll.types";

export const PayrollHistoryTab = ({
  history,
  totalPayrollFY,
  avgMonthlyPayroll,
  staffCount,
}: PayrollHistoryTabProps) => {
  return (
    <div className="space-y-5">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-[#3525CD]" />
            </div>
            <p className="text-xs font-medium text-slate-500">Total Payroll</p>
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

{/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">Payroll History</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">{history.length} records found</p>
        </div>
        <HistoryTable data={history} />
      </div>
    </div>
  );
};
