// teacher/attendance/MyAttendancePage.tsx
import { useState } from "react";
import { format } from "date-fns";
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
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
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