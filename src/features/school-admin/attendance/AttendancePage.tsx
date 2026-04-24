import { useState } from "react";
import { useAttendanceToday, useAttendanceMutations } from "./hooks/useAttendance.ts";
import { useRealtimeAttendance } from "./hooks/userealtimeattendance.ts";
import {
  WhatsAppBanner,
  StatCard,
  AttendanceTable,
  MarkAttendanceForm,
} from "./components";
import AttendanceHistory    from "./AttendanceHistory";
import HolidayCalendar      from "./HolidayCalendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Tab = "today" | "history" | "holiday";

export default function AttendancePage() {
  useRealtimeAttendance();

  const { data, isLoading, error, isFetching } = useAttendanceToday();
  const { sendReminder, exportCSV, markAttendance } = useAttendanceMutations();

  const [activeTab,      setActiveTab]      = useState<Tab>("history");
  const [bannerVisible,  setBannerVisible]  = useState(true);
  const [showMarkModal,  setShowMarkModal]  = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-400">Loading attendance…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500 text-sm">
        {(error as Error)?.message ?? "Something went wrong."}
      </div>
    );
  }

  const { stats, rows, date, whatsappNumber } = data;
  const unmarkedRows = rows.filter((r) => r.status === "NOT_MARKED");

  const TABS: { id: Tab; label: string; badge?: number }[] = [
    { id: "today",   label: "Today",            badge: unmarkedRows.length },
    { id: "history", label: "History"           },
    { id: "holiday", label: "Holiday Calendar"  },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <div className="px-6 py-6">

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600">
                📅 {date}
              </span>
              <Input
                type="text"
                placeholder="mm/dd/yyyy"
                className="min-w-[180px]"
              />
              {isFetching && !isLoading && (
                <span className="text-xs text-blue-400 flex items-center gap-1">
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Refreshing…
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowMarkModal(true)}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Mark Attendance
            </Button>
            <Button
              variant="outline"
              onClick={() => exportCSV.mutate(date)}
              disabled={exportCSV.isPending}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </Button>
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

        {/* ── Today Tab ────────────────────────────────────────────────────── */}
        {activeTab === "today" && (
          <>
            {bannerVisible && (
              <WhatsAppBanner
                whatsappNumber={whatsappNumber}
                onDismiss={() => setBannerVisible(false)}
              />
            )}

            <div className="bg-white rounded-2xl border border-gray-200 flex divide-x divide-gray-200 mb-6">
              <StatCard
                label="Total Present"
                value={<span className="text-emerald-500">{stats.totalPresent}</span>}
                delta={<span className="text-emerald-500 flex items-center gap-0.5">↑ {stats.presentDelta}</span>}
              />
              <StatCard
                label="Total Absent"
                value={<span className="text-red-500">{stats.totalAbsent}</span>}
                delta={<span className="text-red-400 flex items-center gap-0.5">↓ {stats.absentDelta}</span>}
              />
              <StatCard
                label="Classes Marked"
                value={stats.classesMarked}
                suffix={<span className="text-gray-400">/{stats.totalClasses}</span>}
              />
              <StatCard
                label="Alerts Sent"
                value={stats.alertsSent}
                suffix={<span className="text-gray-400">/{stats.totalAlerts}</span>}
                delta={
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center">
                    ✓
                  </span>
                }
              />
            </div>

            <AttendanceTable
              rows={rows}
              date={date}
              onSendReminder={() =>
                sendReminder.mutate(
                  unmarkedRows.map((r) => r.id)
                )
              }
              isSendingReminder={sendReminder.isPending}
            />
          </>
        )}

        {activeTab === "history" && <AttendanceHistory />}
        {activeTab === "holiday" && <HolidayCalendar />}
      </div>

      {/* ── Mark Attendance Modal ───────────────────────────────────────────── */}
      {showMarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowMarkModal(false)}
          />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                  Mark Attendance — Web Form
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Backup method when WhatsApp is unavailable
                </p>
              </div>
              <button
                onClick={() => setShowMarkModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <MarkAttendanceForm
              onSubmit={(values) =>
                markAttendance.mutate(values as any, {
                  onSuccess: () => setShowMarkModal(false),
                })
              }
              isSubmitting={markAttendance.isPending}
            />
          </div>
        </div>
      )}

      {/* ── Floating Chat Button ────────────────────────────────────────────── */}
      <button className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white text-xl shadow-lg flex items-center justify-center transition active:scale-95 z-40">
        💬
      </button>
    </div>
  );
}