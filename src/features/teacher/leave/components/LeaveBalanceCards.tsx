import { Calendar, RefreshCw, Bug, ClipboardList, CheckCircle2, Clock } from "lucide-react";
import type { LeaveBalance, LeaveApplication } from "../types/leave.types";

const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
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
  leaveTotals?: { totalAllocated: number; totalUsed: number; totalBalance: number };
  leaveHistory?: LeaveApplication[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const LeaveBalanceCards = ({ balances, leaveTotals, leaveHistory = [], loading, error, onRetry }: Props) => {
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
    const totalDays    = leaveHistory.reduce((s, l) => s + (l.totalDays ?? 0), 0);
    const approvedDays = leaveHistory.filter(l => l.status === "APPROVED").reduce((s, l) => s + (l.totalDays ?? 0), 0);
    const pendingCount = leaveHistory.filter(l => l.status === "PENDING").length;

    const summaryCards = [
      {
        label: "Allocated Leaves", value: "—", sub: "not configured",
        icon: <Calendar size={18} className="text-current" strokeWidth={2} />,
        iconBg: "bg-gray-100", iconColor: "text-gray-400", valueColor: "text-gray-400",
      },
      {
        label: "Leave Balance", value: "—", sub: "not configured",
        icon: <ClipboardList size={18} className="text-current" strokeWidth={2} />,
        iconBg: "bg-indigo-100", iconColor: "text-indigo-500", valueColor: "text-indigo-400",
      },
      {
        label: "Used Leaves", value: totalDays, sub: `${approvedDays}d approved · ${pendingCount} pending`,
        icon: <Clock size={18} className="text-current" strokeWidth={2} />,
        iconBg: "bg-amber-100", iconColor: "text-amber-500", valueColor: "text-amber-700",
      },
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${card.iconBg} ${card.iconColor}`}>
              {card.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{card.label}</p>
              <p className={`text-xl font-bold leading-none ${card.valueColor}`}>{card.value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const totalAllocated = leaveTotals?.totalAllocated ?? balances.reduce((s, b) => s + (b.total ?? 0), 0);
  const approvedUsed   = leaveTotals?.totalUsed      ?? balances.reduce((s, b) => s + (b.used ?? 0), 0);
  const apiBalance     = leaveTotals?.totalBalance   ?? balances.reduce((s, b) => s + (b.remaining ?? 0), 0);

  // Add pending leave days on top of approved used days
  const pendingDays  = leaveHistory.filter(l => l.status === "PENDING").reduce((s, l) => s + (l.totalDays ?? 0), 0);
  const displayUsed  = approvedUsed + pendingDays;
  const displayBalance = Math.max(0, apiBalance - pendingDays);

  const cards = [
    {
      label: "Allocated Leaves",
      value: totalAllocated,
      sub:   "total leaves allocated",
      icon:  <Calendar size={18} className="text-current" strokeWidth={2} />,
      iconBg: "bg-indigo-100", iconColor: "text-indigo-500", valueColor: "text-indigo-700",
    },
    {
      label: "Leave Balance",
      value: displayBalance,
      sub:   `${approvedUsed}d approved · ${pendingDays}d pending`,
      icon:  <CheckCircle2 size={18} className="text-current" strokeWidth={2} />,
      iconBg: "bg-emerald-100", iconColor: "text-emerald-500", valueColor: "text-emerald-700",
    },
    {
      label: "Used Leaves",
      value: displayUsed,
      sub:   pendingDays > 0 ? `${approvedUsed} approved · ${pendingDays} pending` : `${displayBalance} remaining`,
      icon:  <Clock size={18} className="text-current" strokeWidth={2} />,
      iconBg: "bg-amber-100", iconColor: "text-amber-500", valueColor: "text-amber-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(card => (
        <div key={card.label} className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${card.iconBg} ${card.iconColor}`}>
            {card.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{card.label}</p>
            <p className={`text-xl font-bold leading-none ${card.valueColor}`}>{card.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaveBalanceCards;
