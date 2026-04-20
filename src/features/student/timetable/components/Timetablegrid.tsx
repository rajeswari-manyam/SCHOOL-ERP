import type { TimetableRow, DayName } from "../types/Classtimetable.types";
import {
  WEEK_DAYS,
  SUBJECT_CELL_COLORS,
  SUBJECT_BG_COLORS,
  isPeriodNow,
} from "../utils/Classtimetable.utils";

interface TimetableGridProps {
  rows: TimetableRow[];
  todayDay: DayName;
  onPrint?: () => void;
}

const TimetableGrid = ({ rows, todayDay, onPrint }: TimetableGridProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <div>
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
          My Class Timetable
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">Academic Year 2024-25</p>
      </div>
      <button
        onClick={onPrint}
        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors"
      >
        🖨 Print Timetable
      </button>
    </div>

    {/* Grid */}
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        {/* Column headers */}
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="py-3 px-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wide w-16">
              Period
            </th>
            <th className="py-3 px-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wide w-28">
              Time
            </th>
            {WEEK_DAYS.map((day) => (
              <th
                key={day}
                className={`py-3 px-4 text-left text-xs font-bold uppercase tracking-wide ${
                  day === todayDay
                    ? "text-indigo-600"
                    : "text-gray-400"
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <span>{day.toUpperCase()}</span>
                  {day === todayDay && (
                    <span className="inline-block px-2 py-0.5 bg-indigo-600 text-white text-[10px] rounded-full font-bold w-fit">
                      TODAY
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, idx) => {
            if (row.kind === "break") {
              return (
                <tr key={`break-${idx}`} className="bg-amber-50 border-y border-amber-100">
                  <td colSpan={8} className="py-2 px-4 text-center text-xs font-bold tracking-widest text-amber-600 uppercase">
                    {row.label} &nbsp;·&nbsp; {row.startTime} – {row.endTime}
                  </td>
                </tr>
              );
            }

            const isNow = isPeriodNow(row.startTime, row.endTime);

            return (
              <tr
                key={`period-${row.periodNumber}`}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                {/* Period number */}
                <td className="py-4 px-4 font-bold text-gray-500 text-sm">
                  {row.periodNumber}
                </td>

                {/* Time */}
                <td className="py-4 px-4 text-gray-400 text-xs font-medium whitespace-nowrap">
                  {row.startTime}–{row.endTime}
                </td>

                {/* Day cells */}
                {WEEK_DAYS.map((day) => {
                  const cell = row.days[day];
                  const subjectColor = SUBJECT_CELL_COLORS[cell.subject] ?? "text-gray-600";
                  const subjectBg = SUBJECT_BG_COLORS[cell.subject] ?? "bg-gray-50";
                  const isToday = day === todayDay;
                  const isActive = isToday && isNow;

                  return (
                    <td key={day} className="py-3 px-4">
                      <div
                        className={`rounded-xl px-3 py-2 inline-block min-w-[100px] transition-all ${
                          isActive
                            ? "ring-2 ring-indigo-400 bg-indigo-50"
                            : isToday
                            ? subjectBg
                            : "bg-transparent"
                        }`}
                      >
                        <p className={`font-bold text-sm leading-tight ${subjectColor}`}>
                          {cell.subject}
                          {isActive && (
                            <span className="ml-1.5 align-middle inline-block px-1.5 py-0.5 bg-green-500 text-white text-[9px] rounded-full font-bold">
                              NOW
                            </span>
                          )}
                        </p>
                        {cell.teacher && (
                          <p className="text-xs text-gray-400 mt-0.5">{cell.teacher}</p>
                        )}
                        {cell.note && !cell.teacher && (
                          <p className="text-xs text-gray-400 mt-0.5">{cell.note}</p>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default TimetableGrid;