import { useState } from "react";
import { format, getDaysInMonth } from "date-fns";
import { ChevronLeft, ChevronRight, SquarePen } from "lucide-react";
import type { AttendanceRecord, AttendanceMark } from "../types/marketing.types";
import { RepAvatar } from "./RepBadges";
import { useAttendance } from "../hooks/useMarketing";
import AttendanceModal from "./AttendanceModal";

const dotColors: Record<AttendanceMark, string> = {
  P: "bg-emerald-500",
  A: "bg-red-500",
  H: "bg-amber-400",
  "-": "bg-transparent",
};
const dotTitles: Record<AttendanceMark, string> = {
  P: "Present",
  A: "Absent",
  H: "Half Day",
  "-": "Weekend/Holiday",
};

const AttendanceTab = () => {
  const today = new Date();
  const [year, setYear]       = useState(today.getFullYear());
  const [month, setMonth]     = useState(today.getMonth() + 1);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: recordsData, isLoading } = useAttendance(month, year);

  const rawRecords = recordsData as unknown;
  const records: AttendanceRecord[] = Array.isArray(rawRecords)
    ? rawRecords
    : (rawRecords as { data?: AttendanceRecord[]; records?: AttendanceRecord[] })?.data ??
      (rawRecords as { data?: AttendanceRecord[]; records?: AttendanceRecord[] })?.records ?? [];

  const daysCount = getDaysInMonth(new Date(year, month - 1));
  const days      = Array.from({ length: daysCount }, (_, i) => i + 1);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6">

      {/* ══════════════════════════════════════════
          TOP BAR — month nav + legend + CTA
          Mobile:  stacks into two rows
          Desktop: single row
      ══════════════════════════════════════════ */}
      <div className="flex flex-col gap-3 rounded-2xl bg-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">

        {/* Left group: nav arrows + month label + legend */}
        <div className="flex flex-wrap items-center gap-3">

          {/* Month navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50 active:scale-95"
              aria-label="Previous month"
            >
              <ChevronLeft size={13} />
            </button>

            <span className="min-w-[100px] text-center text-sm font-bold text-gray-900 sm:min-w-[120px] sm:text-base">
              {format(new Date(year, month - 1), "MMM yyyy")}
              <span className="hidden sm:inline">
                {format(new Date(year, month - 1), " yyyy").replace(
                  format(new Date(year, month - 1), "yyyy"),
                  ""
                )}
              </span>
            </span>

            <button
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50 active:scale-95"
              aria-label="Next month"
            >
              <ChevronRight size={13} />
            </button>
          </div>

          {/* Legend — wraps on very small screens */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {(["P", "A", "H"] as AttendanceMark[]).map((m) => (
              <span
                key={m}
                className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-xs"
              >
                <span className={`h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5 ${dotColors[m]}`} />
                {/* Full label on sm+, initial only on xs */}
                <span className="hidden sm:inline">{dotTitles[m]}</span>
                <span className="sm:hidden">{m}</span>
              </span>
            ))}
          </div>
        </div>

        {/* CTA button — full width on mobile */}
        <button
          onClick={() => setModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 active:scale-[0.98] sm:w-auto sm:py-2"
        >
          <SquarePen size={14} className="shrink-0" />
          <span className="sm:hidden">Mark Attendance</span>
          <span className="hidden sm:inline">Mark Today's Attendance</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════
          CALENDAR GRID
          Horizontally scrollable on all screens
          so columns never wrap or crush
      ══════════════════════════════════════════ */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 p-8 text-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <p className="animate-pulse text-sm text-gray-400">Loading attendance…</p>
          </div>
        ) : records.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            No attendance records for this month.
          </div>
        ) : (
          /* Wrapper handles horizontal scroll */
          <div
            className="w-full overflow-x-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#e2e8f0 transparent",
            }}
          >
            <style>{`
              .attendance-scroll::-webkit-scrollbar { height: 4px; }
              .attendance-scroll::-webkit-scrollbar-track { background: transparent; }
              .attendance-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 999px; }
            `}</style>

            <table
              className="attendance-scroll w-full border-collapse"
              style={{ minWidth: `${148 + daysCount * 30}px` }}
            >
              <thead>
                <tr className="border-b border-gray-100">
                  {/* Rep column — sticky on larger screens */}
                  <th
                    className="sticky left-0 z-10 min-w-[120px] bg-white px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-gray-400 sm:min-w-[140px] sm:px-4 sm:text-[11px]"
                  >
                    Representative
                  </th>

                  {days.map((d) => (
                    <th
                      key={d}
                      className="w-7 py-3 text-center text-[10px] font-semibold text-gray-400 sm:w-8 sm:text-[11px]"
                    >
                      {d}
                    </th>
                  ))}

                  <th className="px-2 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-gray-400 sm:px-3 sm:text-[11px]">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {records.map((rec) => (
                  <tr
                    key={rec.repId}
                    className="transition-colors hover:bg-gray-50/50"
                  >
                    {/* Sticky rep name column */}
                    <td className="sticky left-0 z-10 bg-white px-3 py-3 sm:px-4 sm:py-4">
                      <div className="flex items-center gap-2">
                        <RepAvatar initials={rec.initials} size="sm" />
                        <span className="max-w-[80px] truncate text-xs font-semibold text-gray-900 sm:max-w-none sm:text-sm">
                          {rec.repName}
                        </span>
                      </div>
                    </td>

                    {days.map((d) => {
                      const mark = rec.days[d] ?? "-";
                      return (
                        <td key={d} className="py-3 text-center sm:py-4">
                          {mark === "-" ? (
                            <span className="select-none text-[10px] text-gray-200">—</span>
                          ) : (
                            <span
                              title={dotTitles[mark]}
                              className={`inline-block h-3 w-3 rounded-full sm:h-4 sm:w-4 ${dotColors[mark]}`}
                            />
                          )}
                        </td>
                      );
                    })}

                    {/* Total */}
                    <td className="px-2 py-3 text-right text-xs font-bold text-emerald-600 sm:px-3 sm:py-4">
                      {rec.totalPresent}
                      <span className="text-emerald-500">P</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          INFO NOTE
      ══════════════════════════════════════════ */}
      <div className="rounded-2xl bg-gray-100 px-4 py-3 sm:max-w-md sm:px-5 sm:py-4">
        <p className="mb-1 text-xs font-bold text-gray-600 sm:text-sm">
          Automated Field Validation
        </p>
        <p className="text-[11px] leading-relaxed text-gray-500 sm:text-xs">
          Attendance indicators are automatically updated based on the representative's
          mobile app check-in location and time. Manual overrides require Super Admin approval.
        </p>
      </div>

      <AttendanceModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default AttendanceTab;