import type { SupportTicketPriority } from "@/services/support-ticket.api";

// ── Priority Badge ─────────────────────────────────────────
const priorityStyles: Record<SupportTicketPriority, string> = {
  urgent: "border border-red-400 text-red-500 bg-white",
  high:   "border border-amber-400 text-amber-600 bg-white",
  medium: "bg-indigo-50 text-indigo-500 border border-indigo-200",
  low:    "bg-gray-100 text-gray-500 border border-gray-200",
};

export const PriorityBadge = ({ priority }: { priority: string }) => {
  const key = priority.toLowerCase() as SupportTicketPriority;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide capitalize ${priorityStyles[key] ?? priorityStyles.low}`}>
      {priority}
    </span>
  );
};

// ── Status Badge ───────────────────────────────────────────
const statusTextStyles: Record<string, string> = {
  open: "text-red-500",
  in_progress: "text-amber-500",
  resolved: "text-emerald-600",
  closed: "text-gray-500",
};

export const StatusBadge = ({ status }: { status: string }) => {
  const label = status.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${statusTextStyles[status] ?? "text-gray-500"}`}>
      {label}
    </span>
  );
};

// ── Inline stat pill (header) ─────────────────────────────
const pillStyles = {
  open:       "border border-red-200 text-red-600 bg-white",
  inProgress: "border border-amber-200 text-amber-600 bg-white",
  resolved:   "border border-emerald-200 text-emerald-600 bg-emerald-50",
};
const pillDots = {
  open:       "bg-red-500",
  inProgress: "bg-amber-400",
  resolved:   "bg-emerald-500",
};

export const StatPill = ({
  variant, label, count,
}: { variant: "open" | "inProgress" | "resolved"; label: string; count: number }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${pillStyles[variant]}`}>
    <span className={`w-2 h-2 rounded-full ${pillDots[variant]}`} />
    {label}: {count}
  </span>
);
