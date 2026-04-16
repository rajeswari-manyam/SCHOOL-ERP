
import { useState } from "react";
import { useHolidaysWithMutations } from "../hooks/useattendance.ts";
import { HOLIDAY_TYPE_COLORS } from "../utils/constants";
import { formatHolidayDate } from "../utils/attendance.utils";
import type { HolidayType } from "../types/attendance.types";

const HOLIDAY_TYPES: HolidayType[] = ["National", "State", "School", "Other"];

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function HolidayCalendar() {
  const { holidays, addHoliday, deleteHoliday } = useHolidaysWithMutations();

  const today = new Date();
  const [calYear,  setCalYear]  = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const [name, setName]     = useState("");
  const [date, setDate]     = useState("");
  const [type, setType]     = useState<HolidayType>("National");
  const [formErr, setFormErr] = useState("");

  const holidayDates = new Set(holidays.map((h) => h.date));

  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const isoPrefix   = `${calYear}-${String(calMonth + 1).padStart(2, "0")}`;

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  };

  const handleAdd = () => {
    if (!name.trim()) { setFormErr("Holiday name is required."); return; }
    if (!date)        { setFormErr("Date is required."); return; }
    setFormErr("");
    addHoliday({ name: name.trim(), date, type });
    setName("");
    setDate("");
    setType("National");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="grid grid-cols-[1fr_280px] divide-x divide-slate-200">

        {/* Calendar */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              ‹
            </button>
            <h2 className="text-base font-bold text-slate-800">
              {MONTH_NAMES[calMonth]} {calYear}
            </h2>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              ›
            </button>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 mb-1">
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
              <p key={d} className="text-center text-[10px] font-bold text-slate-400 py-1">{d}</p>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d   = i + 1;
              const iso = `${isoPrefix}-${String(d).padStart(2, "0")}`;
              const isToday = calYear === today.getFullYear() && calMonth === today.getMonth() && d === today.getDate();
              const isHol   = holidayDates.has(iso);
              return (
                <div
                  key={d}
                  className={`text-center py-1.5 text-sm rounded-lg transition-colors cursor-default ${
                    isToday  ? "bg-indigo-600 text-white font-bold" :
                    isHol    ? "bg-amber-100 text-amber-800 font-semibold" :
                               "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {d}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className="w-3 h-3 rounded-full bg-indigo-600" /> Today
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className="w-3 h-3 rounded-full bg-amber-300" /> Holiday
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col divide-y divide-slate-100">
          {/* Add Holiday Form */}
          <div className="p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Add Holiday</h3>
            {formErr && <p className="text-xs text-red-500 mb-2">{formErr}</p>}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
                  Holiday Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eid al-Fitr"
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as HolidayType)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 appearance-none"
                >
                  {HOLIDAY_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <button
                onClick={handleAdd}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-xl transition active:scale-95"
              >
                Add Holiday
              </button>
            </div>
          </div>

          {/* Holiday List */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Holidays This Academic Year
            </h3>
            <div className="space-y-2">
              {[...holidays]
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((h) => (
                  <div key={h.id} className="flex items-start justify-between gap-2 py-2 border-b border-slate-50 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{h.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[10px] text-slate-400">{formatHolidayDate(h.date)}</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${HOLIDAY_TYPE_COLORS[h.type]}`}>
                          {h.type}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteHoliday(h.id)}
                      className="w-6 h-6 flex items-center justify-center rounded text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                      title="Remove holiday"
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
