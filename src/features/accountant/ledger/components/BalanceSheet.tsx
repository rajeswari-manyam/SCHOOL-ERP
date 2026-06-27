import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "../../../../utils/formatters";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { BalanceSheetProps } from "../types/Ledger.types";
import { TrendingDown, Building2, AlertCircle, FileText } from "lucide-react";

export const BalanceSheet = ({ income, expense, chartData, balanceSheetData }: BalanceSheetProps) => {
  const incomeItems  = balanceSheetData?.income    ?? [];
  const expenseItems = balanceSheetData?.expenses  ?? [];
  const totalIn      = balanceSheetData?.totalIncome   ?? income;
  const totalOut     = balanceSheetData?.totalExpenses ?? expense;
  const net          = balanceSheetData?.netPosition   ?? (income - expense);
  const isNegative   = net < 0;

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-0">
   
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-5 pb-0 border-0">
          <CardTitle className="text-base sm:text-lg font-bold text-gray-900">
            Monthly Summary — April 2025
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pt-4 pb-4 sm:pb-6">

          {/* Inflow / Outflow Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Inflow */}
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Total Inflow
                </span>
              </div>
              <div className="space-y-2">
                {incomeItems.map((item) => (
                  <div key={item.description} className="flex justify-between text-sm">
                    <span className="text-gray-600 text-[13px] sm:text-sm">{item.description}</span>
                    <span className="font-medium text-gray-800 text-[13px] sm:text-sm">
                      {formatINR(item.amount)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="font-semibold text-gray-700 text-sm">Total Income</span>
                  <span className="font-bold text-emerald-600 text-sm">{formatINR(totalIn)}</span>
                </div>
              </div>
            </div>

            {/* Outflow */}
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Total Outflow
                </span>
              </div>
              <div className="space-y-2">
                {expenseItems.map((item) => (
                  <div key={item.description} className="flex justify-between text-sm">
                    <span className="text-gray-600 text-[13px] sm:text-sm">{item.description}</span>
                    <span className="font-medium text-gray-800 text-[13px] sm:text-sm">
                      {formatINR(item.amount)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="font-semibold text-gray-700 text-sm">Total Expenses</span>
                  <span className="font-bold text-rose-600 text-sm">{formatINR(totalOut)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Net Position */}
          <div className="p-3 sm:p-4 rounded-lg border border-[#C7D7F9] bg-[#E5EEFF]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Current Net Position
                </p>
                <p className={`text-xl sm:text-2xl font-bold ${isNegative ? "text-rose-600" : "text-emerald-600"}`}>
                  {isNegative ? "- " : ""}{formatINR(Math.abs(net))}
                </p>
              </div>
              <div className="flex items-start gap-2 max-w-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">
                  Note: Payroll is March salary paid in April. April income still in progress.
                  Higher outflow expected this week for facility upgrades.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

   
      <Card className="border-gray-200 shadow-sm">
      <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-5 pb-0 border-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-gray-900">
                Income vs Expenses — Last 6 Months
              </CardTitle>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                Institutional cash flow trend analysis
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1 bg-emerald-500 rounded-full" />
                <span className="text-gray-600 text-[11px] sm:text-xs">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1 bg-rose-500 rounded-full" />
                <span className="text-gray-600 text-[11px] sm:text-xs">Expenses</span>
              </div>
            </div>
          </div>
        </CardHeader>
    <CardContent className="px-2 sm:px-6 pt-4 pb-4 sm:pb-6">
          <div className="h-48 sm:h-52 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                  }}
                 formatter={(value) => {
  if (typeof value !== "number") return ["₹0", ""];
  return [formatINR(value), ""];
}}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#f43f5e", strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ════════════════════════════════════════
          Bottom Stats Cards
          ════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Bank Balance — Purple Card */}
        <Card className="bg-[#3525CD] border-[#3525CD] text-white">
          <CardContent className="p-3 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-indigo-200 uppercase tracking-wide mb-1">
                Bank Balance
              </p>
              <p className="text-lg sm:text-xl font-bold">{formatINR(1245000)}</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-500/50 flex items-center justify-center">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-100" />
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Fees — White Card */}
        <Card className="bg-white border-gray-200">
          <CardContent className="p-3 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide mb-1">
                Outstanding (Fees)
              </p>
              <p className="text-lg sm:text-xl font-bold text-gray-800">{formatINR(482000)}</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* Liabilities — White Card */}
        <Card className="bg-white border-gray-200 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-3 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide mb-1">
                Liabilities
              </p>
              <p className="text-lg sm:text-xl font-bold text-gray-800">{formatINR(89000)}</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-rose-50 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};