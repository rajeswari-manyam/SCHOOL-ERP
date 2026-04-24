
import type { AttendanceMethod, AttendanceStatus } from "../types/attendance.types";
import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: AttendanceStatus }) {
  if (status === "MARKED") {
    return (
      <Badge variant="emerald" className="inline-flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
        Marked
      </Badge>
    );
  }
  return (
    <Badge variant="red" className="inline-flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block animate-pulse" />
      Not Marked
    </Badge>
  );
}

export function MethodBadge({ method }: { method: AttendanceMethod }) {
  if (!method) return <span className="text-gray-300 text-sm">—</span>;
  const isWhatsApp = method === "WhatsApp";
  return (
    <Badge variant={isWhatsApp ? "green" : "blue"} className="inline-flex items-center gap-1.5">
      {isWhatsApp ? "📱" : "🌐"} {method}
    </Badge>
  );
}
