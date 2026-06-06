// src/features/dashboard/pages/DashboardPage.tsx
// No config needed — all data is derived from the Zustand auth store automatically.

import { useNavigate } from "react-router-dom";
import { useDashboard }                                from "../hooks/useDashboard";
import { DashboardStatCard, DashboardStatGrid }        from "../components/DashboardStatCard";
import { ScheduleTable }                               from "../components/ScheduleTable";
import { HomeworkList }                                from "../components/Homeworklist";
import { AttendanceCalendar }                          from "../components/Attendancecalendar";
import { RecentResults }                               from "../components/Recentresults";
import { LatestAnnouncements }                         from "../components/Latestannouncements";
import type { StatItem }                               from "../types/dashboard.types";
import {
  CalendarDays, Percent, BookOpen, FileText,
  GraduationCap, Loader2,
} from "lucide-react";
import { MdLocationCity } from "react-icons/md";
import { TbListNumbers }  from "react-icons/tb";

// ─── Icon helpers ──────────────────────────────────────────────────────────────
const iconColorMap: Record<string, string> = {
  attendance: "#00714D",
  percent:    "#3525CD",
  homework:   "#854F0B",
  exam:       "#3525CD",
};

const getIcon = (type: StatItem["iconType"]) => {
  const color = iconColorMap[type ?? ""] ?? "#3525CD";
  switch (type) {
    case "attendance": return <CalendarDays size={15} color={color} />;
    case "percent":    return <Percent      size={15} color={color} />;
    case "homework":   return <BookOpen     size={15} color={color} />;
    case "exam":       return <FileText     size={15} color={color} />;
    default:           return null;
  }
};

const getVariant = (
  type: StatItem["iconType"]
): "default" | "success" | "warning" | "info" => {
  switch (type) {
    case "attendance": return "success";
    case "homework":   return "warning";
    case "percent":
    case "exam":       return "info";
    default:           return "default";
  }
};

// ─── Loading ───────────────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3 text-slate-400">
      <Loader2 size={32} className="animate-spin" />
      <p className="text-sm font-medium">Loading your dashboard…</p>
    </div>
  </div>
);

// ─── Error ─────────────────────────────────────────────────────────────────────
const ErrorState = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center space-y-2 text-red-500">
      <p className="text-base font-semibold">Failed to load dashboard</p>
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  </div>
);

// ─── Dashboard ─────────────────────────────────────────────────────────────────
export const Dashboard = () => {
  const {
    loading,
    error,
    studentName,
    rollNumber,
    studentClass,
    studentSection,
    studentSchoolCode,
    stats,
    schedule,
    homework,
    attendance,
    attendanceToday,
    attendanceMonthLabel,
    recentResult,
    announcements,
  } = useDashboard(); // ← no config arg; reads from auth store internally

  const navigate = useNavigate();

  const cardRoutes: Record<string, string> = {
    attendance: "/student/attendance",
    percent:    "/student/attendance",
    homework:   "/student/homework",
    exam:       "/student/exams",
  };

  if (loading) return <LoadingSkeleton />;
  if (error)   return <ErrorState message={error} />;

  return (
    <div className="min-h-screen">
      <main className="p-3 sm:p-4 md:p-6 max-w-screen-xl mx-auto space-y-4 sm:space-y-5">

        {/* ── GREETING ── */}
        <div className="px-1 sm:px-2 py-2 sm:py-3">
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
            Good morning, {studentName}!
          </h1>

          <div className="text-xs sm:text-sm flex flex-wrap items-center gap-2 mt-1 text-slate-500">

            <span className="flex items-center gap-1">
              <GraduationCap size={14} className="text-slate-400" />
              Class {studentClass}{studentSection}
            </span>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <span className="flex items-center gap-1">
              <MdLocationCity size={14} className="text-slate-400" />
              {studentSchoolCode}
            </span>

            {rollNumber && (
              <>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <TbListNumbers size={14} className="text-slate-400" />
                  Roll No: {rollNumber}
                </span>
              </>
            )}

          </div>
        </div>

        {/* ── STATS ── */}
        <DashboardStatGrid>
          {stats.map((item, i) => (
            <DashboardStatCard
              key={i}
              label={item.title}
              value={item.value}
              sub={item.extra}
              icon={getIcon(item.iconType)}
              variant={getVariant(item.iconType)}
              active={item.iconType === "homework"}
              onClick={() => {
                const route = cardRoutes[item.iconType ?? ""];
                if (route) navigate(route);
              }}
            />
          ))}
        </DashboardStatGrid>

        {/* ── MAIN LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 sm:gap-5">

          <div className="space-y-4 sm:space-y-5">
            <ScheduleTable data={schedule} />
            <HomeworkList  data={homework} />
          </div>

          <div className="space-y-4 sm:space-y-5">
            <AttendanceCalendar
              data={attendance}
              today={attendanceToday}
              monthLabel={attendanceMonthLabel}
            />
            {recentResult ? (
              <RecentResults data={recentResult} />
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-400">
                No recent results available.
              </div>
            )}
            <LatestAnnouncements data={announcements} />
          </div>

        </div>
      </main>
    </div>
  );
};