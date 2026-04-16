import { useRealtimeDashboard } from "./hooks/useRealtimeDashboard";
import { joinClassNames } from "./utils/formatters.ts";

import {
  AbsentCountCard,
  ClassesMarkedCard,
  FeeCollectionCard,
  AdmissionsThisWeekCard,
} from "./components/AbsentCountCard.tsx";
import { AttendanceSummaryCard } from "./components/AttendanceSummaryCard.tsx";
import { FeeDuesCard } from "./components/FeeDuesCard.tsx";
import { WeeklySummaryStrip } from "./components/WeeklySummaryStrip.tsx";
import { AlertsFeed } from "./components/AlertsFeed.tsx";

export default function DashboardPage() {
  const {
    data,
    isLoading,
    error,
    alertVisible,
    dismissAlert,
    triggerAttendanceReminder,
  } = useRealtimeDashboard();

  // ── Loading / error states ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
        Loading dashboard…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500 text-sm">
        {error ?? "Something went wrong."}
      </div>
    );
  }

  const { attendance, fees, admissions, whatsappActivity, alertBannerClasses } = data;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 p-4">

      {/* ── Alert Banner ────────────────────────────────────────────────────── */}
      {alertVisible && alertBannerClasses.length > 0 && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 mb-5">
          <div className="flex items-center gap-2 text-amber-700 font-medium text-sm">
            <span className="text-amber-500 text-lg">⚠</span>
            {alertBannerClasses.length} classes haven't marked attendance yet:{" "}
            {joinClassNames(alertBannerClasses)}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={triggerAttendanceReminder}
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              Send WhatsApp Reminders
            </button>
            <button
              onClick={dismissAlert}
              className="text-gray-400 hover:text-gray-600 text-lg font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning, {data.principalName} sir
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening at{" "}
            <span className="text-blue-600 font-medium">{data.schoolName}</span>{" "}
            today — {data.todayDate}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2 rounded-xl transition">
            <span>⬇</span> Download Report
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
            <span>📣</span> Send Broadcast
          </button>
        </div>
      </div>

      {/* ── Top Stat Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <AbsentCountCard attendance={attendance} />
        <ClassesMarkedCard
          attendance={attendance}
          onSendReminder={triggerAttendanceReminder}
        />
        <FeeCollectionCard fees={fees} />
        <AdmissionsThisWeekCard admissions={admissions} />
      </div>

      {/* ── Middle Row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <AttendanceSummaryCard
          attendance={attendance}
          onSendReminder={triggerAttendanceReminder}
        />
        <FeeDuesCard fees={fees} onViewDefaulters={() => {}} />
      </div>

      {/* ── Bottom Row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <AlertsFeed activities={whatsappActivity} />
        <WeeklySummaryStrip admissions={admissions} />
      </div>

      {/* ── Floating Chat Bubble ─────────────────────────────────────────────── */}
      <button className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white text-xl shadow-lg flex items-center justify-center transition">
        💬
      </button>
    </div>
  );
}