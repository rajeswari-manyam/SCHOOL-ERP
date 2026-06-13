import { useQuery } from "@tanstack/react-query";
import { getMonthlyAttendance } from "../../../../services/attendance.api";
import { Info, Loader2, AlertCircle } from "lucide-react";
import type { Student } from "../types/my-students.types";

const DAY_LABELS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const now = new Date();
const CUR_YEAR = now.getFullYear();
const CUR_MONTH = now.getMonth() + 1; // 1-indexed
const MONTH_LABEL = now.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

const normalizeToAttendanceDay = (
  records: { date: string; status: string }[],
  year: number,
  month: number,
): { date: string; status: string }[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const lookup: Record<number, string> = {};

  for (const r of records) {
    const d = new Date(r.date).getDate();
    const s = r.status?.toLowerCase();
    if (s === "present") lookup[d] = "PRESENT";
    else if (s === "absent") lookup[d] = "ABSENT";
    else if (s === "half_day" || s === "half-day") lookup[d] = "HALF_DAY";
    else lookup[d] = "HOLIDAY";
  }

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const todayDate = today.getDate();

  const result: { date: string; status: string }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dow = new Date(year, month - 1, d).getDay();

    if (dow === 0) {
      result.push({ date: dateStr, status: "SUNDAY" });
    } else if (isCurrentMonth && d > todayDate) {
      result.push({ date: dateStr, status: "" });
    } else if (lookup[d]) {
      result.push({ date: dateStr, status: lookup[d] });
    } else if (dow === 6 && !lookup[d]) {
      result.push({ date: dateStr, status: "HOLIDAY" });
    } else {
      result.push({ date: dateStr, status: "" });
    }
  }
  return result;
};

const cellColor = (status: string) => {
  if (status === "PRESENT")  return "bg-emerald-100 text-emerald-700";
  if (status === "ABSENT")   return "bg-red-100 text-red-600";
  if (status === "HALF_DAY") return "bg-amber-100 text-amber-600";
  if (status === "HOLIDAY")  return "bg-indigo-50 text-indigo-300";
  if (status === "SUNDAY")   return "bg-gray-50 text-gray-300";
  return "bg-transparent";
};

const AttendanceTab = ({ student }: { student: Student }) => {
  const { data: apiRecords = [], isLoading, isError } = useQuery({
    queryKey: ["teacher", "attendance", student.id, CUR_YEAR, CUR_MONTH],
    queryFn: () => getMonthlyAttendance({ studentId: student.id, month: CUR_MONTH, year: CUR_YEAR }),
    staleTime: 30_000,
    retry: 1,
  });

  const days = normalizeToAttendanceDay(apiRecords, CUR_YEAR, CUR_MONTH);
  const present = days.filter((d) => d.status === "PRESENT").length;
  const absent  = days.filter((d) => d.status === "ABSENT").length;

  // Build calendar grid offset by first day of month
  const startDow = new Date(CUR_YEAR, CUR_MONTH - 1, 1).getDay();
  const cells: ({ date: string; status: string } | null)[] = [
    ...Array(startDow).fill(null),
    ...days,
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Present", value: isLoading ? "…" : present, color: "text-emerald-600 bg-emerald-50" },
          { label: "Absent",  value: isLoading ? "…" : absent,  color: "text-red-500 bg-red-50" },
          { label: "This Month", value: isLoading ? "…" : `${student.attendancePct}%`,
            color: student.attendancePct < 75 ? "text-red-500 bg-red-50" : "text-indigo-600 bg-indigo-50" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl p-3 text-center ${color}`}>
            <p className="text-xl font-extrabold">{value}</p>
            <p className="text-[10px] font-semibold opacity-70 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-400">
          <Loader2 size={14} className="animate-spin" />
          Loading attendance…
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600">
          <AlertCircle size={14} className="shrink-0" />
          Could not load attendance data.
        </div>
      )}

      {/* Mini calendar */}
      {!isLoading && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">{MONTH_LABEL}</p>
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_LABELS.map((d) => (
              <div key={d} className="text-center text-[10px] font-bold text-gray-300 py-1">{d}</div>
            ))}
          </div>
          {/* Cells */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((cell, i) => (
              <div key={i} className={`aspect-square flex items-center justify-center rounded-md text-[11px] font-semibold ${cell ? cellColor(cell.status) : ""}`}>
                {cell ? parseInt(cell.date.slice(-2)) : ""}
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-3">
            {[
              { label: "Present",  color: "bg-emerald-100" },
              { label: "Absent",   color: "bg-red-100"     },
              { label: "Holiday",  color: "bg-indigo-50"   },
            ].map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1 text-[10px] text-gray-400">
                <span className={`w-3 h-3 rounded-sm ${color}`} /> {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Read-only note */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <Info size={14} className="text-amber-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
        <p className="text-[11px] text-amber-700">Attendance is read-only here. To mark or edit attendance, go to the <strong>Attendance</strong> section.</p>
      </div>
    </div>
  );
};

export default AttendanceTab;