import { Calendar, Activity, User, AlertTriangle, RefreshCw, Bug } from "lucide-react";
import type { LeaveBalance, LeaveType } from "../types/leave.types";

const ACCENT: Record<string, { icon: string; ring: string; bar: string; value: string; bg: string; iconBg: string }> = {
  sky:    { icon: "text-sky-500",    ring: "border-sky-200",    bar: "bg-sky-500",    value: "text-sky-700",    bg: "bg-sky-50",    iconBg: "bg-sky-100"    },
  rose:   { icon: "text-rose-500",   ring: "border-rose-200",   bar: "bg-rose-500",   value: "text-rose-700",   bg: "bg-rose-50",   iconBg: "bg-rose-100"   },
  violet: { icon: "text-violet-500", ring: "border-violet-200", bar: "bg-violet-500", value: "text-violet-700", bg: "bg-violet-50", iconBg: "bg-violet-100" },
  amber:  { icon: "text-amber-500",  ring: "border-amber-200",  bar: "bg-amber-400",  value: "text-amber-700",  bg: "bg-amber-50",  iconBg: "bg-amber-100"  },
};

const TYPE_ICONS: Record<LeaveType, React.ReactNode> = {
  CASUAL:    <Calendar size={18} className="text-current" strokeWidth={2} />,
  SICK:      <Activity size={18} className="text-current" strokeWidth={2} />,
  PERSONAL:  <User size={18} className="text-current" strokeWidth={2} />,
  EMERGENCY: <AlertTriangle size={18} className="text-current" strokeWidth={2} />,
};

const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
    <div className="w-10 h-10 rounded-xl bg-gray-200" />
    <div className="space-y-2">
      <div className="h-3 w-24 rounded bg-gray-200" />
      <div className="h-8 w-20 rounded bg-gray-200" />
      <div className="h-3 w-32 rounded bg-gray-200" />
    </div>
    <div className="h-1.5 rounded-full bg-gray-100">
      <div className="h-full w-3/5 rounded-full bg-gray-200" />
    </div>
  </div>
);

interface Props {
  balances: LeaveBalance[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const LeaveBalanceCards = ({ balances, loading, error, onRetry }: Props) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4" role="status" aria-label="Loading leave balances">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5" role="alert">
        <div className="flex items-center gap-2">
          <Bug size={16} className="text-red-500 shrink-0" />
          <span className="text-sm font-semibold text-red-700">{error}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 text-sm font-bold text-red-700 hover:text-red-900 transition-colors shrink-0"
          >
            <RefreshCw size={14} className="text-current" strokeWidth={2} />
            Retry
          </button>
        )}
      </div>
    );
  }

  if (!balances.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
        <Calendar size={32} className="text-gray-300" strokeWidth={1.5} />
        <p className="text-sm font-medium text-gray-500">No leave balances configured yet</p>
        <p className="text-xs text-gray-400">Balances will appear here once configured by your school admin.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {balances.map(b => {
        const a = ACCENT[b?.accentColor] ?? ACCENT.sky;
        const total = b?.total ?? 0;
        const remaining = b?.remaining ?? 0;
        const used = b?.used ?? 0;
        const pct = total > 0 ? Math.round((remaining / total) * 100) : 0;
        return (
          <div key={b.type} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.iconBg} ${a.icon}`}>
              {TYPE_ICONS[b?.type]}
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">{b?.label ?? "-"}</p>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-3xl font-extrabold tracking-tight ${a.value}`}>{remaining}</span>
                <span className="text-sm text-gray-400 font-medium">/ {total}</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{used} used · {remaining} remaining</p>
            </div>

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
};

export default LeaveBalanceCards;
