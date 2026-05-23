import React from "react";
import { Button } from "@/components/ui/button";
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
  getLoadBarColor,
  CONFLICT_SEVERITY_STYLES,
} from "../utils/Timetable.utils";

interface Props {
  timetable: ClassTimetable;
  onEditCell: (day: DayOfWeek, periodNo: number, subject: string, teacherName: string) => void;
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

const WeeklyTimetableGrid: React.FC<Props> = ({ timetable, onEditCell }) => {
  const { slots, resourceLoad, substitutionCount, conflicts, currentPeriodLabel } = timetable;
  const loadColor = getLoadBarColor(resourceLoad);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

      {/* ── Card header ── */}
      <div className="flex flex-col gap-2 p-4 pb-3 sm:flex-row sm:items-start sm:justify-between sm:p-5">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-gray-900 sm:text-base">
            {timetable.classLabel}{timetable.section} — Weekly Timetable
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

      {/* ── Timetable grid ──────────────────────────────────────
          Horizontally scrollable so columns never crush on mobile.
          Sticky first column keeps the period label visible.
      ─────────────────────────────────────────────────────────── */}
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
              {/* Sticky period column header */}
              <TableHead className="sticky left-0 z-10 w-20 bg-white px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:w-24 sm:px-4 sm:text-xs">
                Period
              </TableHead>

              {DAY_ORDER.map((day) => (
                <TableHead
                  key={day}
                  className="px-2 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:px-4 sm:text-xs"
                >
                  {/* Abbreviated on mobile, full on sm+ */}
                  <span className="sm:hidden">{DAY_SHORT[day] ?? day}</span>
                  <span className="hidden sm:inline">{DAY_LABELS[day]}</span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {slots.map((slot, idx) => {
              /* ── Break / Lunch row ── */
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
                  {/* Sticky period + time column */}
                  <TableCell className="sticky left-0 z-10 bg-white px-3 py-2.5 align-top sm:px-4 sm:py-3">
                    <span className="text-[10px] font-bold text-indigo-600 sm:text-xs">
                      {periodLabel}
                    </span>
                    <br />
                    <span className="text-[9px] text-gray-400 sm:text-xs">
                      {timeLabel}
                    </span>
                  </TableCell>

                  {/* Subject cells */}
                  {DAY_ORDER.map((day) => {
                    const cell = slot.cells?.[day];
                    if (!cell) {
                      return (
                        <TableCell
                          key={day}
                          className="px-2 py-2.5 text-xs text-gray-300 sm:px-4 sm:py-3"
                        >
                          —
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell
                        key={day}
                        className="cursor-pointer px-2 py-2.5 sm:px-4 sm:py-3"
                        onClick={() =>
                          slot.periodNo != null &&
                          onEditCell(day, slot.periodNo, cell.subject, cell.teacherName)
                        }
                      >
                        <p
                          className={`text-xs font-semibold leading-tight sm:text-sm ${getSubjectColor(cell.subject)}`}
                        >
                          {cell.subject}
                        </p>
                        <p className="mt-0.5 text-[10px] text-gray-400 sm:text-xs">
                          {cell.teacherName}
                        </p>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* ── Footer stats ────────────────────────────────────────
          1 col on mobile → 3 cols on md+
      ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 border-t border-gray-100 p-4 sm:grid-cols-2 sm:p-5 md:grid-cols-3">

        {/* Resource load */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">👥</span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:text-xs">
              Resource Load
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900 sm:text-2xl">{resourceLoad}%</p>
          <p className="text-[10px] text-gray-400 sm:text-xs">
            Classroom occupancy for Grade 10
          </p>
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 sm:h-2">
            <div
              className={`h-full rounded-full transition-all ${loadColor}`}
              style={{ width: `${resourceLoad}%` }}
            />
          </div>
        </div>

        {/* Substitution */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">🔄</span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:text-xs">
              Substitution
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900 sm:text-2xl">{substitutionCount}</p>
          <p className="text-[10px] text-gray-400 sm:text-xs">
            Periods need substitute teachers
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-left text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
          >
            Assign Now →
          </Button>
        </div>

        {/* Conflicts */}
        <div className="flex flex-col gap-2 sm:col-span-2 md:col-span-1">
          {conflicts.length === 0 ? (
            <div className="flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 p-3">
              <span className="text-base">✅</span>
              <p className="text-xs font-semibold text-green-700">No conflicts detected</p>
            </div>
          ) : (
            conflicts.map((c) => (
              <div
                key={c.id}
                className={`flex items-start gap-2.5 rounded-xl border p-3 sm:gap-3 ${CONFLICT_SEVERITY_STYLES[c.severity]}`}
              >
                <span className="mt-0.5 shrink-0 text-base">⚠️</span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold sm:text-xs">Overlap Detected</p>
                  <p className="text-[10px] sm:text-xs">{c.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyTimetableGrid;