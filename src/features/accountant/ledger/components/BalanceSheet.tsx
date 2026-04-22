
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "../../../../utils/formatters";
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
import { SUMMARY_DATA } from "../data/ledger.data";               
import { TrendingDown, Building2, AlertCircle, FileText } from "lucide-react";
import typography, { combineTypography } from "@/styles/typography";

export const BalanceSheet = ({ income, expense, chartData }: BalanceSheetProps) => {
  const net = income - expense;
  const isNegative = net < 0;

  return (
    <div className="space-y-6">
      {/* Monthly Summary */}
      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className={combineTypography(typography.heading.h5, "text-gray-800")}>
            Monthly Summary — April 2025
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Inflow */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className={combineTypography(typography.body.xs, "font-semibold text-gray-500 uppercase tracking-wide")}>
                  Total Inflow
                </span>
              </div>
              <div className="space-y-2">
                {SUMMARY_DATA.filter((d) => d.type === "income").map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className={combineTypography(typography.body.small, "text-gray-600")}>{item.label}</span>
                    <span className={combineTypography(typography.body.small, "font-medium text-gray-800")}>
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="font-semibold text-gray-700">Total Income</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(income)}</span>
                </div>
              </div>
            </div>

            {/* Outflow */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className={combineTypography(typography.body.xs, "font-semibold text-gray-500 uppercase tracking-wide")}>
                  Total Outflow
                </span>
              </div>
              <div className="space-y-2">
                {SUMMARY_DATA.filter((d) => d.type === "expense").map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className={combineTypography(typography.body.small, "text-gray-600")}>{item.label}</span>
                    <span className={combineTypography(typography.body.small, "font-medium text-gray-800")}>
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="font-semibold text-gray-700">Total Expenses</span>
                  <span className="font-bold text-rose-600">{formatCurrency(expense)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Position */}
        <div className="p-4 rounded-lg border border-[#C7D7F9]" style={{ backgroundColor: '#E5EEFF' }}>
  <div className="flex items-center justify-between gap-6">
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        Current Net Position
      </p>
      <p className={`text-2xl font-bold ${isNegative ? "text-rose-600" : "text-emerald-600"}`}>
        {isNegative ? "- " : ""}{formatCurrency(Math.abs(net))}
      </p>
    </div>
    <div className="flex items-start gap-2 max-w-sm">
      <AlertCircle className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
      <p className="text-xs text-gray-500 leading-relaxed">
        Note: Payroll is March salary paid in April. April income still in progress.
        Higher outflow expected this week for facility upgrades.
      </p>
    </div>
  </div>
</div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className={combineTypography(typography.heading.h5, "text-gray-800")}>
              Income vs Expenses — Last 6 Months
            </CardTitle>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-1 bg-emerald-500 rounded-full" />
                <span className={combineTypography(typography.body.small, "text-gray-600")}>Income</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-1 bg-rose-500 rounded-full" />
                <span className={combineTypography(typography.body.small, "text-gray-600")}>Expenses</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500">Institutional cash flow trend analysis</p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
               formatter={(value) => {
  if (typeof value !== "number") return ["₹0", ""];
  return [formatCurrency(value), ""];
}}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#f43f5e", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

     {/* Bottom Stats */}
<div className="grid grid-cols-3 gap-4">
  <Card className="bg-indigo-600 border-indigo-600 text-white">
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-indigo-200 uppercase tracking-wide mb-1">Bank Balance</p>
        <p className="text-xl font-bold">{formatCurrency(1245000)}</p>
      </div>
      <div className="w-10 h-10 rounded-lg bg-indigo-500/50 flex items-center justify-center">
        <Building2 className="w-5 h-5 text-indigo-100" />
      </div>
    </CardContent>
  </Card>

  <Card className="bg-white border-gray-200">
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Outstanding (Fees)</p>
        <p className="text-xl font-bold text-gray-800">{formatCurrency(482000)}</p>
      </div>
      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
        <FileText className="w-5 h-5 text-gray-400" />
      </div>
    </CardContent>
  </Card>

  <Card className="bg-white border-gray-200">
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Liabilities</p>
        <p className="text-xl font-bold text-gray-800">{formatCurrency(89000)}</p>
      </div>
      <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
        <TrendingDown className="w-5 h-5 text-rose-400" />
      </div>
    </CardContent>
  </Card>
</div>
    </div>
  );
};