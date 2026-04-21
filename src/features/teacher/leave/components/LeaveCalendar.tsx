import type { LeaveCalendarDay } from "../types/leave.types";
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from "lucide-react";
import { LEAVE_TYPE_META } from "../hooks/useLeave";

const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface Props {
  days: LeaveCalendarDay[];
  monthLabel: string;
  onPrev: () => void;
  onNext: () => void;
}

const LeaveCalendar = ({ days, monthLabel, onPrev, onNext }: Props) => {
  // days[0].date tells us year/month; figure out first weekday offset
  const startDow = days.length > 0 ? new Date(days[0].date + "T00:00:00").getDay() : 0;
  const cells: (LeaveCalendarDay | null)[] = [...Array(startDow).fill(null), ...days];

  const getDayClass = (day: LeaveCalendarDay): string => {
    if (day.isToday) return "bg-indigo-600 text-white font-extrabold rounded-lg";
    if (day.isLeave && day.leaveType) {
      const m = LEAVE_TYPE_META[day.leaveType];
      const opacity = day.leaveStatus === "PENDING" ? "opacity-60" : "";
      return `${m.bg} ${m.color} font-bold rounded-lg border ${m.border} ${opacity}`;
    }
    if (day.isHoliday) return "bg-emerald-50 text-emerald-600 font-semibold rounded-lg";
    if (day.isWeekend) return "text-gray-300";
    return "text-gray-700 hover:bg-gray-50 rounded-lg";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-extrabold text-gray-900">Leave Calendar</h3>
        <div className="flex items-center gap-2">
          <button onClick={onPrev}
            className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 transition-colors">
          <ChevronLeftIcon size={14} className="text-current" strokeWidth={2.5} />
          </button>
          <span className="text-xs font-bold text-gray-700 min-w-[100px] text-center">{monthLabel}</span>
          <button onClick={onNext}
            className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 transition-colors">
            <ChevronRightIcon size={14} className="text-current" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-300 py-1">{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((cell, i) => (
          <div key={i}
            title={cell?.isHoliday ? cell.holidayLabel : cell?.isLeave ? LEAVE_TYPE_META[cell.leaveType!]?.label : undefined}
            className={`aspect-square flex items-center justify-center text-[11px] transition-colors cursor-default ${cell ? getDayClass(cell) : ""}`}
          >
            {cell ? parseInt(cell.date.slice(-2)) : ""}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-4 border-t border-gray-100">
        {[
          { label: "Approved Leave", color: "bg-sky-500" },
          { label: "Pending Leave",  color: "bg-sky-200" },
          { label: "Holiday",        color: "bg-emerald-400" },
          { label: "Today",          color: "bg-indigo-600" },
        ].map(({ label, color }) => (
          <span key={label} className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LeaveCalendar;
