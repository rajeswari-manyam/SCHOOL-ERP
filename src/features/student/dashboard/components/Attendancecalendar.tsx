import type { AttendanceMonth } from "../types/Student dashboard.types";
import {
  ATTENDANCE_COLORS,
  WEEK_DAYS,
  getMonthStartOffset,
} from "../utils/Student dashboard.utils";

interface AttendanceCalendarProps {
  attendance: AttendanceMonth;
}

const AttendanceCalendar = ({ attendance }: AttendanceCalendarProps) => {
  const { month, year, days, percentage, changeFromLastMonth } = attendance;
  const offset = getMonthStartOffset(year, new Date(`${month} 1, ${year}`).getMonth() + 1);

  // Build grid cells: leading blanks + actual days
  const cells: Array<{ day: number | null; status?: typeof days[number]["status"]; isToday?: boolean }> = [
    ...Array(offset).fill({ day: null }),
    ...days.map((d) => ({ day: d.date, status: d.status, isToday: d.isToday })),
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">
          My Attendance – {month}
        </h2>
        <span className="text-sm font-semibold text-indigo-500">
          {percentage}%
          <span className="ml-1 text-xs text-green-500 font-medium">
            ({changeFromLastMonth >= 0 ? "+" : ""}
            {changeFromLastMonth}%)
          </span>
        </span>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {WEEK_DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-gray-400 pb-1"
          >
            {d}
          </div>
        ))}

        {/* Day cells */}
        {cells.map((cell, i) => {
          if (!cell.day) {
            return <div key={`blank-${i}`} />;
          }

          const colorClass = cell.status
            ? ATTENDANCE_COLORS[cell.status]
            : "text-gray-300";

          return (
            <div
              key={cell.day}
              className={`
                w-8 h-8 mx-auto flex items-center justify-center rounded-full text-xs font-semibold
                ${colorClass}
                ${cell.isToday ? "ring-2 ring-indigo-400 ring-offset-1" : ""}
              `}
            >
              {cell.day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-indigo-700 inline-block" />
          Present
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          Absent
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" />
          Holiday
        </span>
      </div>
    </div>
  );
};

export default AttendanceCalendar;