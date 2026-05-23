import type { LeaveCalendarDay } from "../types/leave.types";
import { LEAVE_TYPE_META } from "../hooks/useLeave";

const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface Props {
  days: LeaveCalendarDay[];
  monthLabel: string;
}

const LeaveCalendarPreview = ({ days, monthLabel }: Props) => {
  if (days.length === 0) return null;

  const startDow = new Date(days[0].date + "T00:00:00").getDay();
  const cells: (LeaveCalendarDay | null)[] = [...Array(startDow).fill(null), ...days];

  const getDayClass = (day: LeaveCalendarDay): string => {
    if (day.isToday) return "bg-indigo-600 text-white font-bold rounded-md";
    if (day.isLeave && day.leaveType) {
      const m = LEAVE_TYPE_META[day.leaveType];
      return `${m.bg} ${m.color} font-bold rounded-md border ${m.border}`;
    }
    if (day.isHoliday) return "bg-emerald-50 text-emerald-500 rounded-md";
    if (day.isWeekend) return "text-gray-300";
    return "text-gray-600";
  };

  return (
    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
      <p className="text-[11px] font-bold text-gray-500 mb-2 text-center">{monthLabel}</p>
      <div className="grid grid-cols-7 mb-0.5">
        {DAY_HEADERS.map(d => (
          <div key={d} className="text-center text-[9px] font-bold text-gray-300">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px">
        {cells.map((cell, i) => (
          <div key={i}
            className={`aspect-square flex items-center justify-center text-[10px] transition-colors ${cell ? getDayClass(cell) : ""}`}>
            {cell ? parseInt(cell.date.slice(-2)) : ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveCalendarPreview;
