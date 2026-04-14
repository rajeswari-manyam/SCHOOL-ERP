// attendance/components/HolidayCalendarTab.tsx
// Image 5 — Holiday Calendar tab

import { useState } from "react";
import { format, getDaysInMonth, getDay, startOfMonth, addMonths, subMonths } from "date-fns";
import { useHolidays, MOCK_HOLIDAYS } from "../hooks/useAttendance";
import AddHolidayModal from "../modals/AddHolidayModal";
import type { Holiday, HolidayType } from "../types/attendance.types";

const TYPE_STYLES: Record<HolidayType, { bg: string; text: string; label: string; dot: string }> = {
  SCHOOL_DAY:       { bg: "bg-indigo-50",  text: "text-indigo-700",  label: "SCHOOL DAY",       dot: "bg-indigo-500"  },
  NATIONAL_HOLIDAY: { bg: "bg-amber-50",   text: "text-amber-700",   label: "NATIONAL HOLIDAY",  dot: "bg-amber-400"  },
  PUBLIC_HOLIDAY:   { bg: "bg-red-50",     text: "text-red-600",     label: "PUBLIC HOLIDAY",    dot: "bg-red-500"    },
  SCHOOL_EVENT:     { bg: "bg-emerald-50", text: "text-emerald-700", label: "SCHOOL EVENT",      dot: "bg-emerald-500"},
  SUNDAY_WEEKEND:   { bg: "bg-gray-50",    text: "text-gray-400",    label: "SUNDAY/WEEKEND",    dot: "bg-gray-300"   },
};

const DOW = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const HolidayCalendarTab = () => {
  const [calDate,       setCalDate]       = useState(new Date(2025, 3, 1)); // April 2025
  const [addModalOpen,  setAddModalOpen]  = useState(false);

  const year  = calDate.getFullYear();
  const month = calDate.getMonth();

  const { data: holidayData } = useHolidays(year, month + 1);
  const holidays = holidayData ?? MOCK_HOLIDAYS;

  const daysInMonth    = getDaysInMonth(calDate);
  const firstDayOfWeek = getDay(startOfMonth(calDate));
  const days           = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const today          = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  // Build date → holiday lookup
  const holidayByDate: Record<string, Holiday> = {};
  holidays.forEach((h) => {
    const d = new Date(h.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      holidayByDate[d.getDate()] = h;
    }
  });

  const isSunday = (d: number) => getDay(new Date(year, month, d)) === 0;
  const isSaturday = (d: number) => getDay(new Date(year, month, d)) === 6;

  return (
    <div className="flex flex-col gap-5">
      {/* Calendar card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Month nav + Add button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCalDate(subMonths(calDate, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span className="text-base font-extrabold text-gray-900 min-w-[110px] text-center">
              {format(calDate, "MMMM yyyy")}
            </span>
            <button
              onClick={() => setCalDate(addMonths(calDate, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-700 text-white text-sm font-bold hover:bg-indigo-800 transition-colors shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Holiday
          </button>
        </div>

        {/* Calendar grid */}
        <div className="p-5">
          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DOW.map((d) => (
              <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest py-2">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells */}
            {Array.from({ length: firstDayOfWeek }, (_, i) => (
              <div key={`e-${i}`} className="min-h-[72px]" />
            ))}

            {days.map((d) => {
              const holiday   = holidayByDate[d];
              const isToday   = isCurrentMonth && today.getDate() === d;
              const isWeekend = isSunday(d) || isSaturday(d);
              const typeStyle = holiday ? TYPE_STYLES[holiday.type] : null;

              return (
                <div
                  key={d}
                  className={`min-h-[72px] rounded-2xl p-2 border transition-colors ${
                    isToday
                      ? "border-2 border-indigo-600"
                      : holiday
                      ? `border border-transparent ${typeStyle!.bg}`
                      : isWeekend
                      ? "border border-transparent"
                      : "border border-gray-50 hover:border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`text-sm font-bold ${
                      isToday       ? "text-indigo-700"
                      : holiday    ? typeStyle!.text
                      : isWeekend  ? "text-gray-300"
                      : "text-gray-700"
                    }`}>
                      {d}
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-extrabold bg-indigo-600 text-white px-1.5 py-0.5 rounded-md">TODAY</span>
                    )}
                    {isWeekend && !isToday && (
                      <span className="text-[9px] font-semibold text-gray-300 uppercase">
                        {isSunday(d) ? "Sun" : ""}
                      </span>
                    )}
                  </div>
                  {holiday && (
                    <div className="mt-1">
                      <p className={`text-[10px] font-bold ${typeStyle!.text} leading-tight`}>{holiday.name}</p>
                      <p className={`text-[8px] font-extrabold uppercase tracking-wider mt-0.5 ${typeStyle!.text} opacity-70`}>{typeStyle!.label}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-2">
        {(Object.keys(TYPE_STYLES) as HolidayType[]).map((t) => {
          const s = TYPE_STYLES[t];
          return (
            <span key={t} className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
              <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
          );
        })}
      </div>

      {/* Holidays This Academic Year */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Holidays This Academic Year</h3>
            <p className="text-sm text-gray-400 mt-0.5">{holidays.length} holidays scheduled for 2024-25</p>
          </div>
          <span className="text-xs font-bold text-indigo-700 border border-indigo-200 bg-indigo-50 px-3 py-1.5 rounded-xl uppercase tracking-wide">
            Academic Year Plan
          </span>
        </div>

        <div className="space-y-2">
          {holidays.map((h) => {
            const s = TYPE_STYLES[h.type];
            return (
              <div key={h.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-none">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.dot}`} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{h.name}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${s.text}`}>{s.label}</p>
                </div>
                <span className="text-sm text-gray-500 font-semibold">
                  {format(new Date(h.date), "dd MMM yyyy")}
                </span>
                {h.repeatAnnually && (
                  <span className="text-[9px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-lg uppercase tracking-wide">Repeats</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Holiday Modal */}
      <AddHolidayModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </div>
  );
};

export default HolidayCalendarTab;
