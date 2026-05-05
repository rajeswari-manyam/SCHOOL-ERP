import { useAttendanceStore } from "./store";
import AttendanceToday from "./components/AttendanceToday";
import AttendanceHistory from "./components/AttendanceHistory";
import HolidayCalendar from "./components/HolidayCalendar";
import MarkAttendanceModal from "./components/MarkAttendanceModal";
import AddHolidayModal from "./components/AddHolidayModal";
import type { AttendanceTab } from "./types/attendance.types";

const TABS: { key: AttendanceTab; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "history", label: "History" },
  { key: "holiday", label: "Holiday Calendar" },
];

const AttendancePage = () => {
  const { activeTab, setActiveTab, openMarkAttendance } = useAttendanceStore();

  const todayLabel = new Date("2025-04-07").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700">
                📅 {todayLabel}
              </span>
              {activeTab !== "today" && (
                <input
                  type="date"
                  placeholder="mm/dd/yyyy"
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                />
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              ↓ Export CSV
            </button>
            <button
              onClick={openMarkAttendance}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              ✓ Mark Attendance
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {tab.key === "today" && (
                <span className="ml-2 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full inline-flex items-center justify-center">
                  3
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "today" && <AttendanceToday />}
        {activeTab === "history" && <AttendanceHistory />}
        {activeTab === "holiday" && <HolidayCalendar />}
      </div>

      {/* Modals */}
      <MarkAttendanceModal />
      <AddHolidayModal />

      {/* Floating chat button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-700 transition-colors z-40">
        💬
      </button>
    </div>
  );
};

export default AttendancePage;
