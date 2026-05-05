import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

const WeeklyTimetableGrid: React.FC<Props> = ({ timetable, onEditCell }) => {
  const { slots, resourceLoad, substitutionCount, conflicts, currentPeriodLabel } = timetable;
  const loadColor = getLoadBarColor(resourceLoad);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-start justify-between p-5 pb-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            {timetable.classLabel}{timetable.section} — Weekly Timetable
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Class Teacher: {timetable.classTeacher}</p>
        </div>
        {currentPeriodLabel && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            {currentPeriodLabel}
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <Table className="w-full text-sm border-collapse">
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-24">
                Periods
              </TableHead>
              {DAY_ORDER.map((day) => (
                <TableHead key={day} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {DAY_LABELS[day]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {slots.map((slot, idx) => {
              if (slot.kind === "BREAK" || slot.kind === "LUNCH") {
                const style = SLOT_KIND_STYLES[slot.kind];
                return (
                  <TableRow key={idx} className={`border-b border-gray-100 ${style}`}>
                    <TableCell colSpan={7} className="text-center py-2.5 px-4 tracking-[0.25em]">
                      {slot.label}
                    </TableCell>
                  </TableRow>
                );
              }

              const periodLabel = getPeriodLabel(slot);
              const timeLabel = getTimeRange(slot);

              return (
                <TableRow key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">
                  {/* Period + time column */}
                  <TableCell className="px-4 py-3 align-top">
                    <span className="text-xs font-bold text-indigo-600">{periodLabel}</span>
                    <br />
                    <span className="text-xs text-gray-400">{timeLabel}</span>
                  </TableCell>

                  {/* Subject cells */}
                  {DAY_ORDER.map((day) => {
                    const cell = slot.cells?.[day];
                    if (!cell) {
                      return <TableCell key={day} className="px-4 py-3 text-gray-300 text-xs">—</TableCell>;
                    }
                    return (
                      <TableCell
                        key={day}
                        className="px-4 py-3 cursor-pointer"
                        onClick={() =>
                          slot.periodNo != null &&
                          onEditCell(day, slot.periodNo, cell.subject, cell.teacherName)
                        }
                      >
                        <p className={`font-semibold text-sm leading-tight ${getSubjectColor(cell.subject)}`}>
                          {cell.subject}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{cell.teacherName}</p>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Footer stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 border-t border-gray-100">
        {/* Resource load */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-base">👥</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Resource Load</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{resourceLoad}%</p>
          <p className="text-xs text-gray-400">Classroom occupancy for Grade 10</p>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${loadColor}`}
              style={{ width: `${resourceLoad}%` }}
            />
          </div>
        </div>

        {/* Substitution */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-base">🔄</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Substitution</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{substitutionCount}</p>
          <p className="text-xs text-gray-400">Periods currently need substitute teachers</p>
          <Button variant="ghost" size="sm" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 text-left transition-colors p-0 h-auto">
            Assign Now →
          </Button>
        </div>

        {/* Conflicts */}
        <div className="flex flex-col gap-2">
          {conflicts.map((c) => (
            <div
              key={c.id}
              className={`flex items-center gap-3 border rounded-xl p-3 ${CONFLICT_SEVERITY_STYLES[c.severity]}`}
            >
              <span className="text-lg">⚠️</span>
              <div>
                <p className="text-xs font-bold">Overlap Detected</p>
                <p className="text-xs">{c.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyTimetableGrid;