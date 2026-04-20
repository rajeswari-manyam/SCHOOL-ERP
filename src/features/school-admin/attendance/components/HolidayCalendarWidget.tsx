import { useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Download, PlusCircle, UserCheck } from "lucide-react";
import AddHolidayModal from "./AddHolidayModal";
import type { AddHolidayFormState } from "./AddHolidayModal";
import { useHolidayCalendar } from "../hooks/useHolidayCalendar";
import { DAYS, MONTH_NAMES, calendarData, cellStyles, numStyles, tagStyles, LEGEND } from "../utils/holidayCalendar.utils";
import type { DayData } from "../types/holidayCalendar.types";

export default function HolidayCalendarWidget() {
  const {
    activeTab,
    setActiveTab,
    dateInput,
    setDateInput,
    calYear,
    calMonth,
    prevMonth,
    nextMonth,
  } = useHolidayCalendar();

  const [showAddModal, setShowAddModal] = useState(false);
  const [holidays, setHolidays] = useState<DayData[]>(calendarData);

  const totalHolidays = useMemo(
    () => holidays.filter((item) => item.tag).length,
    [holidays]
  );

  const handleHolidaySave = (data: AddHolidayFormState) => {
    setShowAddModal(false);
    setHolidays((current) => [
      ...current,
      {
        day: Number(data.date.slice(-2)),
        type: "school-day",
        label: data.name,
        tag: data.type.toUpperCase(),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Attendance</h1>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full border-2 border-indigo-600 px-4 py-1.5 text-sm font-bold text-indigo-600">
            <Calendar size={15} />
            Monday, 7 April 2025
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="mm/dd/yyyy"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-500 outline-none focus:border-indigo-400"
          />
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 hover:bg-gray-50 transition">
            <Download size={15} />
            Export CSV
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition">
            <UserCheck size={17} />
            Mark Attendance
          </button>
        </div>
      </div>

      <div className="flex gap-8 border-b border-gray-200 mb-7">
        {(["Today", "History", "Holiday Calendar"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 text-sm font-bold border-b-2 -mb-px transition ${
              activeTab === tab
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={prevMonth}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-slate-100 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-xl font-black text-slate-900">{MONTH_NAMES[calMonth]} {calYear}</span>
            <button
              onClick={nextMonth}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-slate-100 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition"
          >
            <PlusCircle size={16} />
            Add Holiday
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {DAYS.map((day) => (
            <div key={day} className="text-center py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400">
              {day}
            </div>
          ))}
          {holidays.map((cell, index) => (
            <div
              key={index}
              className={`border border-slate-100 min-h-[90px] p-3 ${cellStyles[cell.type]} ${
                cell.isToday ? "ring-2 ring-indigo-600 ring-inset" : ""
              }`}
            >
              {cell.day !== null && (
                <>
                  <div className={`flex items-center gap-1.5 text-sm font-extrabold ${numStyles[cell.type]}`}>
                    {cell.day}
                    {cell.isToday && (
                      <span className="rounded-full bg-indigo-600 px-2 py-px text-[10px] font-bold text-white">
                        TODAY
                      </span>
                    )}
                  </div>
                  {cell.isSunday && (
                    <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                      SUNDAY
                    </div>
                  )}
                  {cell.label && (
                    <div className="mt-2 text-xs font-bold leading-snug text-slate-700">
                      {cell.label}
                    </div>
                  )}
                  {cell.tag && (
                    <div className={`mt-1 text-[10px] font-extrabold tracking-widest ${tagStyles[cell.type]}`}>
                      {cell.tag}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-5 mt-5 pt-4 border-t border-slate-100">
          {LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-gray-500">
              <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-900">Holidays This Academic Year</h3>
          <p className="mt-1 text-sm text-gray-500">{totalHolidays} holidays scheduled for 2024-25</p>
        </div>
        <button className="rounded-lg border-2 border-indigo-600 bg-white px-5 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition">
          ACADEMIC YEAR PLAN
        </button>
      </div>

      {showAddModal && (
        <AddHolidayModal
          onClose={() => setShowAddModal(false)}
          onSave={handleHolidaySave}
        />
      )}
    </div>
  );
}
