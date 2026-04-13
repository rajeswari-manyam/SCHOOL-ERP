import type { ReportFormat, ReportStatus } from "../types/reports.types";

const formatStyles: Record<ReportFormat, string> = {
  PDF:  "bg-gray-100 text-gray-700",
  XLSX: "bg-amber-100 text-amber-700",
  CSV:  "bg-blue-100 text-blue-700",
};

export const FormatBadge = ({ format }: { format: ReportFormat }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide ${formatStyles[format]}`}>
    {format}
  </span>
);

export const StatusBadge = ({ status }: { status: ReportStatus }) => {
  const map: Record<ReportStatus, { dot: string; text: string; label: string }> = {
    READY:      { dot: "bg-emerald-500", text: "text-emerald-700 bg-emerald-50", label: "Ready" },
    GENERATING: { dot: "bg-amber-400",   text: "text-amber-700 bg-amber-50",   label: "Generating" },
    FAILED:     { dot: "bg-red-500",     text: "text-red-600 bg-red-50",        label: "Failed" },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};
