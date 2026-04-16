import { Card, CardContent } from "@/components/ui/card";
import type { ReminderStatus } from "../types/dashboard.types";

interface ReminderStatusProps {
  data: ReminderStatus & {
    threeDayCount?: number;
    todayCount?: number;
    overdueCount?: number;
  };
}

export const ReminderStatusCard = ({ data }: ReminderStatusProps) => {
  const deliveryRate =
    data.sent > 0 ? Math.round((data.delivered / data.sent) * 100) : 0;

  const threeDayCount = data.threeDayCount ?? 18;
  const todayCount = data.todayCount ?? 12;
  const overdueCount = data.overdueCount ?? 17;

  return (
    <Card className="border border-slate-200 shadow-none rounded-xl hover:border-[#3525CD] hover:border">
      <CardContent className="px-5 py-4 space-y-4">

        {/* Title row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
            <span className="text-sm font-semibold text-slate-900">
              Automated Reminder Status
            </span>
          </div>
          <span className="text-xs text-slate-400">Active for overdue batches</span>
        </div>

        {/* 3-box row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#E5EEFF] border border-slate-200 rounded-xl py-3 px-3 text-center">
            <p className="text-xl font-semibold text-slate-800">{threeDayCount}</p>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium tracking-wide uppercase">
              3-Day
            </p>
          </div>

          <div className="bg-[#E5EEFF] border border-slate-200 rounded-xl py-3 px-3 text-center">
            <p className="text-xl font-semibold text-slate-800">{todayCount}</p>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium tracking-wide uppercase">
              Today
            </p>
          </div>

          <div className="bg-[#E5EEFF] border border-slate-200 rounded-xl py-3 px-3 text-center">
            <p className="text-xl font-semibold text-slate-800">{overdueCount}</p>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium tracking-wide uppercase">
              Overdue
            </p>
          </div>
        </div>
        {/* Delivery rate bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">
              Delivery Rate ({data.sent} Sent)
            </span>
           <span
  className={`text-xs font-semibold ${
    deliveryRate >= 80 ? "text-green-600" : "text-[#F87171]"
  }`}
>
  {deliveryRate}% Success
</span>
          </div>
          <div className="h-2 bg-[#F87171] rounded-full overflow-hidden">
         <div
  className={`h-full rounded-full transition-all duration-500 ${
    deliveryRate >= 80 ? "bg-green-500" : "bg-red-500"
  }`}
  style={{ width: `${deliveryRate}%` }}
/>
</div>
          <div className="flex gap-2 text-xs font-medium">
            <span className="text-green-700 bg-green-50 px-2 py-1 rounded-md">
              {data.delivered} delivered
            </span>
            <span className="text-[#F87171] bg-red-50 px-2 py-1 rounded-md">
              {data.failed} failed
            </span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};