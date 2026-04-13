import type { TemplateCategory, MetaStatus } from "../types/templates.types";

// ── Category Badge ─────────────────────────────────────────
const categoryStyles: Record<TemplateCategory, string> = {
  UTILITY:        "bg-indigo-50 text-indigo-600",
  MARKETING:      "bg-orange-100 text-orange-600",
  AUTHENTICATION: "bg-purple-50 text-purple-600",
};

export const CategoryBadge = ({ category }: { category: TemplateCategory }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide ${categoryStyles[category]}`}>
    {category}
  </span>
);

// ── Meta Status Badge ──────────────────────────────────────
const metaStyles: Record<MetaStatus, { icon: string; text: string; label: string }> = {
  APPROVED: { icon: "✅", text: "text-emerald-600", label: "Approved" },
  PENDING:  { icon: "🕐", text: "text-amber-500",   label: "Pending" },
  REJECTED: { icon: "❌", text: "text-red-500",      label: "Rejected" },
};

export const MetaStatusBadge = ({ status }: { status: MetaStatus }) => {
  const s = metaStyles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${s.text}`}>
      <span className="text-xs">{s.icon}</span>
      {s.label}
    </span>
  );
};
