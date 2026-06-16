// teacher/attendance/MyAttendancePage.tsx
import { useState } from "react";
import { format } from "date-fns";
import { AlertCircle, Edit3, Send, ClipboardCheck } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  useTodayAttendanceSummary,
  useAllHolidays,
  useTeacherAttendanceSummaryRange,
} from "./hooks/useAttendance";

import TodayTab from "./components/TodayTab";
import MyHistoryTab from "./components/MyHistoryTab";
import CorrectionRequestModal from "./components/CorrectionRequestModal";
import MarkStudentAttendanceModal from "./components/MarkStudentAttendaceModal";

// ── Persistent red banner ─────────────────────────────────────────────────────
const NotMarkedBanner = ({ onMarkWA, onMarkWeb }: { onMarkWA: () => void; onMarkWeb: () => void }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <AlertCircle size={13} className="text-red-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-red-700">Attendance not marked today</p>
          <p className="text-xs text-red-400">
            Mark attendance to keep your records up to date.
          </p>
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

// ── Tab bar ───────────────────────────────────────────────────────────────────
const TABS = [
  { key: "today",   label: "Today" },
  { key: "history", label: "My History" },
];

type TabKey = "today" | "history";

// ── Main Page ─────────────────────────────────────────────────────────────────
const MyAttendancePage = () => {
  // Always use the logged-in teacher's own ID
  const activeTeacherId = useAuthStore((s) => s.user?.id ?? "");

  // Date range state for My History tab (default: today)
  const todayStr = new Date().toISOString().slice(0, 10);
  const [historyFromDate, setHistoryFromDate] = useState(todayStr);
  const [historyToDate,   setHistoryToDate]   = useState(todayStr);

  const { data: todayData, isLoading: todayLoading } = useTodayAttendanceSummary(activeTeacherId);
  const { data: holidaysRaw } = useAllHolidays();
  const { data: rangeSummaryData, isLoading: rangeLoading } = useTeacherAttendanceSummaryRange(
    activeTeacherId,
    historyFromDate,
    historyToDate
  );

  // todayData is always defined (api returns emptyToday() on no data) — no mock fallback needed
  const today = todayData ?? {
    isMarked: false,
    totalStudents: 0,
    classLabel: "—",
    date: todayStr,
    absentStudents: [],
  };

  // Normalise holidays
  const rawHolidayList: any[] = Array.isArray(holidaysRaw?.data)
    ? holidaysRaw.data
    : Array.isArray(holidaysRaw?.holidays)
    ? holidaysRaw.holidays
    : holidaysRaw?.data && Array.isArray((holidaysRaw.data as any).holidays)
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

  const isTodayHoliday   = holidayDateSet.has(todayStr);
  const todayHolidayName = holidayNameMap.get(todayStr);

  const [activeTab, setActiveTab] = useState<TabKey>("today");

  type CorrectionPrefill = {
    date: string; studentId: string; studentName: string;
    rollNo: string; currentMark: "P" | "A" | "H";
  };
  const [markAttendanceOpen, setMarkAttendanceOpen] = useState(false);

  const [correctionOpen,    setCorrectionOpen]    = useState(false);
  const [correctionPrefill, setCorrectionPrefill] = useState<CorrectionPrefill | undefined>(undefined);

  const openCorrectionFromToday = (prefill?: CorrectionPrefill) => {
    setCorrectionPrefill(prefill);
    setCorrectionOpen(true);
  };

  const handleMarkViaWA = () => {
    window.open(
      `https://wa.me/918000012345?text=ATT+${today.classLabel}+${format(new Date(), "dd-MM-yyyy")}`,
      "_blank"
    );
  };

  if (todayLoading) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        Loading attendance…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 min-h-full">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Attendance</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {format(new Date(), "EEEE, d MMMM yyyy")}
            {today.classLabel && today.classLabel !== "—" && ` · Class ${today.classLabel}`}
          </p>
        </div>

        {/* Right side: action buttons */}
        <div className="flex items-center gap-2 flex-wrap self-start">
          {/* ── Mark Attendance badge button ────────────────────────────── */}
          <button
            onClick={() => setMarkAttendanceOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
          >
            <ClipboardCheck size={14} />
            Mark Attendance
            {!today.isMarked && (
              <span className="ml-1 w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => { setCorrectionPrefill(undefined); setCorrectionOpen(true); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Edit3 size={14} className="text-current" />
            Request Correction
          </button>
        </div>
      </div>

      {/* Red banner — only if not marked */}
      {!today.isMarked && (
        <NotMarkedBanner
          onMarkWA={handleMarkViaWA}
          onMarkWeb={() => setMarkAttendanceOpen(true)}
        />
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100 overflow-x-auto flex-nowrap">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as TabKey)}
            className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
              activeTab === t.key
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Holiday banner */}
      {isTodayHoliday && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-center">
          <p className="text-base font-bold text-gray-700">
            🎉 {todayHolidayName ?? "Holiday"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Today is a holiday — attendance is not expected.
          </p>
        </div>
      )}

      {/* Tab content */}
      {activeTab === "today" && (
        <TodayTab
          today={today}
          isHoliday={isTodayHoliday}
          holidayName={todayHolidayName}
          classId={today.classId ?? ""}
          sectionId={today.sectionId ?? ""}
          academicYearId={today.academicYearId ?? ""}
          onOpenCorrectionModal={openCorrectionFromToday}
        />
      )}

      {activeTab === "history" && (
        <MyHistoryTab
          teacherId={activeTeacherId}
          summaryData={rangeSummaryData ?? null}
          isLoading={rangeLoading}
          fromDate={historyFromDate}
          toDate={historyToDate}
          onFromDateChange={setHistoryFromDate}
          onToDateChange={setHistoryToDate}
        />
      )}

      {/* Mark Attendance modal */}
      <MarkStudentAttendanceModal
        open={markAttendanceOpen}
        onClose={() => setMarkAttendanceOpen(false)}
        defaultClassId={today.classId ?? ""}
        defaultSectionId={today.sectionId ?? ""}
      />

      {/* Correction modal */}
      <CorrectionRequestModal
        open={correctionOpen}
        onClose={() => { setCorrectionOpen(false); setCorrectionPrefill(undefined); }}
        prefill={correctionPrefill}
      />
    </div>
  );
};

export default MyAttendancePage;