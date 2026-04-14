// attendance/components/TodayTab.tsx
// Image 1 — Today tab with stat cards, class-wise table, send reminders

import { useState } from "react";
import { useTodaySummary, useTodayClasses, useSendReminders, MOCK_SUMMARY, MOCK_CLASSES } from "../hooks/useAttendance";
import ClassDetailDrawer from "./ClassDetailDrawer";
import MarkAttendanceModal from "../modals/MarkAttendanceModal";
import type { ClassAttendanceRow } from "../types/attendance.types";

interface TodayTabProps { date: string; }

// ── WA instruction banner ─────────────────────────────────────────────────────
const WABanner = ({ onDismiss }: { onDismiss: () => void }) => (
  <div className="bg-[#f0edff] border border-indigo-200 rounded-2xl px-5 py-4 flex items-start gap-4">
    <div className="w-10 h-10 rounded-full bg-[#25d366] flex items-center justify-center flex-shrink-0">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </div>
    <div className="flex-1">
      <p className="text-sm font-bold text-indigo-900">Teachers mark attendance by sending WhatsApp to +91 90000 12345</p>
      <p className="text-xs text-indigo-600 mt-0.5">Format: 7A Absent: Student Name1, Student Name2</p>
    </div>
    <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>
);

// ── Stat cards ────────────────────────────────────────────────────────────────
const SummaryCards = ({ summary = MOCK_SUMMARY }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Total Present */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Total Present</p>
      <div className="flex items-end gap-2">
        <p className="text-3xl font-extrabold text-emerald-500">{summary.totalPresent}</p>
        <span className="text-xs font-bold text-emerald-500 mb-1">↑ {summary.presentDelta}%</span>
      </div>
    </div>
    {/* Total Absent */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Total Absent</p>
      <div className="flex items-end gap-2">
        <p className="text-3xl font-extrabold text-red-500">{summary.totalAbsent}</p>
        <span className="text-xs font-bold text-red-400 mb-1">↓ {summary.absentDelta}%</span>
      </div>
    </div>
    {/* Classes Marked */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Classes Marked</p>
      <div className="flex items-end gap-1">
        <p className="text-3xl font-extrabold text-indigo-600">{summary.classesMarked}</p>
        <span className="text-xl font-bold text-gray-300 mb-0.5">/{summary.classesTotal}</span>
      </div>
      {/* Progress bar */}
      <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${(summary.classesMarked / summary.classesTotal) * 100}%` }} />
      </div>
    </div>
    {/* Alerts Sent */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Alerts Sent</p>
      <div className="flex items-center gap-3">
        <div className="flex items-end gap-1">
          <p className="text-3xl font-extrabold text-emerald-500">{summary.alertsSent}</p>
          <span className="text-xl font-bold text-gray-300 mb-0.5">/{summary.alertsTotal}</span>
        </div>
        {summary.alertsSent === summary.alertsTotal && (
          <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        )}
      </div>
    </div>
  </div>
);

// ── Method badge ──────────────────────────────────────────────────────────────
const MethodBadge = ({ method }: { method: string }) =>
  method === "WhatsApp" ? (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      WhatsApp
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
      </svg>
      Web Form
    </span>
  );

// ── Class-wise table ──────────────────────────────────────────────────────────
const ClassTable = ({ classes = [], date, onRowClick }: {
  classes?: ClassAttendanceRow[];
  date: string;
  onRowClick: (row: ClassAttendanceRow) => void;
}) => {
  const COL = "text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 py-3";
  const unmarkedCount = classes.filter((c) => c.status === "NOT_MARKED").length;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">Class-wise Attendance — Today</h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-gray-400">{date}</p>
              <span className="text-gray-200">·</span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Auto-refreshing every 60s
              </span>
            </div>
          </div>
          {/* Stacked teacher avatars */}
          <div className="flex items-center -space-x-2">
            {classes.slice(0, 3).map((c) => (
              <div key={c.id} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${c.teacher.color}`}>
                {c.teacher.initials}
              </div>
            ))}
            {classes.length > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold">
                +{classes.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-50">
              <th className={`${COL} text-left`}>Class<br/>| Sec</th>
              <th className={`${COL} text-left`}>Class<br/>Teacher</th>
              <th className={`${COL} text-center`}>Total</th>
              <th className={`${COL} text-center`}>Present</th>
              <th className={`${COL} text-center`}>Absent</th>
              <th className={`${COL} text-left`}>Status</th>
              <th className={`${COL} text-left`}>Method</th>
              <th className={`${COL} text-center`}>Alerts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {classes.map((row) => {
              const isUnmarked = row.status === "NOT_MARKED";
              return (
                <tr
                  key={row.id}
                  onClick={() => !isUnmarked && onRowClick(row)}
                  className={`transition-colors ${isUnmarked ? "bg-red-50/40" : "hover:bg-gray-50/50 cursor-pointer"}`}
                >
                  <td className="px-4 py-4">
                    <span className="text-base font-extrabold text-gray-900">{row.classSection}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${row.teacher.color}`}>
                        {row.teacher.initials}
                      </div>
                      <span className="text-sm text-gray-700">{row.teacher.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-semibold text-gray-700">{row.total}</td>
                  <td className="px-4 py-4 text-center">
                    {row.present !== null
                      ? <span className="text-sm font-bold text-emerald-500">{row.present}</span>
                      : <span className="text-gray-200">—</span>}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {row.absent !== null
                      ? <span className="text-sm font-bold text-red-500">{row.absent}</span>
                      : <span className="text-gray-200">—</span>}
                  </td>
                  <td className="px-4 py-4">
                    {row.status === "MARKED" ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />MARKED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-red-100 text-red-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />NOT MARKED
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {row.method ? <MethodBadge method={row.method} /> : <span className="text-gray-200">—</span>}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {row.alertsSent !== null
                      ? <span className="text-sm font-bold text-gray-700">{row.alertsSent}/{row.alertsTotal}</span>
                      : <span className="text-gray-200">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Send Reminder CTA */}
      {unmarkedCount > 0 && (
        <SendReminderBar date={date} unmarkedCount={unmarkedCount} />
      )}
    </div>
  );
};

const SendReminderBar = ({ date, unmarkedCount }: { date: string; unmarkedCount: number }) => {
  const { mutate, isPending } = useSendReminders();
  return (
    <div className="p-4 border-t border-orange-100 bg-orange-50/30">
      <button
        onClick={() => mutate(date)}
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-bold hover:from-orange-500 hover:to-orange-600 disabled:opacity-60 transition-all shadow-md"
      >
        {isPending ? (
          <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M3 11l19-9-9 19-2-8-8-2z"/>
          </svg>
        )}
        {isPending ? "Sending Reminders…" : `Send Reminder to All Unmarked Classes`}
      </button>
    </div>
  );
};

// ── TodayTab ──────────────────────────────────────────────────────────────────
const TodayTab = ({ date }: TodayTabProps) => {
  const { data: summary } = useTodaySummary();
  const { data: classes }  = useTodayClasses(date);

  const [bannerDismissed, setBannerDismissed]   = useState(false);
  const [selectedClassId,  setSelectedClassId]  = useState<string | null>(null);
  const [webFormOpen,      setWebFormOpen]      = useState(false);
  const [webFormClass,     setWebFormClass]     = useState<string>("Class 8A");

  const displayClasses  = Array.isArray(classes) ? classes : (Array.isArray(MOCK_CLASSES) ? MOCK_CLASSES : []);
  const displaySummary  = summary  ?? MOCK_SUMMARY;

  return (
    <div className="flex flex-col gap-5">
      {/* WA instruction banner */}
      {!bannerDismissed && <WABanner onDismiss={() => setBannerDismissed(true)} />}

      {/* Stat cards */}
      <SummaryCards summary={displaySummary} />

      {/* Class table */}
      <ClassTable
        classes={displayClasses}
        date={date}
        onRowClick={(row) => setSelectedClassId(row.id)}
      />

      {/* Class detail drawer */}
      <ClassDetailDrawer
        classId={selectedClassId}
        date={date}
        onClose={() => setSelectedClassId(null)}
        onEditAttendance={() => {
          const row = displayClasses.find((c) => c.id === selectedClassId);
          if (row) setWebFormClass(`Class ${row.classSection}`);
          setSelectedClassId(null);
          setWebFormOpen(true);
        }}
      />

      {/* Mark Attendance modal */}
      <MarkAttendanceModal
        open={webFormOpen}
        onClose={() => setWebFormOpen(false)}
        defaultClass={webFormClass}
      />
    </div>
  );
};

export default TodayTab;
