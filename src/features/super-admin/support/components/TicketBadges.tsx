import type { TicketPriority, TicketStatus } from "../types/support.types";

// ── Priority Badge ─────────────────────────────────────────
const priorityStyles: Record<TicketPriority, string> = {
  URGENT: "border border-red-400 text-red-500 bg-white",
  HIGH:   "border border-amber-400 text-amber-600 bg-white",
  MEDIUM: "bg-indigo-50 text-indigo-500 border border-indigo-200",
  LOW:    "bg-gray-100 text-gray-500 border border-gray-200",
};

export const PriorityBadge = ({ priority }: { priority: TicketPriority }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${priorityStyles[priority]}`}>
    {priority}
  </span>
);

// ── Status Badge ───────────────────────────────────────────
const statusStyles: Record<TicketStatus, { dot: string; text: string; label: string }> = {
  OPEN:        { dot: "bg-red-500",     text: "text-red-500",     label: "Open" },
  IN_PROGRESS: { dot: "bg-amber-400",   text: "text-amber-500",   label: "In Progress" },
  RESOLVED:    { dot: "bg-emerald-500", text: "text-emerald-600", label: "Resolved" },
  CLOSED:      { dot: "bg-gray-400",    text: "text-gray-500",    label: "Closed" },
};

export const StatusBadge = ({ status }: { status: TicketStatus }) => {
  const s = statusStyles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${s.text}`}>
      {status === "IN_PROGRESS" ? (
        <span className="text-amber-500 font-semibold leading-tight">
          In<br />Progress
        </span>
      ) : (
        s.label
      )}
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
