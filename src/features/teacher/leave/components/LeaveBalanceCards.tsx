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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  SICK: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  PERSONAL: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  EMERGENCY: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
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
