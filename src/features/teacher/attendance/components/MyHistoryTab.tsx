// teacher/attendance/components/MyHistoryTab.tsx
import { useMemo } from "react";
import { format, getDaysInMonth, getDay, startOfMonth } from "date-fns";
import type { AttendanceHistoryEntry } from "../types/attendance.types";

interface MyHistoryTabProps {
  history: AttendanceHistoryEntry[];
  onRequestCorrection: (entry: AttendanceHistoryEntry) => void;
}

// Calendar cell color
const calColor = (entry: AttendanceHistoryEntry | undefined, day: number, month: number, year: number): string => {
  const d = new Date(year, month, day);
  const dow = d.getDay();
  if (dow === 0 || dow === 6) return "bg-gray-50 text-gray-300";       // weekend
  if (!entry || entry.status === null) return "bg-gray-100 text-gray-400"; // no data / future
  if (entry.status === "on_time")  return "bg-emerald-100 text-emerald-700 font-bold";
  if (entry.status === "late")     return "bg-amber-100 text-amber-600 font-bold";
  if (entry.status === "missed")   return "bg-red-100 text-red-500 font-bold";
  return "bg-gray-100 text-gray-400";
};

const METHOD_LABEL: Record<string, string> = { whatsapp: "WhatsApp", web: "Web Form" };
const STATUS_PILL: Record<string, string> = {
  on_time: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  late:    "bg-amber-50 text-amber-700 border border-amber-200",
  missed:  "bg-red-50 text-red-600 border border-red-200",
};

const MyHistoryTab = ({ history, onRequestCorrection }: MyHistoryTabProps) => {
  // Show current month calendar
  const now    = new Date();
  const year   = now.getFullYear();
  const month  = now.getMonth();

  const daysInMonth    = getDaysInMonth(new Date(year, month));
  const firstDayOfWeek = getDay(startOfMonth(new Date(year, month))); // 0=Sun
  const days           = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Build lookup date→entry
  const byDate = useMemo(() => {
    const map: Record<string, AttendanceHistoryEntry> = {};
    history.forEach((e) => { map[e.date] = e; });
    return map;
  }, [history]);

  const getEntry = (d: number) => {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    return byDate[iso];
  };

  const today = now.getDate();

  const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex flex-col gap-6">
      {/* Calendar grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-bold text-gray-800">{format(new Date(year, month), "MMMM yyyy")}</p>
          {/* Legend */}
          <div className="flex items-center gap-4">
            {[
              { color: "bg-emerald-100", label: "On time" },
              { color: "bg-amber-100",   label: "Late" },
              { color: "bg-red-100",     label: "Missed" },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500">
                <span className={`w-3 h-3 rounded-sm ${l.color}`} />
                {l.label}
              </span>
            ))}
          </div>
        </div>

        <div className="px-5 pt-3 pb-5">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wide py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for first week offset */}
            {Array.from({ length: firstDayOfWeek }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {days.map((d) => {
              const entry = getEntry(d);
              const isToday = d === today;
              return (
                <div
                  key={d}
                  title={entry ? `${entry.presentCount}P ${entry.absentCount}A · ${entry.status ?? ""}` : undefined}
                  className={`aspect-square flex items-center justify-center text-xs rounded-xl transition-all
                    ${calColor(entry, d, month, year)}
                    ${isToday ? "ring-2 ring-indigo-400 ring-offset-1" : ""}
                  `}
                >
                  {d}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "On Time",  count: history.filter((h) => h.status === "on_time").length,  cls: "bg-emerald-50 border-emerald-100 text-emerald-700" },
          { label: "Late",     count: history.filter((h) => h.status === "late").length,     cls: "bg-amber-50 border-amber-100 text-amber-700" },
          { label: "Missed",   count: history.filter((h) => h.status === "missed").length,   cls: "bg-red-50 border-red-100 text-red-600" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border px-4 py-3 text-center ${s.cls}`}>
            <p className="text-2xl font-extrabold">{s.count}</p>
            <p className="text-[11px] font-semibold opacity-80 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* History table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-800">Attendance History</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Date", "Class", "Present", "Absent", "Marked At", "Method", "Status", "Action"].map((h) => (
                  <th key={h} className="text-[11px] font-bold uppercase tracking-widest text-gray-400 px-4 py-3 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-gray-400">No history found.</td>
                </tr>
              ) : (
                history.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {format(new Date(entry.date), "dd MMM yyyy")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{entry.classLabel}</td>
                    <td className="px-4 py-3 text-sm font-bold text-emerald-600">{entry.presentCount}</td>
                    <td className="px-4 py-3 text-sm font-bold text-red-500">{entry.absentCount}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {entry.markedAt ?? <span className="text-red-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {entry.method ? (
                        <span className={`text-xs font-semibold ${entry.method === "whatsapp" ? "text-[#25d366]" : "text-indigo-600"}`}>
                          {METHOD_LABEL[entry.method]}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {entry.status ? (
                        <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_PILL[entry.status] ?? "bg-gray-100 text-gray-500"}`}>
                          {entry.status.replace("_", " ")}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {entry.status && entry.status !== null ? (
                        <button
                          onClick={() => onRequestCorrection(entry)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          Correct
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyHistoryTab;