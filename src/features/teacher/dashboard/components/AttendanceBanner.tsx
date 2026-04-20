import { useState } from "react";
import { AlertCircle, Check, Send } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
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
              <Check size={14} className="text-white" strokeWidth={3} />
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
            <div className="w-10 h-10 flex items-center justify-center relative">
              <ProgressRing
                value={pct}
                size={40}
                strokeWidth={4}
                trackColor="#d1fae5"
                indicatorColor="#10b981"
                className="absolute inset-0"
              />
              <span className="text-[9px] font-bold text-emerald-600">{pct}%</span>
            </div>
          </div>
        </div>

        {/* WA instruction card */}
        <div className="bg-[#25d366]/10 border border-[#25d366]/30 rounded-2xl px-5 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#25d366] flex items-center justify-center flex-shrink-0">
            <Send size={14} className="text-white" />
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
            <AlertCircle size={14} className="text-red-500" strokeWidth={2.5} />
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
            <Send size={13} className="text-white" />
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
