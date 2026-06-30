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
  { key: "leaves",  label: "Leave Requests"   },
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
      <div className="mx-auto max-w-6xl space-y-4 px-3 py-4 sm:space-y-6 sm:px-4 sm:py-6 md:px-6">

        {/* Page Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <h1 className="text-xl font-bold text-gray-900">Attendance</h1>
          <div className="flex items-center gap-2">
            {activeTab === "today" && (
              <Button
                onClick={openMarkAttendance}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  "relative flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === tab.key
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700",
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