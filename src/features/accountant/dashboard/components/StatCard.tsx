import type { StatItem } from "../types/dashboard.types";
import { formatCurrency } from "../../../../utils/formatters";
import { TrendingUp, LayoutGrid, AlertCircle, MessageSquare, Activity, Monitor, CalendarDays } from "lucide-react";
const cardConfig = [
  {
    label: "COLLECTED TODAY",
    accent: "bg-emerald-50",
    iconColor: "text-emerald-600",
    icon: <TrendingUp size={18} />,
    sub1: "8 payments recorded",
    sub2: "3 cash, 4 UPI, 1 cheque",
  },
  {
    label: "APRIL TOTAL SO FAR",
    accent: "bg-indigo-50",
    iconColor: "text-indigo-600",
    icon: <LayoutGrid size={18} />,
    sub1: "66% of expected Rs.3,52,000",
    progress: 66,
  },
  {
    label: "PENDING FEES",
    accent: "bg-amber-50",
    iconColor: "text-amber-500",
    icon: <AlertCircle size={18} />,
    sub1: "89 students with dues",
    avatars: true,
  },
  {
    label: "30+ DAYS OVERDUE",
    accent: "bg-red-50",
    iconColor: "text-red-500",
    icon: <AlertCircle size={18} />,
    sub1: "12 students — urgent action",
    sub1Color: "text-red-500 font-medium",
    sub2: "DOWNLOAD DEFAULTERS LIST",
    sub2Color: "text-blue-500 underline cursor-pointer",
  },
  {
    label: "WHATSAPP REMINDERS",
    accent: "bg-teal-50",
    iconColor: "text-teal-600",
    icon: <MessageSquare size={18} />,
    sub1: "Auto-sent at 8:00 AM",
    badge: "online",
  },
  {
    label: "WEEKLY VOLUME",
    accent: "bg-blue-50",
    iconColor: "text-blue-600",
    icon: <Activity size={18} />,
    sub1: "Rs.87,500 collected",
  },
  {
    label: "MARCH PAYROLL",
    accent: "bg-orange-50",
    iconColor: "text-orange-500",
    icon: <Monitor size={18} />,
    sub1: "Paid on 1 Apr 2025",
  },
  {
    label: "UNTIL APRIL PAYROLL",
    accent: "bg-violet-50",
    iconColor: "text-violet-600",
    icon: <CalendarDays size={18} />,
    sub1: "Rs.3,84,000 estimated",
  },
];

export const StatCardsSection = ({ data }: { data: StatItem[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {data.map((item, i) => {
        const config = cardConfig[i];

        return (
          <div
            key={item.label}
            className="bg-white rounded-xl border border-slate-200 px-3 py-3 sm:px-4 sm:py-3.5 flex items-start gap-3 hover:border-indigo-300 transition-colors"
          >
            {/* Icon */}
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${config.accent} ${config.iconColor} flex items-center justify-center flex-shrink-0`}
            >
              <span className="scale-90 sm:scale-100">{config.icon}</span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {config.label}
              </p>

              <p className="text-[15px] sm:text-[17px] font-bold text-slate-900 leading-tight truncate">
                {typeof item.value === "number"
                  ? formatCurrency(item.value)
                  : item.value}
              </p>

              {config.sub1 && (
                <p
                  className={`text-[10px] sm:text-[11px] mt-1 ${config.sub1Color ?? "text-slate-500"
                    }`}
                >
                  {config.sub1}
                </p>
              )}

              {config.sub2 && (
                <p
                  className={`text-[9px] sm:text-[10px] mt-0.5 font-medium ${config.sub2Color ?? "text-slate-400"
                    }`}
                >
                  {config.sub2}
                </p>
              )}

              {config.progress !== undefined && (
                <div className="mt-1.5 h-1 bg-slate-100 rounded-full">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${config.progress}%` }}
                  />
                </div>
              )}
            </div>

        
            {config.badge === "online" && (
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1" />
            )}
          </div>
        );
      })}
    </div>
  );
};