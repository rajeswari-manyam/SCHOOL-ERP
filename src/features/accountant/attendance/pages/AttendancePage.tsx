import { ChevronLeft, ChevronRight, CalendarDays, Loader2, AlertCircle } from "lucide-react";
import { useMonthlyAttendance } from "../hooks/useAttendance";
import AttendanceCalendar from "../components/AttendanceCalendar";
import AttendanceSummaryCards from "../components/AttendanceSummaryCards";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <span className="flex items-center gap-1.5 text-xs text-gray-500">
    <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
    {label}
  </span>
);

export default function AttendancePage() {
  const {
    month, year,
    recordsByDate, summary,
    isLoading, isError, refetch,
    prevMonth, nextMonth, goToToday,
  } = useMonthlyAttendance();

  const isCurrentMonth = month === new Date().getMonth() + 1 && year === new Date().getFullYear();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-base font-semibold text-gray-900">My Attendance</h1>
          <p className="text-xs text-gray-400 mt-0.5">View your monthly attendance calendar</p>
        </div>

        {/* Month nav */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition"
          >
            <ChevronLeft size={14} />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 min-w-[180px] justify-center">
            <CalendarDays size={13} className="text-gray-400 shrink-0" />
            <span className="text-sm font-semibold text-gray-800">
              {MONTH_NAMES[month - 1]} {year}
            </span>
          </div>

          <button
            onClick={nextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition"
          >
            <ChevronRight size={14} />
          </button>

          {!isCurrentMonth && (
            <button
              onClick={goToToday}
              className="ml-1 text-xs font-semibold text-indigo-600 underline underline-offset-2 hover:text-indigo-800 transition"
            >
              Today
            </button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      {summary && <AttendanceSummaryCards summary={summary} />}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 px-1">
        <LegendDot color="bg-emerald-500" label="Present" />
        <LegendDot color="bg-red-500" label="Absent" />
        <LegendDot color="bg-amber-500" label="Late" />
        <LegendDot color="bg-blue-500" label="Leave" />
        <LegendDot color="bg-orange-500" label="Half Day" />
      </div>

      {/* Calendar */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 size={18} className="animate-spin text-indigo-500" />
            Loading attendance…
          </div>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center h-64 rounded-2xl border border-red-100 bg-white shadow-sm gap-3">
          <AlertCircle size={28} className="text-red-300" />
          <p className="text-sm text-red-500">Failed to load attendance data.</p>
          <button onClick={() => refetch()} className="text-xs text-indigo-500 underline">Try again</button>
        </div>
      ) : (
        <AttendanceCalendar year={year} month={month} recordsByDate={recordsByDate} />
      )}
    </div>
  );
}
