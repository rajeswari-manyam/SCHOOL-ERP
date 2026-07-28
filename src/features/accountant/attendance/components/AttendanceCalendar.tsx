import { useMemo } from "react";
import type { AttendanceDayRecord } from "../types/attendance.types";

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  present: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  absent:  { bg: "bg-red-50 border-red-200",         text: "text-red-700",    dot: "bg-red-500" },
  late:    { bg: "bg-amber-50 border-amber-200",     text: "text-amber-700",  dot: "bg-amber-500" },
  leave:   { bg: "bg-blue-50 border-blue-200",       text: "text-blue-700",   dot: "bg-blue-500" },
  halfday: { bg: "bg-orange-50 border-orange-200",   text: "text-orange-700", dot: "bg-orange-500" },
};

const STATUS_LABELS: Record<string, string> = {
  present: "Present",
  absent:  "Absent",
  late:    "Late",
  leave:   "Leave",
  halfday: "Half Day",
};

interface CalendarGridProps {
  year: number;
  month: number;
  recordsByDate: Record<string, AttendanceDayRecord>;
}

export default function AttendanceCalendar({ year, month, recordsByDate }: CalendarGridProps) {
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDow = (firstDay.getDay() + 6) % 7; // Monday = 0

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const days = useMemo(() => {
    const result: { day: number; dateStr: string; record: AttendanceDayRecord | null; isToday: boolean; isFuture: boolean }[] = [];

    for (let i = 0; i < startDow; i++) {
      result.push({ day: 0, dateStr: "", record: null, isToday: false, isFuture: true });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      result.push({
        day: d,
        dateStr,
        record: recordsByDate[dateStr] ?? null,
        isToday: dateStr === todayStr,
        isFuture: dateStr > todayStr,
      });
    }

    return result;
  }, [year, month, daysInMonth, startDow, recordsByDate, todayStr]);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Header row */}
      <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="px-2 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((cell, idx) => {
          if (cell.day === 0) {
            return <div key={`empty-${idx}`} className="h-24 border-b border-r border-gray-50 bg-gray-50/30" />;
          }

          const style = cell.record ? STATUS_STYLES[cell.record.status] : null;

          return (
            <div
              key={cell.dateStr}
              className={[
                "relative h-24 border-b border-r border-gray-50 p-1.5 transition-colors",
                cell.isToday ? "bg-indigo-50/40" : "bg-white",
                cell.isFuture ? "opacity-40" : "",
              ].join(" ")}
            >
              {/* Day number */}
              <span
                className={[
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                  cell.isToday ? "bg-indigo-600 text-white" : "text-gray-700",
                ].join(" ")}
              >
                {cell.day}
              </span>

              {/* Status chip */}
              {cell.record && !cell.isFuture && (
                <div className="mt-1">
                  <div className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 ${style?.bg ?? "bg-gray-50 border-gray-200"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${style?.dot ?? "bg-gray-400"}`} />
                    <span className={`text-[9px] font-bold uppercase tracking-wide ${style?.text ?? "text-gray-500"}`}>
                      {STATUS_LABELS[cell.record.status] ?? cell.record.status}
                    </span>
                  </div>
                  {cell.record.remarks && (
                    <p className="mt-0.5 truncate text-[9px] text-gray-400">{cell.record.remarks}</p>
                  )}
                </div>
              )}

              {/* Working day indicator for unmarked future-ish days */}
              {!cell.record && cell.record === null && !cell.isFuture && cell.day > 0 && (
                <div className="mt-1">
                  <span className="text-[9px] font-medium text-gray-300">—</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
