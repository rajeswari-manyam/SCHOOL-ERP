import { useState } from "react";
import { format } from "date-fns";
import { AlertCircle, Edit3, ClipboardCheck } from "lucide-react";
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

const NotMarkedBanner = ({ onMarkWA, onMarkWeb }: { onMarkWA: () => void; onMarkWeb: () => void }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
        <AlertCircle size={14} className="text-red-500" />
      </div>
      <div>
        <p className="text-sm font-medium text-red-700">Attendance not marked today</p>
        <p className="text-xs text-red-500 mt-0.5">Mark attendance to keep your records up to date.</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onMarkWA}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25d366] text-white text-xs font-medium hover:bg-[#1ebe5a] transition-colors"
      >
        Mark via WA
      </button>
      <button
        onClick={onMarkWeb}
        className="px-3 py-1.5 rounded-lg border border-red-300 bg-white text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
      >
        Web Form
      </button>
    </div>
  </div>
);

const TABS = [
  { key: "today",   label: "Today" },
  { key: "history", label: "My History" },
];

type TabKey = "today" | "history";

const MyAttendancePage = () => {
  const activeTeacherId = useAuthStore((s) => s.user?.id ?? "");
  const todayStr = new Date().toISOString().slice(0, 10);
  const [historyFromDate, setHistoryFromDate] = useState(todayStr);
  const [historyToDate,   setHistoryToDate]   = useState(todayStr);

  const { data: todayData, isLoading: todayLoading } = useTodayAttendanceSummary(activeTeacherId);
  const { data: holidaysRaw } = useAllHolidays();
  const { data: rangeSummaryData, isLoading: rangeLoading } = useTeacherAttendanceSummaryRange(
    activeTeacherId, historyFromDate, historyToDate
  );

  const today = todayData ?? {
    isMarked: false, totalStudents: 0, classLabel: "—", date: todayStr, absentStudents: [],
  };

  const rawHolidayList: any[] = Array.isArray(holidaysRaw?.data)
    ? holidaysRaw.data
    : Array.isArray(holidaysRaw?.holidays) ? holidaysRaw.holidays
    : holidaysRaw?.data && Array.isArray((holidaysRaw.data as any).holidays) ? (holidaysRaw.data as any).holidays
    : [];

  const holidayDateSet  = new Set<string>();
  const holidayNameMap  = new Map<string, string>();
  rawHolidayList.forEach((h: any) => {
    if (h.date) { holidayDateSet.add(h.date); holidayNameMap.set(h.date, h.holidayname ?? h.name ?? "Holiday"); }
  });

  const isTodayHoliday   = holidayDateSet.has(todayStr);
  const todayHolidayName = holidayNameMap.get(todayStr);
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [markAttendanceOpen, setMarkAttendanceOpen] = useState(false);

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

  const handleMarkViaWA = () => {
    window.open(`https://wa.me/918000012345?text=ATT+${today.classLabel}+${format(new Date(), "dd-MM-yyyy")}`, "_blank");
  };

  if (todayLoading) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-500">
        Loading attendance…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 min-h-full p-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Attendance</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {format(new Date(), "EEEE, d MMMM yyyy")}
            {today.classLabel && today.classLabel !== "—" && ` · Class ${today.classLabel}`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap self-start">
          <button
            onClick={() => setMarkAttendanceOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <ClipboardCheck size={14} />
            Mark Attendance
            {!today.isMarked && <span className="ml-1 w-2 h-2 rounded-full bg-red-400 animate-pulse" />}
          </button>
          <button
            onClick={() => { setCorrectionPrefill(undefined); setCorrectionOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Edit3 size={14} />
            Request Correction
          </button>
        </div>
      </div>

      {/* Red banner */}
      {!today.isMarked && (
        <NotMarkedBanner onMarkWA={handleMarkViaWA} onMarkWeb={() => setMarkAttendanceOpen(true)} />
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto flex-nowrap">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as TabKey)}
            className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
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
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-center">
          <p className="text-base font-medium text-gray-700">🎉 {todayHolidayName ?? "Holiday"}</p>
          <p className="text-sm text-gray-500 mt-1">Today is a holiday — attendance is not expected.</p>
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

      <MarkStudentAttendanceModal
        open={markAttendanceOpen}
        onClose={() => setMarkAttendanceOpen(false)}
        defaultClassId={today.classId ?? ""}
        defaultSectionId={today.sectionId ?? ""}
      />
      <CorrectionRequestModal
        open={correctionOpen}
        onClose={() => { setCorrectionOpen(false); setCorrectionPrefill(undefined); }}
        prefill={correctionPrefill}
      />
    </div>
  );
};

export default MyAttendancePage;
