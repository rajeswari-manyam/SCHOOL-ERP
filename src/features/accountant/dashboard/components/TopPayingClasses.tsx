import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "../../../../utils/formatters";
import typography from "../../../../styles/typography";
import type { TopPayingClassItem } from "../types/dashboard.types";

const data: TopPayingClassItem[] = [
  { className: "Class XX", amount: 4800000, pct: 85 },
  { className: "Class X", amount: 4200000, pct: 78 },
  { className: "Class IX", amount: 3600000, pct: 62 },
  { className: "Class VII", amount: 2900000, pct: 55 },
];
export const TopPayingClasses = () => {
  return (
   <Card className="border border-slate-200 shadow-none rounded-xl hover:border-[#3525CD] transition-colors">
  
  <CardHeader className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100">
    <CardTitle className={`${typography.body.small} text-sm sm:text-base`}>
      Top Paying Classes — April
    </CardTitle>
  </CardHeader>

  <CardContent className="px-4 sm:px-5 py-3 sm:py-4 space-y-4">
    {data.map((item) => (
      <div key={item.className} className="space-y-1.5">

      
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <span className={`${typography.body.small} text-sm`}>
            {item.className}
          </span>

          <span className="text-sm font-semibold text-slate-800">
            {formatCurrency(item.amount)}
          </span>
        </div>

 
        <div className="flex items-center gap-2 sm:gap-3">

          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${item.pct}%` }}
            />
          </div>

          <span className="text-xs text-slate-400 w-10 text-right tabular-nums">
            {item.pct}%
          </span>
        </div>

      </div>
    ))}
  </CardContent>

</Card>
  );
};