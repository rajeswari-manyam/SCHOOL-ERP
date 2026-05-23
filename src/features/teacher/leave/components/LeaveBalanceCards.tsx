import { Calendar, Activity, User, AlertTriangle } from "lucide-react";
import type { LeaveBalance, LeaveType } from "../types/leave.types";

// Per-type accent classes
const ACCENT: Record<string, { icon: string; ring: string; bar: string; value: string; bg: string; iconBg: string }> = {
  sky:    { icon: "text-sky-500",    ring: "border-sky-200",    bar: "bg-sky-500",    value: "text-sky-700",    bg: "bg-sky-50",    iconBg: "bg-sky-100"    },
  rose:   { icon: "text-rose-500",   ring: "border-rose-200",   bar: "bg-rose-500",   value: "text-rose-700",   bg: "bg-rose-50",   iconBg: "bg-rose-100"   },
  violet: { icon: "text-violet-500", ring: "border-violet-200", bar: "bg-violet-500", value: "text-violet-700", bg: "bg-violet-50", iconBg: "bg-violet-100" },
  amber:  { icon: "text-amber-500",  ring: "border-amber-200",  bar: "bg-amber-400",  value: "text-amber-700",  bg: "bg-amber-50",  iconBg: "bg-amber-100"  },
};

const TYPE_ICONS: Record<LeaveType, React.ReactNode> = {
  CASUAL: (
    <Calendar size={18} className="text-current" strokeWidth={2} />
  ),
  SICK: (
    <Activity size={18} className="text-current" strokeWidth={2} />
  ),
  PERSONAL: (
    <User size={18} className="text-current" strokeWidth={2} />
  ),
  EMERGENCY: (
    <AlertTriangle size={18} className="text-current" strokeWidth={2} />
  ),
};

interface Props { balances: LeaveBalance[] }

const LeaveBalanceCards = ({ balances }: Props) => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
    {balances.map(b => {
      const a = ACCENT[b.accentColor];
      const pct = b.total > 0 ? Math.round((b.remaining / b.total) * 100) : 0;
      return (
        <div key={b.type} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
          {/* Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.iconBg} ${a.icon}`}>
            {TYPE_ICONS[b.type]}
          </div>

          {/* Values */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">{b.label}</p>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-3xl font-extrabold tracking-tight ${a.value}`}>{b.remaining}</span>
              <span className="text-sm text-gray-400 font-medium">/ {b.total}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{b.used} used · {b.remaining} remaining</p>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${a.bar}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      );
    })}
  </div>
);

export default LeaveBalanceCards;
