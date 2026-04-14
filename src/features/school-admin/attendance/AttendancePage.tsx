// attendance/AttendancePage.tsx
// Main Attendance page — Image 1/4/5
// 3 tabs: Today | History | Holiday Calendar

import { useState } from "react";
import { format } from "date-fns";
import TodayTab from "./components/TodayTab";
import HistoryTab from "./components/HistoryTab";
import HolidayCalendarTab from "./components/HolidayCalendarTab";
import MarkAttendanceModal from "./modals/MarkAttendanceModal";
import { useTodayClasses, MOCK_CLASSES } from "./hooks/useAttendance";

type TabKey = "today" | "history" | "holiday";

const TABS: { key: TabKey; label: string; badge?: number }[] = [
  { key: "today",   label: "Today",            badge: 3 },
  { key: "history", label: "History" },
  { key: "holiday", label: "Holiday Calendar" },
];

const AttendancePage = () => {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const displayDate = format(new Date(), "EEEE, d MMMM yyyy"); // "Monday, 7 April 2025"

  const [activeTab,      setActiveTab]      = useState<TabKey>("today");
  const [markModalOpen,  setMarkModalOpen]  = useState(false);
  const [selectedDate,   setSelectedDate]   = useState(format(new Date(), "MM/dd/yyyy"));

  const { data: classes } = useTodayClasses(todayStr);
  const classesData = Array.isArray(classes) ? classes : (Array.isArray(MOCK_CLASSES) ? MOCK_CLASSES : []);
  const unmarkedCount = classesData.filter((c) => c.status === "NOT_MARKED").length;

  const handleExportCsv = () => {
    // In production: call attendanceApi.exportCsv(todayStr) then trigger download
    console.log("Exporting CSV for", todayStr);
  };

  return (
    <div className="flex flex-col gap-5 min-h-full">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Attendance</h1>
          {/* Date pill */}
          <button className="mt-2 flex items-center gap-2 px-4 py-2 rounded-full border-2 border-indigo-600 text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {displayDate}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Date input */}
          <input
            type="text"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            placeholder="mm/dd/yyyy"
            className="h-10 px-4 rounded-2xl border border-gray-200 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition w-36"
          />
          {/* Mark Attendance */}
          <button
            onClick={() => setMarkModalOpen(true)}
            className="flex items-center gap-2 h-10 px-5 rounded-2xl bg-indigo-700 text-white text-sm font-bold hover:bg-indigo-800 transition-colors shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Mark Attendance
          </button>
          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 h-10 px-5 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-100">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
              activeTab === t.key
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
            {t.badge !== undefined && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold flex items-center justify-center">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "today"   && <TodayTab date={todayStr} />}
      {activeTab === "history" && <HistoryTab />}
      {activeTab === "holiday" && <HolidayCalendarTab />}

      {/* Mark Attendance modal (top-level trigger) */}
      <MarkAttendanceModal
        open={markModalOpen}
        onClose={() => setMarkModalOpen(false)}
      />
    </div>
  );
};

export default AttendancePage;
