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
  onDownload?: () => void;
  downloading?: boolean;
  title?: string;
}

const TimetableGrid = ({
  rows,
  todayDay,
  onPrint,
  onDownload,
  downloading,
  title = "My Class Timetable",
}: TimetableGridProps) => (
  <div className="
    bg-white rounded-2xl border border-gray-100 shadow-sm
    overflow-hidden transition-all duration-200
    hover:border-indigo-200 hover:shadow-sm
  ">

    {/* ================= HEADER ================= */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100">

      <div>
        <h1 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight">
          {title}
        </h1>
        <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
          Academic Year 2024-25
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <button
          onClick={onPrint}
          className="
            w-full sm:w-auto flex items-center justify-center gap-2
            px-4 py-2 text-xs font-semibold
            text-indigo-600 border border-indigo-200
            rounded-xl transition-all duration-200
            hover:bg-indigo-50 hover:border-indigo-300
            active:scale-[0.98]
          "
        >
          🖨 Print Timetable
        </button>

        {onDownload && (
          <button
            onClick={onDownload}
            disabled={downloading}
            className="
              w-full sm:w-auto flex items-center justify-center gap-2
              px-4 py-2 text-xs font-semibold
              text-indigo-600 border border-indigo-200
              rounded-xl transition-all duration-200
              hover:bg-indigo-50 hover:border-indigo-300
              active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {downloading ? "Downloading…" : "⬇ Download Timetable"}
          </button>
        )}
      </div>

    </div>

    {/* ================= MOBILE VIEW ================= */}
    <div className="block lg:hidden p-4 space-y-4">

      {rows.map((row, idx) => {

        if (row.kind === "break") {
          return (
            <div
              key={`break-mobile-${idx}`}
              className="
                bg-amber-50 border border-amber-100
                rounded-xl px-4 py-3 text-center
              "
            >
              <p className="text-xs font-bold tracking-widest text-amber-600 uppercase">
                {row.label}
              </p>
              <p className="text-[11px] text-amber-500 mt-1">
                {row.startTime} – {row.endTime}
              </p>
            </div>
          );
        }

        const isNow = isPeriodNow(row.startTime, row.endTime);

        return (
          <div
            key={`mobile-period-${row.periodNumber}`}
            className="
              border border-gray-100 rounded-2xl overflow-hidden bg-white
              transition-all duration-200
              hover:border-indigo-200
              hover:shadow-sm
              hover:-translate-y-1
              active:scale-[0.98]
            "
          >

            {/* Period Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">

              <div>
                <p className="text-sm font-bold text-gray-800">
                  Period {row.periodNumber}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {row.startTime} – {row.endTime}
                </p>
              </div>

              {isNow && (
                <span className="px-2 py-1 rounded-full bg-green-500 text-white text-[10px] font-bold">
                  LIVE
                </span>
              )}

            </div>

            {/* Subjects */}
            <div className="divide-y divide-gray-100">

              {WEEK_DAYS.map((day) => {
                const cell = row.days[day];

                const subjectColor =
                  SUBJECT_CELL_COLORS[cell.subject] ?? "text-gray-700";

                const subjectBg =
                  SUBJECT_BG_COLORS[cell.subject] ?? "bg-gray-50";

                const isToday = day === todayDay;
                const isActive = isToday && isNow;

                return (
                  <div
                    key={day}
                    className={`
                      flex items-start justify-between gap-3 px-4 py-3
                      transition-all duration-200
                      hover:bg-indigo-50/30
                      hover:border-indigo-200
                      border border-transparent
                      ${isToday ? "bg-indigo-50/40" : "bg-white"}
                    `}
                  >

                    {/* Day */}
                    <div className="min-w-[70px]">
                      <p className={`
                        text-xs font-bold uppercase tracking-wide
                        ${isToday ? "text-indigo-600" : "text-gray-400"}
                      `}>
                        {day}
                      </p>

                      {isToday && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-bold">
                          TODAY
                        </span>
                      )}
                    </div>

                    {/* Subject */}
                    <div
                      className={`
                        flex-1 rounded-xl px-3 py-2
                        transition-all duration-200
                        ${subjectBg}
                        ${isActive ? "ring-2 ring-indigo-400" : ""}
                        hover:shadow-sm hover:-translate-y-0.5
                      `}
                    >
                      <p className={`font-bold text-sm leading-tight ${subjectColor}`}>
                        {cell.subject}

                        {isActive && (
                          <span className="ml-1.5 inline-block px-1.5 py-0.5 bg-green-500 text-white text-[9px] rounded-full font-bold">
                            NOW
                          </span>
                        )}
                      </p>

                      {cell.teacher && (
                        <p className="text-xs text-gray-400 mt-1">
                          {cell.teacher}
                        </p>
                      )}

                      {cell.note && !cell.teacher && (
                        <p className="text-xs text-gray-400 mt-1">
                          {cell.note}
                        </p>
                      )}
                    </div>

                  </div>
                );
              })}

            </div>
          </div>
        );
      })}
    </div>

    {/* ================= DESKTOP VIEW ================= */}
    <div className="hidden lg:block overflow-x-auto">

      <table className="w-full text-sm border-collapse min-w-[900px]">

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
                  day === todayDay ? "text-indigo-600" : "text-gray-400"
                }`}
              >
                {day.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {rows.map((row, idx) => {

            if (row.kind === "break") {
              return (
                <tr
                  key={`break-${idx}`}
                  className="bg-amber-50 border-y border-amber-100"
                >
                  <td colSpan={8} className="py-2 px-4 text-center text-xs font-bold tracking-widest text-amber-600 uppercase">
                    {row.label} · {row.startTime} – {row.endTime}
                  </td>
                </tr>
              );
            }

            const isNow = isPeriodNow(row.startTime, row.endTime);

            return (
              <tr
                key={`period-${row.periodNumber}`}
                className="
                  border-b border-gray-50
                  transition-all duration-200
                  hover:bg-indigo-50/30
                  hover:border-indigo-200
                "
              >
                <td className="py-4 px-4 font-bold text-gray-500 text-sm">
                  {row.periodNumber}
                </td>

                <td className="py-4 px-4 text-gray-400 text-xs whitespace-nowrap">
                  {row.startTime}–{row.endTime}
                </td>

                {WEEK_DAYS.map((day) => {
                  const cell = row.days[day];

                  const subjectColor =
                    SUBJECT_CELL_COLORS[cell.subject] ?? "text-gray-600";

                  const subjectBg =
                    SUBJECT_BG_COLORS[cell.subject] ?? "bg-gray-50";

                  const isToday = day === todayDay;
                  const isActive = isToday && isNow;

                  return (
                    <td key={day} className="py-3 px-4">

                      <div
                        className={`
                          rounded-xl px-3 py-2 inline-block min-w-[100px]
                          transition-all duration-200
                          hover:shadow-sm hover:-translate-y-0.5
                          border border-transparent hover:border-indigo-200
                          ${isActive ? "ring-2 ring-indigo-400 bg-indigo-50" : subjectBg}
                        `}
                      >
                        <p className={`font-bold text-sm ${subjectColor}`}>
                          {cell.subject}

                          {isActive && (
                            <span className="ml-1.5 inline-block px-1.5 py-0.5 bg-green-500 text-white text-[9px] rounded-full font-bold">
                              NOW
                            </span>
                          )}
                        </p>

                        {cell.teacher && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {cell.teacher}
                          </p>
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