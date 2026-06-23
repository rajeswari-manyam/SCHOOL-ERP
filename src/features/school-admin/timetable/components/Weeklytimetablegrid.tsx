import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ClassTimetable, DayOfWeek } from "../types/timetable.types";
import {
  DAY_ORDER,
  DAY_LABELS,
  getPeriodLabel,
  getTimeRange,
  getSubjectColor,
  SLOT_KIND_STYLES,
} from "../utils/Timetable.utils";

interface Props {
  timetable: ClassTimetable;
  onEditCell: (day: DayOfWeek, periodNo: number, subject: string, teacherName: string) => void;
  /** selected_days from WorkingDayRecord â€” days that are not working (e.g. "wednesday" is holiday) */
  workingDays?: string[];
}

// Abbreviated day labels for narrow screens
const DAY_SHORT: Record<string, string> = {
  MONDAY:    "Mon",
  TUESDAY:   "Tue",
  WEDNESDAY: "Wed",
  THURSDAY:  "Thu",
  FRIDAY:    "Fri",
  SATURDAY:  "Sat",
  SUNDAY:    "Sun",
};

// Map API lowercase day names â†’ grid DayOfWeek
const API_TO_GRID: Record<string, DayOfWeek> = {
  monday: "MON", tuesday: "TUE", wednesday: "WED",
  thursday: "THU", friday: "FRI", saturday: "SAT",
};

const WeeklyTimetableGrid: React.FC<Props> = ({ timetable, onEditCell, workingDays }) => {
  const { slots, currentPeriodLabel } = timetable;

  // Build set of working grid days.
  // If workingDays is undefined OR empty â†’ no constraint, treat every day as working.
  // Normalize to lowercase before lookup â€” API stores "Monday" but map keys are "monday"
  const hasConstraint = Array.isArray(workingDays) && workingDays.length > 0;
  const workingDaySet = new Set<DayOfWeek>(
    hasConstraint ? workingDays!.map((d) => API_TO_GRID[d.toLowerCase()]).filter(Boolean) : [],
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

      <div className="flex flex-col gap-2 p-4 pb-3 sm:flex-row sm:items-start sm:justify-between sm:p-5">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-gray-900 sm:text-base">
            {timetable.classLabel}{timetable.section} Weekly Timetable
          </h2>
          <p className="mt-0.5 text-xs text-gray-400">
            Class Teacher: {timetable.classTeacher}
          </p>
        </div>

        {currentPeriodLabel && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
            {currentPeriodLabel}
          </span>
        )}
      </div>

      <div
        className="overflow-x-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}
      >
        <style>{`
          .tt-scroll::-webkit-scrollbar { height: 4px; }
          .tt-scroll::-webkit-scrollbar-track { background: transparent; }
          .tt-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 999px; }
        `}</style>

        <Table className="tt-scroll w-full border-collapse text-sm" style={{ minWidth: 540 }}>
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="sticky left-0 z-10 w-20 bg-white px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:w-24 sm:px-4 sm:text-xs">
                Period
              </TableHead>

              {DAY_ORDER.map((day) => {
                const isWorking = !hasConstraint || workingDaySet.has(day);
                return (
                  <TableHead
                    key={day}
                    className={`px-2 py-3 text-left text-[10px] font-semibold uppercase tracking-wide sm:px-4 sm:text-xs ${
                      isWorking
                        ? "text-gray-500"
                        : "bg-red-50/60 text-red-400"
                    }`}
                  >
                    <span className="sm:hidden">
                      {isWorking ? (DAY_SHORT[day] ?? day) : `${DAY_SHORT[day] ?? day}`}
                      {!isWorking && <span className="block text-[9px] font-normal text-red-300 normal-case tracking-normal">Holiday</span>}
                    </span>
                    <span className="hidden sm:block">
                      {DAY_LABELS[day]}
                      {!isWorking && <span className="block text-[10px] font-normal text-red-400 normal-case tracking-normal mt-0.5">Holiday</span>}
                    </span>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {slots.map((slot, idx) => {
              /* â”€â”€ Break / Lunch row â”€â”€ */
              if (slot.kind === "BREAK" || slot.kind === "LUNCH") {
                const style = SLOT_KIND_STYLES[slot.kind];
                return (
                  <TableRow key={idx} className={`border-b border-gray-100 ${style}`}>
                    <TableCell
                      colSpan={DAY_ORDER.length + 1}
                      className="px-4 py-2 text-center text-xs tracking-[0.2em] sm:py-2.5 sm:tracking-[0.25em]"
                    >
                      {slot.label}
                    </TableCell>
                  </TableRow>
                );
              }

              const periodLabel = getPeriodLabel(slot);
              const timeLabel   = getTimeRange(slot);

              return (
                <TableRow
                  key={idx}
                  className="group border-b border-gray-100 transition-colors hover:bg-gray-50/50"
                >
                  <TableCell className="sticky left-0 z-10 bg-white px-3 py-2.5 align-top sm:px-4 sm:py-3">
                    <span className="text-[10px] font-bold text-indigo-600 sm:text-xs">
                      {periodLabel}
                    </span>
                    <br />
                    <span className="text-[9px] text-gray-400 sm:text-xs">
                      {timeLabel}
                    </span>
                  </TableCell>

                  {DAY_ORDER.map((day) => {
                    const isWorking = !hasConstraint || workingDaySet.has(day);
                    const cell = slot.cells?.[day];

                    if (!cell) {
                      return (
                        <TableCell
                          key={day}
                          className={`px-2 py-2.5 text-xs sm:px-4 sm:py-3 ${
                            isWorking
                              ? "text-gray-300"
                              : "bg-red-50/40"
                          }`}
                        >
                          {isWorking
                            ? <span className="text-gray-300">-</span>
                            : <span className="text-red-200 blur-[0.5px] select-none">-</span>}
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell
                        key={day}
                        className={`px-2 py-2.5 sm:px-4 sm:py-3 ${
                          isWorking
                            ? "cursor-pointer"
                            : "bg-red-50/40 cursor-not-allowed"
                        }`}
                        onClick={() => {
                          if (!isWorking) return;
                          slot.periodNo != null &&
                            onEditCell(day, slot.periodNo, cell.subject, cell.teacherName);
                        }}
                      >
                        <div className={isWorking ? "" : "opacity-30 blur-[1.5px] pointer-events-none select-none"}>
                          <p className={`text-xs font-semibold leading-tight sm:text-sm ${getSubjectColor(cell.subject)}`}>
                            {cell.subject}
                          </p>
                          <p className="mt-0.5 text-[10px] text-gray-400 sm:text-xs">
                            {cell.teacherName}
                          </p>
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

    </div>
  );
};

export default WeeklyTimetableGrid;
