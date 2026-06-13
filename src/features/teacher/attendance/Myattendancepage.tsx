// teacher/attendance/MyAttendancePage.tsx
import { useState } from "react";
import { format } from "date-fns";
import { AlertCircle, Edit3, Send } from "lucide-react";
import {
  useTodayAttendanceSummary,
  useMyAttendanceHistory,
  useAllHolidays,
  MOCK_HISTORY,
} from "./hooks/useAttendance";
import { useAuthStore } from "../../../store/authStore";
// import WAMethodCard from "./components/WAMethodCard";
import TodayTab from "./components/TodayTab";
import MyHistoryTab from "./components/MyHistoryTab";
import CorrectionRequestModal from "./components/CorrectionRequestModal";
import type { AttendanceHistoryEntry } from "./types/attendance.types";
// import { useMarkAttendanceViaWA } from "./hooks/useAttendance"; // add this export in hooks

// ── Persistent red banner (if not marked by 9AM) ──────────────────────────────
const NotMarkedBanner = ({ onMarkWA, onMarkWeb }: { onMarkWA: () => void; onMarkWeb: () => void }) => {
  const hour = new Date().getHours();
  if (hour < 9) return null; // only show after 9AM
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <AlertCircle size={13} className="text-red-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-red-700">Attendance not marked today</p>
          <p className="text-xs text-red-400">{hour >= 10 ? "Deadline has passed — mark now to avoid a flag." : "Mark before 10:00 AM to avoid a flag."}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onMarkWA}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25d366] text-white text-xs font-bold hover:bg-[#1ebe5a] transition-colors shadow-sm"
        >
          <Send size={12} className="text-white" />
          Mark via WA
        </button>
        <button
          onClick={onMarkWeb}
          className="px-3 py-1.5 rounded-xl border border-red-300 bg-white text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
        >
          Web Form
        </button>
      </div>
    </div>
  );
};

// ── Tab bar (same style as dashboard) ────────────────────────────────────────
const TABS = [
  { key: "today",   label: "Today" },
  { key: "history", label: "My History" },
];

type TabKey = "today" | "history";

// ── Main Page ─────────────────────────────────────────────────────────────────
const MyAttendancePage = () => {
  const staffId = useAuthStore((state) => state.user?.id ?? "");
  const teacherId = localStorage.getItem("teacherStaffId") || staffId;
  const { data: today, isLoading: todayLoading, isError: todayError } = useTodayAttendanceSummary(teacherId);
  const { data: historyData } = useMyAttendanceHistory();
  const { data: holidaysRaw } = useAllHolidays();

  const safeToday = today ?? {
    isMarked: false,
    totalStudents: 0,
    classLabel: "—",
    date: new Date().toISOString().slice(0, 10),
    absentStudents: [],
  };
  const history = Array.isArray(historyData)
    ? historyData
    : typeof historyData === "object" && historyData !== null && Array.isArray((historyData as { data: AttendanceHistoryEntry[] }).data)
    ? (historyData as { data: AttendanceHistoryEntry[] }).data
    : MOCK_HISTORY;

  // Normalise holidays into a lookup set and date→name map
  const rawHolidayList: any[] = Array.isArray(holidaysRaw?.data)
    ? holidaysRaw.data
    : Array.isArray(holidaysRaw?.holidays)
    ? holidaysRaw.holidays
    : (holidaysRaw?.data && Array.isArray((holidaysRaw.data as any).holidays))
    ? (holidaysRaw.data as any).holidays
    : [];

  const holidayDateSet = new Set<string>();
  const holidayNameMap = new Map<string, string>();
  rawHolidayList.forEach((h: any) => {
    const d = h.date;
    if (d) {
      holidayDateSet.add(d);
      holidayNameMap.set(d, h.holidayname ?? h.name ?? "Holiday");
    }
  });

  const todayStr = new Date().toISOString().slice(0, 10);
  const isTodayHoliday = holidayDateSet.has(todayStr);
  const todayHolidayName = holidayNameMap.get(todayStr);

  const [activeTab, setActiveTab] = useState<TabKey>("today");

  // Correction modal state
  type CorrectionPrefill = {
    date: string; studentId: string; studentName: string;
    rollNo: string; currentMark: "P" | "A" | "H";
  };
  const [correctionOpen,    setCorrectionOpen]    = useState(false);
  const [correctionPrefill, setCorrectionPrefill] = useState<CorrectionPrefill | undefined>(undefined);

  const openCorrectionFromToday = (prefill?: CorrectionPrefill) => {
    setCorrectionPrefill(prefill);
    setCorrectionOpen(true);
  };

  const openCorrectionFromHistory = () => {
    setCorrectionOpen(true);
    setCorrectionPrefill(undefined);
  };

  // WA mark stub
  const handleMarkViaWA = () => {
    window.open(`https://wa.me/918000012345?text=ATT+10A+${format(new Date(), "dd-MM-yyyy")}`, "_blank");
  };

  return (
    <div className="flex flex-col gap-6 min-h-full">
      {/* Loading skeleton */}
      {todayLoading && (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-100 rounded w-72" />
          <div className="h-20 bg-gray-50 rounded-2xl" />
        </div>
      )}

      {/* Error state */}
      {todayError && !todayLoading && (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <AlertCircle size={32} className="text-red-400" />
          <p className="text-sm font-semibold text-red-600">Failed to load attendance data</p>
          <p className="text-xs text-gray-400">Check your connection and try again</p>
        </div>
      )}

      {/* Main content */}
      {!todayLoading && !todayError && (<>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Attendance</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {format(new Date(), "EEEE, d MMMM yyyy")} · Class {safeToday.classLabel}
            </p>
          </div>
          <button
            onClick={() => { setCorrectionPrefill(undefined); setCorrectionOpen(true); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm self-start"
          >
            <Edit3 size={14} className="text-current" />
            Request Correction
          </button>
        </div>

        {/* Persistent red banner — only if not marked */}
        {!safeToday.isMarked && (
          <NotMarkedBanner onMarkWA={handleMarkViaWA} onMarkWeb={() => setActiveTab("today")} />
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-100 overflow-x-auto flex-nowrap">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as TabKey)}
              className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
                activeTab === t.key ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Holiday banner */}
        {isTodayHoliday && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-center">
            <p className="text-base font-bold text-gray-700">🎉 {todayHolidayName ?? "Holiday"}</p>
            <p className="text-sm text-gray-500 mt-1">Today is a holiday — attendance is not expected.</p>
          </div>
        )}

        {/* Tab content */}
        {activeTab === "today" && (
          <TodayTab today={safeToday} isHoliday={isTodayHoliday} holidayName={todayHolidayName} onOpenCorrectionModal={openCorrectionFromToday} />
        )}
        {activeTab === "history" && (
          <MyHistoryTab history={history} holidays={rawHolidayList} onRequestCorrection={openCorrectionFromHistory} />
        )}

        {/* Correction modal */}
        <CorrectionRequestModal
          open={correctionOpen}
          onClose={() => { setCorrectionOpen(false); setCorrectionPrefill(undefined); }}
          prefill={correctionPrefill}
        />
      </>)}
    </div>
  );
};

export default MyAttendancePage;