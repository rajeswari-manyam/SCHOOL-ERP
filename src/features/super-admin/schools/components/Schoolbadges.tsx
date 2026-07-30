import type { Plan, SchoolStatus } from "../types/school.types";

// ── Plan Badge ──────────────────────────────────────────────
const planStyles: Record<Plan, string> = {
  PRO:     "bg-blue-100 text-blue-700",
  GROWTH:  "bg-violet-100 text-violet-700",
  STARTER: "bg-gray-100 text-gray-600",
};

export const PlanBadge = ({ plan }: { plan: Plan }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide ${planStyles[plan]}`}>
    {plan}
  </span>
);

// ── Status Badge ─────────────────────────────────────────────
// ACTIVE/SUSPENDED/EXPIRED render as a small dot + label; TRIAL renders as
// a filled pill instead, matching the design's distinct "needs attention" look.
const statusStyles: Record<SchoolStatus, { dot: string; text: string; label: string }> = {
  ACTIVE:    { dot: "bg-emerald-500", text: "text-emerald-600", label: "Active" },
  TRIAL:     { dot: "bg-amber-400",   text: "text-amber-600",   label: "Trial" },
  SUSPENDED: { dot: "bg-red-500",     text: "text-red-600",     label: "Suspended" },
  EXPIRED:   { dot: "bg-gray-400",    text: "text-gray-500",    label: "Expired" },
};

export const StatusBadge = ({ status }: { status: SchoolStatus }) => {
  if (status === "TRIAL") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide bg-amber-100 text-amber-700">
        Trial
      </span>
    );
  }
  const s = statusStyles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};