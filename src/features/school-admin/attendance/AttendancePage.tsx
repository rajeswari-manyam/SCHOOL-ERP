import { useAttendanceStore } from "./store";
import AttendanceToday from "./components/AttendanceToday";
import AttendanceHistory from "./components/AttendanceHistory";
import HolidayCalendar from "./components/HolidayCalendar";
import MarkAttendanceModal from "./components/MarkAttendanceModal";
import AddHolidayModal from "./components/AddHolidayModal";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import type { AttendanceTab } from "./types/attendance.types";

const TABS: { key: AttendanceTab; label: string }[] = [
  { key: "today",   label: "Today"            },
  { key: "history", label: "History"          },
  { key: "holiday", label: "Holiday Calendar" },
];

const AttendancePage = () => {
  const { activeTab, setActiveTab, openMarkAttendance } = useAttendanceStore();

  const todayLabel = new Date("2025-04-07").toLocaleDateString("en-IN", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl space-y-4 px-3 py-4 sm:space-y-6 sm:px-4 sm:py-6 md:px-6">

        {/* ── Page Header ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">

          {/* Left: title + date badge */}
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
              Attendance
            </h1>
            <div className="mt-2 flex flex-col items-start gap-2 sm:mt-1 sm:flex-row sm:items-center">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700">
                📅 {todayLabel}
              </span>
              {activeTab !== "today" && (
                <Input
                  type="date"
                  placeholder="mm/dd/yyyy"
                  className="w-full max-w-[170px] border-gray-200 bg-white text-xs text-gray-500"
                />
              )}
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Button
              variant="outline"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium sm:flex-none sm:px-4 sm:text-sm"
            >
              ↓{" "}
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </Button>
            <Button
              onClick={openMarkAttendance}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 sm:flex-none sm:px-4 sm:text-sm"
            >
              ✓{" "}
              <span className="hidden xs:inline">Mark Attendance</span>
              <span className="xs:hidden">Mark</span>
            </Button>
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────
            Horizontal scroll on mobile so tabs never wrap or truncate.
            Fade hints on both edges show the user it scrolls.
        ──────────────────────────────────────────────────────────── */}
        <div className="relative">
          {/* Left fade — hidden when scrolled to start (CSS-only hint) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-6 bg-gradient-to-r from-gray-50 to-transparent sm:hidden"
          />
          {/* Right fade */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-8 bg-gradient-to-l from-gray-50 to-transparent sm:hidden"
          />

          {/* Scrollable strip */}
          <div
            className="overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <style>{`
              .tab-strip::-webkit-scrollbar { display: none; }
            `}</style>

            <div className="tab-strip flex min-w-max items-center border-b border-gray-200">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={[
                    "relative flex shrink-0 items-center gap-1.5 whitespace-nowrap",
                    "border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400",
                    "sm:px-5",
                    activeTab === tab.key
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700",
                  ].join(" ")}
                  aria-current={activeTab === tab.key ? "page" : undefined}
                >
                  {tab.label}

                  {tab.key === "today" && (
                    <Badge
                      variant="blue"
                      className="px-1.5 py-0 text-[10px] font-bold"
                    >
                      3
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tab Content ── */}
        {activeTab === "today"   && <AttendanceToday   />}
        {activeTab === "history" && <AttendanceHistory />}
        {activeTab === "holiday" && <HolidayCalendar   />}
      </div>

      {/* Modals */}
      <MarkAttendanceModal />
      <AddHolidayModal />

      {/* Floating chat button */}
      <button
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-colors hover:bg-indigo-700 active:scale-95"
      >
        💬
      </button>
    </div>
  );
};

export default AttendancePage;