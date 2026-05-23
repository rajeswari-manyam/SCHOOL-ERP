import type { ReportFormat, ReportType } from "../types/reports.types";

export const FormatBadge = ({ format }: { format: ReportFormat }) => {
  const map: Record<ReportFormat, string> = {
    PDF: "text-red-600 font-bold text-xs",
    CSV: "text-emerald-600 font-bold text-xs",
  };
  return <span className={map[format]}>{format}</span>;
};

export const ReportTypeBadge = ({ type }: { type: ReportType }) => {
  const map: Record<ReportType, { label: string; cls: string }> = {
    ATTENDANCE: { label: "Attendance", cls: "bg-indigo-50 text-indigo-700 border border-indigo-200" },
    FEE_COLLECTION: { label: "Fee", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    STUDENT: { label: "Student", cls: "bg-blue-50 text-blue-700 border border-blue-200" },
    WHATSAPP_ACTIVITY: { label: "WhatsApp", cls: "bg-green-50 text-green-700 border border-green-200" },
    ADMISSIONS: { label: "Admissions", cls: "bg-violet-50 text-violet-700 border border-violet-200" },
    STAFF: { label: "Staff", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  };
  const { label, cls } = map[type];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      {label}
    </span>
  );
};

export const PeriodPill = ({ period, active, onClick }: { period: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors border ${
      active
        ? "bg-indigo-600 text-white border-indigo-600"
        : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
    }`}
  >
    {period}
  </button>
);

export const AutoBadge = ({ label, color }: { label: string; color: string }) => {
  const cls =
    color === "emerald"
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
      : "bg-green-50 text-green-700 border border-green-200";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      {color === "green" && <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />}
      {label}
    </span>
  );
};