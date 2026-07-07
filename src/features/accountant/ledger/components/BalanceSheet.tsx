import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "../../../../utils/formatters";
import type { BalanceSheetProps } from "../types/Ledger.types";
import { AlertCircle } from "lucide-react";

export const BalanceSheet = ({ income, expense, balanceSheetData }: BalanceSheetProps) => {
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
    </div>
  );
};