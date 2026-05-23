import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "../../../../utils/formatters";

import type { PaymentModeBreakdownItem } from "../types/dashboard.types";

const modeData: PaymentModeBreakdownItem[] = [
  { mode: "UPI", dot: "bg-indigo-500", volume: 15440000, growth: 12.4 },
  { mode: "CASH", dot: "bg-green-500", volume: 6669000, growth: -4.2 },
  { mode: "CHEQUE", dot: "bg-amber-400", volume: 1287000, growth: 0.8 },
];
export const PaymentModeBreakdown = () => {
  return (
    <Card className="border border-slate-200 shadow-none rounded-xl hover:border-[#3525CD] transition-colors h-full flex flex-col">
      <CardHeader className="px-4 py-3 sm:px-5 sm:py-4 border-b border-slate-100">
       <CardTitle className="text-sm sm:text-base font-semibold text-slate-800">
          Payment Mode Breakdown — April
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 py-3 sm:px-5 flex-1 overflow-y-auto">

       
        <div className="hidden md:block w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase py-2.5">
                  Payment Mode
                </th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase py-2.5">
                  Total Volume
                </th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase py-2.5">
                  Growth vs Mar
                </th>
              </tr>
            </thead>

            <tbody>
              {modeData.map((row) => (
                <tr key={row.mode} className="border-b border-slate-50 last:border-0">
                  <td className="py-3">
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${row.dot}`} />
                      <span className="text-slate-600">{row.mode}</span>
                    </span>
                  </td>

                  <td className="py-3 text-right font-semibold text-slate-800 whitespace-nowrap">
                    {formatCurrency(row.volume)}
                  </td>

                  <td className="py-3 text-right">
                    <span
                      className={`text-xs font-semibold ${
                        row.growth >= 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {row.growth >= 0 ? "+" : ""}
                      {row.growth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      <div className="md:hidden space-y-2.5 sm:space-y-3">
  {modeData.map((row) => (
    <div
      key={row.mode}
      className="border border-slate-200 rounded-xl p-3 bg-white shadow-sm"
    >
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${row.dot}`} />
          <p className="text-sm font-medium text-slate-700">
            {row.mode}
          </p>
        </div>

        <span
          className={`text-xs font-semibold ${
            row.growth >= 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          {row.growth >= 0 ? "+" : ""}
          {row.growth}%
        </span>
      </div>

      {/* Divider */}
      <div className="my-2 h-px bg-slate-100" />

      {/* Bottom Row */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">Total Volume</p>
        <p className="text-sm font-semibold text-slate-900">
          {formatCurrency(row.volume)}
        </p>
      </div>
    </div>
  ))}
</div>

      </CardContent>
    </Card>
  );
};