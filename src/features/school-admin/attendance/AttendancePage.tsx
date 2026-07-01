import { useAttendanceStore } from "./store";
import { useAllClassesTodayAttendance } from "./hooks/useAttendance";
import AttendanceToday from "./components/AttendanceToday";
import AttendanceHistory from "./components/AttendanceHistory";
import HolidayCalendar from "./components/HolidayCalendar";
import StaffAttendance from "./components/StaffAttendance";
import PendingLeavesTab from "./components/PendingLeavesTab";
import MarkAttendanceModal from "./components/MarkAttendanceModal";
import MarkStaffAttendanceModal from "./components/MarkStaffAttendanceModal";
import AddHolidayModal from "./components/AddHolidayModal";
import { Button } from "../../../components/ui/button";
import type { AttendanceTab } from "./types/attendance.types";

const TABS: { key: AttendanceTab; label: string }[] = [
  { key: "today",   label: "Today"            },
  { key: "history", label: "History"          },
  { key: "holiday", label: "Holiday Calendar" },
  { key: "staff",   label: "Staff Attendance" },
];

const AttendancePage = () => {
  const { activeTab, setActiveTab, openMarkAttendance } = useAttendanceStore();

  const {
    data: allClassesData,
    isLoading: allClassesLoading,
    error: allClassesError,
  } = useAllClassesTodayAttendance();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl space-y-3 px-3 py-3 sm:space-y-4 sm:px-4 sm:py-4 md:px-6">

        {/* Page Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Attendance</h1>
            <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5">
              <svg className="h-3 w-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] font-medium text-indigo-600">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === "today" && (
              <Button
                onClick={openMarkAttendance}
                className="flex items-center gap-1.5 rounded-lg px-3 h-9 text-xs font-medium text-white"
                style={{ background: 'linear-gradient(101.74deg, #3525CD 0%, #4F46E5 100%)' }}
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark Attendance
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex items-center">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={[
                  "relative flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-medium transition-colors",
                  activeTab === tab.key
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-700 hover:text-gray-900",
                ].join(" ")}
              >
                {tab.label}
                {tab.key === "today" && allClassesData && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                    {allClassesData.total_classes}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "today" && (
          <AttendanceToday
            allClassesData={allClassesData}
            allClassesLoading={allClassesLoading}
            allClassesError={allClassesError ? (allClassesError as Error).message : null}
          />
        )}
        {activeTab === "history" && <AttendanceHistory />}
        {activeTab === "holiday" && <HolidayCalendar />}
        {activeTab === "staff"   && <StaffAttendance />}
        {activeTab === "leaves"  && <PendingLeavesTab />}
      </div>

      <MarkAttendanceModal />
      <MarkStaffAttendanceModal />
      <AddHolidayModal />
    </div>
  );
};

export default AttendancePage;