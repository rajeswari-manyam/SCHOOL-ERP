// teacher/attendance/MyAttendancePage.tsx
import { useState } from "react";
import { format } from "date-fns";
import { AlertCircle, Edit3, Send } from "lucide-react";
import {
  useTodayAttendance,
  useMyAttendanceHistory,
  MOCK_TODAY_MARKED,
  MOCK_HISTORY,
} from "./hooks/useAttendance";
import WAMethodCard from "./components/WAMethodCard";
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
  const { data: todayData }   = useTodayAttendance();
  const { data: historyData } = useMyAttendanceHistory();

  const today = todayData ?? MOCK_TODAY_MARKED; // swap to MOCK_TODAY for not-marked state
  const history = Array.isArray(historyData)
    ? historyData
    : typeof historyData === "object" && historyData !== null && Array.isArray((historyData as any).data)
    ? (historyData as any).data
    : MOCK_HISTORY;

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

  const openCorrectionFromHistory = (_entry: AttendanceHistoryEntry) => {
    setCorrectionOpen(true);
    setCorrectionPrefill(undefined);
  };

  // WA mark stub
  const handleMarkViaWA = () => {
    window.open(`https://wa.me/918000012345?text=ATT+10A+${format(new Date(), "dd-MM-yyyy")}`, "_blank");
  };

  return (
    <div className="flex flex-col gap-6 min-h-full">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Attendance</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {format(new Date(), "EEEE, d MMMM yyyy")} · Class {today.classLabel}
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
      {!today.isMarked && (
        <NotMarkedBanner
          onMarkWA={handleMarkViaWA}
          onMarkWeb={() => setActiveTab("today")}
        />
      )}

      {/* WhatsApp Method Card */}
      <WAMethodCard onMarkViaWA={handleMarkViaWA} />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100">
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

      {/* Tab content */}
      {activeTab === "today" && (
        <TodayTab today={today} onOpenCorrectionModal={openCorrectionFromToday} />
      )}

      {activeTab === "history" && (
        <MyHistoryTab
          history={history}
          onRequestCorrection={openCorrectionFromHistory}
        />
      )}

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