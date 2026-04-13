import type { RepStatus, PayoutStatus } from "../types/marketing.types";

// ── Rep Avatar ─────────────────────────────────────────────
export const RepAvatar = ({ initials, size = "md" }: { initials: string; size?: "sm" | "md" }) => {
  const sz = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div className={`${sz} rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {initials}
    </div>
  );
};

// ── Attendance Status Badge ────────────────────────────────
const statusStyles: Record<RepStatus, string> = {
  PRESENT:  "bg-emerald-50 text-emerald-600 border border-emerald-200",
  ABSENT:   "bg-red-50 text-red-500 border border-red-200",
  HALF_DAY: "bg-amber-50 text-amber-600 border border-amber-200",
};
const statusDots: Record<RepStatus, string> = {
  PRESENT: "bg-emerald-500", ABSENT: "bg-red-500", HALF_DAY: "bg-amber-400",
};
const statusLabels: Record<RepStatus, string> = {
  PRESENT: "Present", ABSENT: "Absent", HALF_DAY: "Half Day",
};

export const StatusBadge = ({ status }: { status: RepStatus }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${statusDots[status]}`} />
    {statusLabels[status]}
  </span>
);

// ── Payout Status Badge ────────────────────────────────────
const payoutStyles: Record<PayoutStatus, string> = {
  PENDING:  "bg-amber-50 text-amber-600 border border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  PAID:     "bg-indigo-50 text-indigo-600 border border-indigo-200",
};

export const PayoutBadge = ({ status }: { status: PayoutStatus }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${payoutStyles[status]}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
    {status.charAt(0) + status.slice(1).toLowerCase()}
  </span>
);

// ── Achievement % badge ────────────────────────────────────
export const AchievementBadge = ({ pct }: { pct: number }) => {
  const color = pct >= 75 ? "bg-emerald-100 text-emerald-700" : pct >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold ${color}`}>
      {pct}%
    </span>
  );
};
