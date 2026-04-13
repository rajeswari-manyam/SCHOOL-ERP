import type { Plan, SchoolStatus } from "../types/school.types";

// ── Plan Badge ──────────────────────────────────────────────
const planStyles: Record<Plan, string> = {
  PRO:     "bg-gray-900 text-white",
  GROWTH:  "bg-indigo-100 text-indigo-700",
  STARTER: "bg-gray-100 text-gray-600",
};

export const PlanBadge = ({ plan }: { plan: Plan }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide ${planStyles[plan]}`}>
    {plan}
  </span>
);

// ── Status Badge ─────────────────────────────────────────────
const statusStyles: Record<SchoolStatus, { dot: string; text: string; label: string }> = {
  ACTIVE:    { dot: "bg-emerald-500", text: "text-emerald-600", label: "ACTIVE" },
  TRIAL:     { dot: "bg-amber-400",   text: "text-amber-600",   label: "TRIAL" },
  SUSPENDED: { dot: "bg-red-500",     text: "text-red-600",     label: "SUSPENDED" },
  EXPIRED:   { dot: "bg-gray-400",    text: "text-gray-500",    label: "EXPIRED" },
};

export const StatusBadge = ({ status }: { status: SchoolStatus }) => {
  const s = statusStyles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};