import type { Student, AttendanceDay } from "../types/my-students.types";
import { Info } from "lucide-react";

const DAY_LABELS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const MONTH_LABEL = "April 2025";

const AttendanceTab = ({ student }: { student: Student }) => {
  const days: AttendanceDay[] = student.attendanceDays;
  const present = days.filter((d) => d.status === "PRESENT").length;
  const absent  = days.filter((d) => d.status === "ABSENT").length;

  // Build calendar grid (April 2025 starts on Tuesday — index 2)
  const startDow = new Date("2025-04-01").getDay();
  const cells: (AttendanceDay | null)[] = [
    ...Array(startDow).fill(null),
    ...days,
  ];

  const cellColor = (d: AttendanceDay) => {
    if (d.status === "PRESENT")  return "bg-emerald-100 text-emerald-700";
    if (d.status === "ABSENT")   return "bg-red-100 text-red-600";
    if (d.status === "HALF_DAY") return "bg-amber-100 text-amber-600";
    if (d.status === "HOLIDAY")  return "bg-indigo-50 text-indigo-300";
    return "bg-gray-50 text-gray-300"; // SUNDAY
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Present", value: present, color: "text-emerald-600 bg-emerald-50" },
          { label: "Absent",  value: absent,  color: "text-red-500 bg-red-50"        },
          { label: "This Month", value: `${student.attendancePct}%`,
            color: student.attendancePct < 75 ? "text-red-500 bg-red-50" : "text-indigo-600 bg-indigo-50" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl p-3 text-center ${color}`}>
            <p className="text-xl font-extrabold">{value}</p>
            <p className="text-[10px] font-semibold opacity-70 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Mini calendar */}
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
            <div key={i} className={`aspect-square flex items-center justify-center rounded-md text-[11px] font-semibold ${cell ? cellColor(cell) : ""}`}>
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

      {/* Read-only note */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <Info size={14} className="text-amber-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
        <p className="text-[11px] text-amber-700">Attendance is read-only here. To mark or edit attendance, go to the <strong>Attendance</strong> section.</p>
      </div>
    </div>
  );
};

export default AttendanceTab;
