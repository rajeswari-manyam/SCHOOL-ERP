import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MonthlyAttendanceResponse, YearlyAttendanceResponse, StudentTodayAttendanceResponse } from "@/services/attendance.api";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type CellStatus = "present" | "absent" | null;

interface CalendarCell {
  day: number;
  status: CellStatus;
}

const buildCalendarCells = (
  year: number,
  month: number,
  presentDates: string[],
  absentDates: string[],
): (CalendarCell | null)[] => {
  const presentSet = new Set(presentDates);
  const absentSet = new Set(absentDates);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayJs = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const offset = (firstDayJs + 6) % 7; // convert to Mon=0 grid

  const cells: (CalendarCell | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const status: CellStatus = presentSet.has(dateStr)
      ? "present"
      : absentSet.has(dateStr)
      ? "absent"
      : null;
    cells.push({ day: d, status });
  }
  return cells;
};

const DayCell = ({ cell }: { cell: CalendarCell | null }) => {
  if (!cell) return <div className="w-8 h-8" />;
  const cls =
    cell.status === "present"
      ? "bg-emerald-500 text-white"
      : cell.status === "absent"
      ? "bg-red-400 text-white"
      : "bg-gray-100 text-gray-400";
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${cls}`}>
      {cell.day}
    </div>
  );
};

interface Props {
  todayData: StudentTodayAttendanceResponse | null;
  todayLoading: boolean;
  monthlyData: MonthlyAttendanceResponse | null;
  yearlyData: YearlyAttendanceResponse | null;
  viewMonth: number;
  viewYear: number;
  monthlyLoading: boolean;
  prevMonth: () => void;
  nextMonth: () => void;
}

const StudentAttendanceTab = ({
  todayData,
  todayLoading,
  monthlyData,
  yearlyData,
  viewMonth,
  viewYear,
  monthlyLoading,
  prevMonth,
  nextMonth,
}: Props) => {
  const presentDates = monthlyData?.summary?.present_dates ?? [];
  const absentDates = monthlyData?.summary?.absent_dates ?? [];
  const monthPresent = monthlyData?.summary?.present ?? 0;
  const monthAbsent = monthlyData?.summary?.absent ?? 0;
  const yearPresent = yearlyData?.summary?.present ?? 0;
  const yearTotal = yearlyData?.summary?.total ?? 0;

  const cells = buildCalendarCells(viewYear, viewMonth, presentDates, absentDates);

  const rows: (CalendarCell | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    const row = cells.slice(i, i + 7) as (CalendarCell | null)[];
    while (row.length < 7) row.push(null);
    rows.push(row);
  }

  const absenceRecords = (yearlyData?.records ?? []).filter((r) => r.status === "absent");

  const todayPresent = todayData?.summary?.present ?? 0;
  const todayAbsent = todayData?.summary?.absent ?? 0;
  const todayStatus = todayPresent > 0 ? "present" : todayAbsent > 0 ? "absent" : null;

  return (
    <div className="space-y-6">
      {/* Today's Attendance */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
        {todayLoading ? (
          <div className="flex items-center gap-3 w-full">
            <div className="w-12 h-12 rounded-xl bg-gray-100 animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-100 rounded animate-pulse w-24" />
              <div className="h-4 bg-gray-100 rounded animate-pulse w-32" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl ${
                todayStatus === "present" ? "bg-emerald-50" :
                todayStatus === "absent" ? "bg-red-50" : "bg-gray-50"
              }`}>
                {todayStatus === "present" ? "✅" : todayStatus === "absent" ? "❌" : "—"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">Today's Attendance</p>
                <p className={`text-lg font-extrabold mt-0.5 ${
                  todayStatus === "present" ? "text-emerald-600" :
                  todayStatus === "absent" ? "text-red-500" : "text-gray-400"
                }`}>
                  {todayStatus === "present" ? "Present" : todayStatus === "absent" ? "Absent" : "Not Marked"}
                </p>
                {todayData?.date && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(todayData.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-4 text-center flex-shrink-0 pl-16 sm:pl-0">
              <div>
                <p className="text-xs text-gray-400">Present</p>
                <p className="text-base font-bold text-emerald-600">{todayData?.summary?.present ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Absent</p>
                <p className="text-base font-bold text-red-500">{todayData?.summary?.absent ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Total</p>
                <p className="text-base font-bold text-gray-700">{todayData?.summary?.total ?? 0}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-bold text-gray-800">{MONTH_NAMES[viewMonth - 1]} {viewYear}</h3>
          <Button variant="ghost" size="sm" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4">
          {[["bg-emerald-500", "Present"], ["bg-red-400", "Absent"], ["bg-gray-100", "No data"]].map(([c, l]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${c}`} />
              <span className="text-xs text-gray-500">{l}</span>
            </div>
          ))}
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">{d}</div>
          ))}
        </div>

        {monthlyLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-1">
            {rows.map((row, i) => (
              <div key={i} className="grid grid-cols-7 gap-1">
                {row.map((cell, j) => (
                  <div key={j} className="flex justify-center">
                    <DayCell cell={cell} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "This Month", val: monthPresent, sub: "Present", cls: "text-emerald-600" },
          { label: "This Month", val: monthAbsent, sub: "Absent", cls: "text-red-500" },
          { label: "This Month", val: (monthlyData?.summary?.total ?? 0) - monthPresent - monthAbsent, sub: "Unmarked", cls: "text-amber-500" },
          { label: "This Year", val: yearTotal > 0 ? `${yearPresent}/${yearTotal}` : "—", sub: "Total", cls: "text-gray-700" },
        ].map(({ label, val, sub, cls }) => (
          <div key={sub} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{label}</p>
            <p className={`text-2xl font-extrabold mt-1 ${cls}`}>{val}</p>
            <p className="text-xs text-gray-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Absence history */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h4 className="font-bold text-gray-800 mb-4">Absence History — This Year</h4>
        <div className="border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 py-2 text-[10px] uppercase tracking-widest font-bold text-gray-400">
            <span>Date</span>
            <span>Day</span>
            <span>Reason</span>
          </div>
          {absenceRecords.length === 0 ? (
            <p className="py-4 text-center text-xs text-gray-400">No absences recorded this year.</p>
          ) : (
            absenceRecords.map((r) => {
              const d = new Date(r.date);
              const dayName = d.toLocaleDateString("en-IN", { weekday: "long" });
              const dateLabel = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
              return (
                <div key={r.id} className="grid grid-cols-3 gap-4 py-2.5 text-sm text-gray-700 border-t border-gray-50">
                  <span>{dateLabel}</span>
                  <span>{dayName}</span>
                  <span className="text-gray-400">{r.reason || "—"}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceTab;
