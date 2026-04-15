import type { WeeklyTimetable, DayOfWeek, PeriodRow } from "../types/timetable.types";

interface WeeklyTimetableGridProps {
  timetable: WeeklyTimetable;
  isLoading: boolean;
  onCellClick: (period: PeriodRow, day: DayOfWeek) => void;
}

const DAYS: DayOfWeek[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];

const HeaderCell = ({ label }: { label: string }) => (
  <th className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-3 py-3 text-left">
    {label}
  </th>
);

const SkeletonRow = () => (
  <tr className="border-b border-gray-50">
    {[...Array(8)].map((_, i) => (
      <td key={i} className="px-3 py-4">
        <div className="animate-pulse space-y-1.5">
          <div className="h-3 w-16 rounded bg-gray-100" />
          <div className="h-2.5 w-10 rounded bg-gray-100" />
        </div>
      </td>
    ))}
  </tr>
);

const WeeklyTimetableGrid = ({ timetable, isLoading, onCellClick }: WeeklyTimetableGridProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              <HeaderCell label="Period" />
              {DAYS.map((d) => <HeaderCell key={d} label={d} />)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
          </tbody>
        </table>
      </div>
    );
  }

  // Merge periods and breaks into display rows
  const rows: Array<{ type: "period"; period: PeriodRow } | { type: "break"; label: string; bgClass: string }> = [];

  for (const period of timetable.periods) {
    rows.push({ type: "period", period });
    const brk = timetable.breaks.find((b) => b.afterPeriod === period.periodNumber);
    if (brk) {
      rows.push({
        type: "break",
        label: brk.label,
        bgClass: brk.type === "LUNCH" ? "bg-amber-50" : "bg-gray-50",
      });
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Class {timetable.className} — Weekly Timetable
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">Class Teacher: {timetable.classTeacher}</p>
        </div>
        {timetable.currentPeriod && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Current: {timetable.currentPeriod}
            </span>
          </div>
        )}
      </div>

      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-5 py-3 text-left w-28">
              Periods
            </th>
            {DAYS.map((d) => <HeaderCell key={d} label={d} />)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            if (row.type === "break") {
              return (
                <tr key={`break-${idx}`} className={row.bgClass}>
                  <td colSpan={7} className="py-2">
                    <p className="text-center text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 py-0.5">
                      {row.label}
                    </p>
                  </td>
                </tr>
              );
            }

            const { period } = row;
            return (
              <tr key={period.periodNumber} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition-colors">
                {/* Period label */}
                <td className="px-5 py-4">
                  <p className="text-sm font-bold text-indigo-600">{period.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{period.startTime}</p>
                </td>

                {/* Day cells */}
                {DAYS.map((day) => {
                  const cell = period.days[day];
                  if (!cell) {
                    return (
                      <td
                        key={day}
                        onClick={() => onCellClick(period, day)}
                        className="px-3 py-4 cursor-pointer group"
                      >
                        <span className="text-xs text-gray-300 group-hover:text-indigo-400 transition-colors">—</span>
                      </td>
                    );
                  }
                  if (cell.isFree) {
                    return (
                      <td key={day} className="px-3 py-4">
                        <span className="text-xs text-gray-400 italic">Free Period</span>
                      </td>
                    );
                  }
                  return (
                    <td
                      key={day}
                      onClick={() => onCellClick(period, day)}
                      className="px-3 py-4 cursor-pointer group"
                    >
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {cell.subject}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{cell.teacher}</p>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Bottom stats row */}
      {(timetable.resourceLoad !== undefined || timetable.substitutions !== undefined || timetable.overlapWarning) && (
        <div className="border-t border-gray-100 px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {timetable.resourceLoad !== undefined && (
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" fill="none" stroke="#6366f1" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Resource Load</span>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{timetable.resourceLoad}%</p>
              <p className="text-xs text-gray-400">Classroom occupancy for Grade 10</p>
              <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all"
                  style={{ width: `${timetable.resourceLoad}%` }}
                />
              </div>
            </div>
          )}
          {timetable.substitutions !== undefined && (
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" fill="none" stroke="#6366f1" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <line x1="23" y1="11" x2="17" y2="11" /><line x1="20" y1="8" x2="20" y2="14" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Substitution</span>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{timetable.substitutions}</p>
              <p className="text-xs text-gray-400">Periods currently need substitute teachers</p>
              <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 text-left">
                Assign Now →
              </button>
            </div>
          )}
          {timetable.overlapWarning && (
            <div className="bg-red-50 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" fill="none" stroke="#dc2626" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <line x1="9" y1="15" x2="15" y2="15" /><line x1="12" y1="12" x2="12" y2="18" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-red-800">Overlap Detected</p>
                  <p className="text-xs text-red-600">{timetable.overlapWarning}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklyTimetableGrid;