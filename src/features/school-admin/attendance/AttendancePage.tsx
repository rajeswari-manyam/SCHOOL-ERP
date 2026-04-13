import { useState } from "react";
import { useAttendance } from "./hooks/useAttendance";
import { WhatsAppBanner } from "./components/WhatsAppBanner.tsx";
import { StatCard } from "./components/StatCard.tsx";
import { AttendanceTable } from "./components/AttendanceTable.tsx";

type Tab = "today" | "history" | "holiday";

export default function AttendancePage() {
  const { data, isLoading, error, bannerVisible, dismissBanner, sendReminder, exportCSV } =
    useAttendance();
  const [activeTab, setActiveTab] = useState<Tab>("today");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
        Loading attendance…
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

  const { stats, rows, date, whatsappNumber } = data;
  const unmarkedRows = rows.filter((r) => r.status === "NOT_MARKED");

  const TABS: { id: Tab; label: string; badge?: number }[] = [
    { id: "today", label: "Today", badge: unmarkedRows.length },
    { id: "history", label: "History" },
    { id: "holiday", label: "Holiday Calendar" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-6">

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600">
                📅 {date}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 bg-white border border-gray-200 rounded-lg px-3 py-2">
              04/07/2025
            </span>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
              ✏️ Mark Attendance
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition"
            >
              ⬇ Export CSV
            </button>
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-1.5 pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "today" && (
          <>
            {/* ── WhatsApp Banner ─────────────────────────────────────────── */}
            {bannerVisible && (
              <WhatsAppBanner
                whatsappNumber={whatsappNumber}
                onDismiss={dismissBanner}
              />
            )}

            {/* ── Stats Strip ──────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-200 flex divide-x divide-gray-200 mb-6">
              <StatCard
                label="Total Present"
                value={<span className="text-emerald-500">{stats.totalPresent}</span>}
                delta={
                  <span className="text-emerald-500 flex items-center gap-0.5">
                    ↑ {stats.presentDelta}
                  </span>
                }
              />
              <StatCard
                label="Total Absent"
                value={<span className="text-red-500">{stats.totalAbsent}</span>}
                delta={
                  <span className="text-red-400 flex items-center gap-0.5">
                    ↓ {stats.absentDelta}
                  </span>
                }
              />
              <StatCard
                label="Classes Marked"
                value={stats.classesMarked}
                suffix={
                  <span className="text-gray-400">
                    /{stats.totalClasses}
                  </span>
                }
              />
              <StatCard
                label="Alerts Sent"
                value={stats.alertsSent}
                suffix={
                  <span className="text-gray-400">/{stats.totalAlerts}</span>
                }
                delta={
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center">
                    ✓
                  </span>
                }
              />
            </div>

            {/* ── Attendance Table ─────────────────────────────────────────── */}
            <AttendanceTable rows={rows} onSendReminder={sendReminder} />
          </>
        )}

        {activeTab === "history" && (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">
            History view coming soon
          </div>
        )}

        {activeTab === "holiday" && (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">
            Holiday Calendar coming soon
          </div>
        )}
      </div>

      {/* ── Floating Chat Button ────────────────────────────────────────────── */}
      <button className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white text-xl shadow-lg flex items-center justify-center transition">
        💬
      </button>
    </div>
  );
}