import { Card, CardContent } from "../../../../components/ui/card";
import typography from "../../../../styles/typography";
import { cn } from "../../../../utils/cn";

import type { SessionSummaryProps } from "../types/fee.types";
import { sessionSummaryData } from "../data/fee.data";

export function SessionSummary({
  totalFees = sessionSummaryData.totalFees,
  paidAmount = sessionSummaryData.paidAmount,
}: SessionSummaryProps) {

  const percentage = Math.round((paidAmount / totalFees) * 100);

  return (
    <Card className="
      w-full sm:w-[320px]
      rounded-[24px]
      bg-[#0B1C30]
      text-white
      border border-white/10
      hover:border-[#3525CD]
      transition-all duration-300
      shadow-none hover:shadow-lg
    ">

      <CardContent className="flex flex-col gap-3 p-4">

        {/* TITLE */}
        <p className={cn(
          typography.form.helper,
          "tracking-widest uppercase text-white/50"
        )}>
          Current Session Summary
        </p>

        {/* TOTAL */}
        <div>
          <p className={cn(typography.form.helper, "text-white/50")}>
            Total Fees
          </p>
          <p className="text-[24px] font-bold leading-none">
            Rs. {totalFees.toLocaleString("en-IN")}
          </p>
        </div>

        {/* PROGRESS */}
        <div>
          <div className="flex justify-between text-[11px] text-white/60 mb-1">
            <span>
              Paid: Rs. {paidAmount.toLocaleString("en-IN")}
            </span>
            <span className="text-white font-semibold">
              {percentage}%
            </span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-1.5 rounded-full bg-emerald-400 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

      </CardContent>
    </Card>
  );
}