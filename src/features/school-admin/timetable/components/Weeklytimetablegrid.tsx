import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import type { ClassTimetable, DayOfWeek } from "../types/timetable.types";
import {
  DAY_ORDER,
  SLOT_KIND_STYLES,
  normalizeDayAbbr,
} from "../utils/Timetable.utils";

interface Props {
  timetable: ClassTimetable;
  onEditCell: (day: DayOfWeek, periodNo: number, subject: string, teacherName: string) => void;
  onEditPeriod?: (id: string, day: DayOfWeek, periodNo: number) => void;
  onDeletePeriod?: (id: string, day: DayOfWeek, periodNo: number, subject: string, teacherName: string) => void;
  workingDays?: string[];
}

const DAY_LONG: Record<DayOfWeek, string> = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
};

// Keyed by the first 3 letters (lowercase) so this matches whether the API
// returns full day names ("Monday") or abbreviations ("Mon").
const ABBR_TO_GRID: Record<string, DayOfWeek> = {
  mon: "MON", tue: "TUE", wed: "WED",
  thu: "THU", fri: "FRI", sat: "SAT",
};

const WeeklyTimetableGrid: React.FC<Props> = ({ timetable, onEditCell, onEditPeriod, onDeletePeriod, workingDays }) => {
  const { slots, currentPeriodLabel } = timetable;

  const hasConstraint = Array.isArray(workingDays) && workingDays.length > 0;
  const workingDaySet = new Set<DayOfWeek>(
    hasConstraint ? workingDays!.map((d) => ABBR_TO_GRID[normalizeDayAbbr(d)]).filter(Boolean) : [],
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

      {/* Card header */}
      <div className="flex flex-col gap-2 p-4 pb-3 sm:flex-row sm:items-start sm:justify-between sm:p-5">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-gray-900 sm:text-base">
            {timetable.classLabel} {timetable.section} Weekly Timetable
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

      {/* Grid — rows = periods, columns = days */}
      <div
        className="overflow-x-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}
      >
        <Table className="w-full border-collapse text-sm" style={{ minWidth: 480 }}>

          {/* ── Header: one column per day ── */}
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-gray-50/60">

              {/* First cell: Period label */}
              <TableHead className="sticky left-0 z-10 bg-gray-50 w-20 px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:w-24 sm:px-4 sm:text-xs border-r border-gray-100">
                Period
              </TableHead>

              {DAY_ORDER.map((day) => {
                const isWorking = !hasConstraint || workingDaySet.has(day);
                return (
                  <TableHead
                    key={day}
                    className={`px-3 py-3 text-left text-[10px] sm:text-xs sm:px-4 whitespace-nowrap font-bold ${
                      isWorking ? "text-gray-700" : "text-red-400 bg-red-50/20"
                    }`}
                  >
                    {DAY_LONG[day]}
                    {!isWorking && (
                      <span className="block text-[8px] text-red-300 font-normal normal-case tracking-normal mt-0.5">Holiday</span>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          {/* ── Body: one row per slot (period / break / lunch) ── */}
          <TableBody>
            {slots.map((slot, idx) => {
              /* Break / Lunch row */
              if (slot.kind === "BREAK" || slot.kind === "LUNCH") {
                return (
                  <TableRow key={idx} className={`border-b border-gray-100 ${SLOT_KIND_STYLES[slot.kind]}`}>
                    <TableCell className={`sticky left-0 z-10 border-r border-gray-100 px-3 py-3 sm:px-4 text-center text-[9px] font-semibold uppercase tracking-wide ${SLOT_KIND_STYLES[slot.kind]}`}>
                      <span>{slot.kind === "BREAK" ? "Break" : "Lunch"}</span>
                      <span className="block text-[8px] font-normal normal-case tracking-normal mt-0.5">
                        {slot.startTime}–{slot.endTime}
                      </span>
                    </TableCell>
                    {DAY_ORDER.map((day) => (
                      <TableCell key={day} className={`px-1 py-3 text-center ${SLOT_KIND_STYLES[slot.kind]}`}>
                        <span className="text-[9px] font-medium">{slot.startTime}</span>
                        <span className="block text-[8px] opacity-60">–</span>
                        <span className="text-[9px] font-medium">{slot.endTime}</span>
                      </TableCell>
                    ))}
                  </TableRow>
                );
              }

              /* Period row */
              return (
                <TableRow key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  {/* Period label cell */}
                  <TableCell className="sticky left-0 z-10 bg-white border-r border-gray-100 px-3 py-3 sm:px-4 sm:py-4 align-middle">
                    <span className="text-xs font-bold text-indigo-600">P{slot.periodNo}</span>
                    <span className="block text-[9px] text-gray-400 font-normal mt-0.5">
                      {slot.startTime}–{slot.endTime}
                    </span>
                  </TableCell>

                  {DAY_ORDER.map((day) => {
                    const isWorking = !hasConstraint || workingDaySet.has(day);

                    /* Holiday cell */
                    if (!isWorking) {
                      return (
                        <TableCell key={day} className="px-3 py-3 bg-red-50/30 sm:px-4">
                          <span className="text-red-200 text-xs select-none">—</span>
                        </TableCell>
                      );
                    }

                    const cell = slot.cells?.[day];

                    /* Empty cell */
                    if (!cell) {
                      return (
                        <TableCell key={day} className="px-3 py-3 sm:px-4">
                          <span className="text-gray-200 text-xs">—</span>
                        </TableCell>
                      );
                    }

                    /* Subject cell */
                    return (
                      <TableCell
                        key={day}
                        className="px-3 py-2.5 sm:px-4 sm:py-3 group relative hover:bg-[#EFF4FF] transition-colors cursor-pointer"
                        onClick={() =>
                          slot.periodNo != null &&
                          onEditCell(day, slot.periodNo, cell.subject, cell.teacherName)
                        }
                      >
                        <p className="text-xs font-semibold leading-tight sm:text-sm text-gray-800">
                          {cell.subject}
                        </p>
                        <p className="mt-0.5 text-[10px] sm:text-xs font-semibold" style={{ color: "#3525CD" }}>
                          {cell.teacherName}
                        </p>
                        <p className="mt-0.5 text-[8px] text-gray-300">
                          {slot.startTime}–{slot.endTime}
                        </p>
                        <div className="hidden group-hover:flex items-center gap-0.5 mt-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditPeriod?.(cell.id ?? "", day, slot.periodNo!);
                              }}
                              className="w-6 h-6 rounded-md flex items-center justify-center transition-colors shadow-sm hover:opacity-80"
                              style={{ background: "#EFF4FF", color: "#3525CD" }}
                              title="Edit period"
                            >
                              <Pencil size={11} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeletePeriod?.(cell.id ?? "", day, slot.periodNo!, cell.subject, cell.teacherName);
                              }}
                              className="w-6 h-6 rounded-md flex items-center justify-center transition-colors shadow-sm hover:opacity-80"
                              style={{ background: "#EFF4FF", color: "#3525CD" }}
                              title="Delete period"
                            >
                              <Trash2 size={11} />
                            </button>
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
