
import type { AttendanceMethod, AttendanceStatus } from "../types/attendance.types";

export function StatusBadge({ status }: { status: AttendanceStatus }) {
  if (status === "MARKED") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
        Marked
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block animate-pulse" />
      Not Marked
    </span>
  );
}

export function MethodBadge({ method }: { method: AttendanceMethod }) {
  if (!method) return <span className="text-gray-300 text-sm">—</span>;
  const isWhatsApp = method === "WhatsApp";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
        isWhatsApp
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-blue-50 text-blue-700 border-blue-200"
      }`}
    >
      {isWhatsApp ? "📱" : "🌐"} {method}
    </span>
  );
}
