import type { AttendanceDay } from "../types/dashboard.types";

interface Props {
  data: AttendanceDay[];
  today?: number;
  monthLabel?: string;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const AttendanceCalendar = ({ data, today = 24, monthLabel = "My Attendance – April" }: Props) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">{monthLabel}</h3>
      </div>

      {/* Day name headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-[10px] text-gray-400 font-medium py-0.5">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {data.map((entry, idx) => {
          const isToday = entry.day === today;

          if (entry.status === "empty") {
            return (
              <div key={idx} className="aspect-square flex items-center justify-center" />
            );
          }

          const baseClasses = "aspect-square rounded-full flex items-center justify-center text-[11px] font-medium transition-all";
          const todayRing = isToday ? "ring-2 ring-blue-500 ring-offset-1" : "";

          if (entry.status === "present") {
            return (
              <div key={idx} className={`${baseClasses} bg-blue-500 text-white ${todayRing}`}>
                {entry.day}
              </div>
            );
          }

          if (entry.status === "absent") {
            return (
              <div key={idx} className={`${baseClasses} bg-red-500 text-white ${todayRing}`}>
                {entry.day}
              </div>
            );
          }

          // holiday
          return (
            <div key={idx} className={`${baseClasses} border border-gray-200 text-gray-400 ${todayRing}`}>
              {entry.day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-[11px] text-gray-400">Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-[11px] text-gray-400">Absent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border border-gray-300" />
          <span className="text-[11px] text-gray-400">Holiday</span>
        </div>
      </div>
    </div>
  );
};
