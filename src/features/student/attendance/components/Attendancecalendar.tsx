import type { MonthAttendance, AttendanceStatus } from "../types/Attendance.types";
import {
  getMonthStartOffset,
  getDaysInMonth,
  ATTENDANCE_CELL_STYLES,
} from "../utils/Attendance.utils";

interface AttendanceCalendarProps {
  data: MonthAttendance;
  onPrev: () => void;
  onNext: () => void;
  label: string;
}

const WEEK_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const LEGEND: { status: AttendanceStatus; label: string }[] = [
  { status: "PRESENT", label: "Present" },
  { status: "ABSENT",  label: "Absent"  },
  { status: "HOLIDAY", label: "Holiday" },
];

const DOT_COLORS: Record<AttendanceStatus, string> = {
  PRESENT: "bg-indigo-600",
  ABSENT:  "bg-red-500",
  HOLIDAY: "bg-gray-300",
  NONE:    "bg-transparent",
};

const AttendanceCalendar = ({
  data,
  
  label,
}: AttendanceCalendarProps) => {
  const statusMap = new Map<number, AttendanceStatus>();
  data.days.forEach((d) => statusMap.set(d.date, d.status as AttendanceStatus));

  const offset = getMonthStartOffset(data.year, new Date(`${data.month} 1, ${data.year}`).getMonth() + 1);
  const totalDays = getDaysInMonth(data.year, new Date(`${data.month} 1, ${data.year}`).getMonth() + 1);

  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  return (
    <div className="bg-white rounded-xl border p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-900">
          Monthly Attendance Calendar — {label}
        </h2>
        {/* Legend */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
          {LEGEND.map((l) => (
            <span key={l.status} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${DOT_COLORS[l.status]}`} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      {/* Week-day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const status: AttendanceStatus = statusMap.get(day) ?? "NONE";
          return (
            <div
              key={day}
              className={`flex items-center justify-center rounded-full w-9 h-9 mx-auto text-sm font-semibold
                ${ATTENDANCE_CELL_STYLES[status]}`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Mobile legend */}
      <div className="flex sm:hidden items-center gap-4 text-xs text-gray-500 mt-3 pt-3 border-t">
        {LEGEND.map((l) => (
          <span key={l.status} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${DOT_COLORS[l.status]}`} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AttendanceCalendar;