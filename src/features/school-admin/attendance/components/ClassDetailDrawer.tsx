// attendance/components/ClassDetailDrawer.tsx
// Image 3 — right-side drawer showing class student detail

import { useClassDetail, useResendAlerts, MOCK_CLASS_DETAIL } from "../hooks/useAttendance";
import type { ClassAttendanceDetail, StudentAttendanceDetail } from "../types/attendance.types";
import { format } from "date-fns";

interface ClassDetailDrawerProps {
  classId: string | null;
  date: string;
  onClose: () => void;
  onEditAttendance?: () => void;
}

const StudentAvatar = ({ student }: { student: StudentAttendanceDetail }) => (
  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0 overflow-hidden">
    {student.initials}
  </div>
);

const ClassDetailDrawer = ({ classId, date, onClose, onEditAttendance }: ClassDetailDrawerProps) => {
  const { data, isLoading } = useClassDetail(classId ?? "", date, !!classId);
  const { mutate: resendAll, isPending: resending } = useResendAlerts();

  const detail = data ?? MOCK_CLASS_DETAIL;

  if (!classId) return null;

  const failedAlerts = detail.students.filter((s) => s.alertStatus === "failed");

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-6 pb-4 flex-shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              Class {detail.classSection} — {format(new Date(detail.date), "d MMMM yyyy")}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">Teacher: {detail.teacherName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-xl hover:bg-gray-100 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Method + time pills */}
        <div className="flex items-center gap-2 px-5 pb-4 flex-shrink-0">
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            WhatsApp Delivery
          </span>
          <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 uppercase tracking-wide">
            Marked at: {detail.markedAt}
          </span>
        </div>

        {/* Student list */}
        <div className="flex-1 overflow-y-auto min-h-0 px-5">
          {isLoading ? (
            <div className="py-12 text-center text-sm text-gray-400 animate-pulse">Loading students…</div>
          ) : (
            <div className="space-y-1">
              {detail.students.map((s) => (
                <div key={s.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-none">
                  <StudentAvatar student={s} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-400">Roll: {s.rollNo}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {/* Present/Absent badge */}
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg tracking-wide ${
                      s.mark === "ABSENT" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {s.mark}
                    </span>

                    {/* Alert status (only for absent) */}
                    {s.mark === "ABSENT" && (
                      <div className="flex items-center gap-1">
                        {s.alertStatus === "delivered" && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
                            </svg>
                            Alert Delivered
                          </span>
                        )}
                        {s.alertStatus === "failed" && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold">
                            <span className="flex items-center gap-0.5 text-red-500">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                              </svg>
                              Alert Failed
                            </span>
                            <button className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors ml-1">Retry</button>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom stats + actions */}
        <div className="flex-shrink-0 bg-gray-50 border-t border-gray-100">
          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
            {[
              { label: "Present", value: detail.presentCount, color: "text-gray-900" },
              { label: "Absent",  value: detail.absentCount,  color: "text-gray-900" },
              { label: "Alerts",  value: `${detail.alertsSent}/${detail.alertsTotal}`, color: "text-indigo-600" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center py-4">
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="p-4 space-y-2">
            {/* Resend Failed Alerts */}
            <button
              onClick={() => resendAll({ classId: classId!, date })}
              disabled={resending || failedAlerts.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 disabled:opacity-50 transition-colors shadow-sm"
            >
              {resending && (
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              )}
              Resend Failed Alerts
            </button>

            {/* Edit Attendance */}
            <button
              onClick={onEditAttendance}
              className="w-full flex items-center justify-center py-3.5 rounded-2xl border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Edit Attendance
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassDetailDrawer;
