import { useNavigate } from "react-router-dom";
import { AlertCircle, Check, Send, MessageCircle } from "lucide-react";
import  ProgressRing  from "@/components/ui/progress-ring";
import type { AttendanceBanner as AttendanceBannerType } from "../types/teacher-dashboard.types";
import { useMarkAttendanceViaWA } from "../hooks/useTeacherDashboard";

interface AttendanceBannerProps {
  banner: AttendanceBannerType;
}

// ── Shared icon circle ────────────────────────────────────────────────────────
function IconCircle({
  bg,
  children,
}: {
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      className={[
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
        bg,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

// ── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({
  dot,
  label,
  color,
}: {
  dot: string;
  label: string;
  color: string;
}) {
  return (
    <span className={`flex items-center gap-1.5 text-sm font-semibold ${color}`}>
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

// ── AttendanceBanner ──────────────────────────────────────────────────────────
const AttendanceBanner = ({ banner }: AttendanceBannerProps) => {
  const navigate = useNavigate();
  const goToMarkAttendance = () =>
    navigate("/teacher/dashboard/mark-attendance", { state: { totalStudents: banner.totalStudents } });
  const { mutate: markViaWA, isPending } = useMarkAttendanceViaWA();

  const pct =
    banner.status === "MARKED"
      ? Math.round(((banner.presentCount ?? 0) / banner.totalStudents) * 100)
      : 0;

  // ── MARKED state ────────────────────────────────────────────────────────────
  if (banner.status === "MARKED") {
    return (
      <div className="flex flex-col gap-3" role="status" aria-live="polite">

        {/* Main marked card */}
        <div
          className={[
            "flex flex-col gap-3 rounded-2xl border border-emerald-200 dark:border-emerald-800",
            "bg-emerald-50 dark:bg-emerald-950/40 px-4 py-4 sm:px-5",
            "sm:flex-row sm:flex-wrap sm:items-center sm:gap-4",
          ].join(" ")}
        >
          {/* Icon + title */}
          <div className="flex items-center gap-2.5 sm:shrink-0">
            <IconCircle bg="bg-emerald-500">
              <Check size={14} className="text-white" strokeWidth={3} aria-hidden="true" />
            </IconCircle>
            <div>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300 leading-tight">
                Attendance Marked
              </p>
              <p className="text-xs text-emerald-500 dark:text-emerald-400">
                Marked at {banner.markedAt}
              </p>
            </div>
          </div>

          {/* Stats row — wraps on very small screens */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 sm:gap-5">
            <StatPill
              dot="bg-emerald-500"
              label={`${banner.presentCount} Present`}
              color="text-emerald-600 dark:text-emerald-400"
            />
            <StatPill
              dot="bg-red-500"
              label={`${banner.absentCount} Absent`}
              color="text-red-500 dark:text-red-400"
            />
            {(banner.halfDayCount ?? 0) > 0 && (
              <StatPill
                dot="bg-amber-400"
                label={`${banner.halfDayCount} Half Day`}
                color="text-amber-500 dark:text-amber-400"
              />
            )}
          </div>

          {/* Progress ring — pushed right on desktop */}
          <div className="flex items-center gap-2 sm:ml-auto">
            <p className="text-xs font-medium text-emerald-500 dark:text-emerald-400">
              {pct}% attendance
            </p>
            <div
              className="relative flex h-10 w-10 items-center justify-center"
              aria-label={`${pct}% attendance`}
              role="img"
            >
              <ProgressRing
                value={pct}
                size={40}
                strokeWidth={4}
                trackColor="#d1fae5"
                indicatorColor="#10b981"
                className="absolute inset-0"
              />
              <span className="relative z-10 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                {pct}%
              </span>
            </div>
          </div>
        </div>

        {/* WA notification card */}
        <div
          className={[
            "flex flex-col gap-2 rounded-2xl border border-[#25d366]/30 dark:border-[#25d366]/20",
            "bg-[#25d366]/10 dark:bg-[#25d366]/[0.07] px-4 py-3 sm:flex-row sm:items-center sm:gap-3",
          ].join(" ")}
        >
          <IconCircle bg="bg-[#25d366]">
            <MessageCircle size={14} className="text-white" aria-hidden="true" />
          </IconCircle>
          <p className="text-sm font-medium text-green-700 dark:text-green-300 leading-snug">
            Parents have been notified via WhatsApp. Reply with{" "}
            <strong className="font-bold">"P"</strong> for present,{" "}
            <strong className="font-bold">"A"</strong> for absent.
          </p>
        </div>

      </div>
    );
  }

  // ── NOT_MARKED state ─────────────────────────────────────────────────────────
  return (
      <div
        role="alert"
        className={[
          "flex flex-col gap-3 rounded-2xl border border-red-200 dark:border-red-800",
          "bg-red-50 dark:bg-red-950/40 px-4 py-4 sm:px-5",
          "sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4",
        ].join(" ")}
      >
        {/* Warning icon + message */}
        <div className="flex items-start gap-3 sm:items-center">
          <IconCircle bg="bg-red-100 dark:bg-red-900/50">
            <AlertCircle
              size={14}
              className="text-red-500 dark:text-red-400"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </IconCircle>
          <div>
            <p className="text-sm font-bold text-red-700 dark:text-red-300 leading-tight">
              Attendance Not Marked Yet
            </p>
            <p className="text-xs text-red-400 dark:text-red-500 mt-0.5">
              Mark attendance before 10 AM to avoid a flag
            </p>
          </div>
        </div>

        {/* Action buttons — full-width stacked on mobile, inline on sm+ */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => markViaWA()}
            disabled={isPending}
            className={[
              "flex w-full items-center justify-center gap-1.5 sm:w-auto",
              "rounded-xl px-4 py-2.5 text-sm font-semibold text-white",
              "bg-[#25d366] hover:bg-[#1ebe5a] active:scale-95",
              "transition-all duration-150 shadow-sm",
              "disabled:cursor-not-allowed disabled:opacity-60",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[#25d366] focus-visible:ring-offset-2",
            ].join(" ")}
          >
            <Send size={13} aria-hidden="true" />
            {isPending ? "Sending…" : "Mark via WhatsApp"}
          </button>

          <button
            type="button"
            onClick={goToMarkAttendance}
            className={[
              "flex w-full items-center justify-center gap-1.5 sm:w-auto",
              "rounded-xl border border-red-300 dark:border-red-700",
              "bg-white dark:bg-slate-900 px-4 py-2.5",
              "text-sm font-semibold text-red-600 dark:text-red-400",
              "hover:bg-red-50 dark:hover:bg-red-950/40 active:scale-95",
              "transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-red-400 focus-visible:ring-offset-2",
            ].join(" ")}
          >
            Mark via Web Form
          </button>
        </div>
      </div>
  );
};

export default AttendanceBanner;