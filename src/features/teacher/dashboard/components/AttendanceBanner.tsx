import { useState } from "react";
import type { AttendanceBanner as AttendanceBannerType } from "../types/teacher-dashboard.types";
import { useMarkAttendanceViaWA } from "../hooks/useTeacherDashboard";
import MarkAttendanceModal from "./MarkAttendanceModal";

interface AttendanceBannerProps {
  banner: AttendanceBannerType;
}

const AttendanceBanner = ({ banner }: AttendanceBannerProps) => {
  const [webModalOpen, setWebModalOpen] = useState(false);
  const { mutate: markViaWA, isPending } = useMarkAttendanceViaWA();

  if (banner.status === "MARKED") {
    const pct = Math.round(((banner.presentCount ?? 0) / banner.totalStudents) * 100);
    return (
      <>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-700">Attendance Marked</p>
              <p className="text-xs text-emerald-500">Marked at {banner.markedAt}</p>
            </div>
          </div>

          <div className="flex items-center gap-5 text-sm font-semibold ml-2">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />{banner.presentCount} Present
            </span>
            <span className="flex items-center gap-1.5 text-red-500">
              <span className="w-2 h-2 rounded-full bg-red-500" />{banner.absentCount} Absent
            </span>
            {(banner.halfDayCount ?? 0) > 0 && (
              <span className="flex items-center gap-1.5 text-amber-500">
                <span className="w-2 h-2 rounded-full bg-amber-400" />{banner.halfDayCount} Half Day
              </span>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-emerald-500 font-medium">{pct}% attendance</p>
            </div>
            <div className="w-10 h-10 rounded-full border-4 border-emerald-200 flex items-center justify-center relative">
              <svg className="absolute inset-0" width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="16" fill="none" stroke="#d1fae5" strokeWidth="4"/>
                <circle cx="20" cy="20" r="16" fill="none" stroke="#10b981" strokeWidth="4"
                  strokeDasharray={`${(pct / 100) * 100.5} 100.5`}
                  strokeLinecap="round" transform="rotate(-90 20 20)"/>
              </svg>
              <span className="text-[9px] font-bold text-emerald-600">{pct}%</span>
            </div>
          </div>
        </div>

        {/* WA instruction card */}
        <div className="bg-[#25d366]/10 border border-[#25d366]/30 rounded-2xl px-5 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#25d366] flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <p className="text-sm text-green-700 font-medium">
            Parents have been notified via WhatsApp. Reply with <span className="font-bold">"P"</span> for present, <span className="font-bold">"A"</span> for absent.
          </p>
        </div>
      </>
    );
  }

  // NOT_MARKED — red banner
  return (
    <>
      <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-red-700">Attendance Not Marked Yet</p>
            <p className="text-xs text-red-400">Mark attendance before 10 AM to avoid a flag</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => markViaWA()}
            disabled={isPending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25d366] text-white text-sm font-semibold hover:bg-[#22c55e] transition-colors shadow-sm disabled:opacity-60"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Mark via WhatsApp
          </button>
          <button
            onClick={() => setWebModalOpen(true)}
            className="px-4 py-2 rounded-xl border border-red-300 bg-white text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            Mark via Web Form
          </button>
        </div>
      </div>

      <MarkAttendanceModal open={webModalOpen} onClose={() => setWebModalOpen(false)} totalStudents={banner.totalStudents} />
    </>
  );
};

export default AttendanceBanner;
