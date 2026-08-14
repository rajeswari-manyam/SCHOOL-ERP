// src/features/student/dashboard/pages/DashboardPage.tsx

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useStudentProfile,
  useStudentAttendance,
  useStudentHomework,
  useStudentSchedule,
  useStudentExams,
} from "../hooks/useDashboard";
import { DashboardStatCard, DashboardStatGrid } from "../components/DashboardStatCard";
import { ScheduleTable } from "../components/ScheduleTable";
import { HomeworkList } from "../components/Homeworklist";
import { AttendanceCalendar } from "../components/Attendancecalendar";
import { LatestAnnouncements } from "../components/Latestannouncements";
import type { StatItem } from "../types/dashboard.types";
import {
  Skeleton,
  SkeletonStatCard,
  SkeletonTableCard,
  SkeletonListCard,
  SectionError,
} from "@/components/common/skeletons";
import {
  CalendarDays, Percent, BookOpen, FileText,
  GraduationCap,
} from "lucide-react";
import { MdLocationCity } from "react-icons/md";
import { TbListNumbers } from "react-icons/tb";

// ─── Icon helpers ──────────────────────────────────────────────────────────────
const iconColorMap: Record<string, string> = {
  attendance: "#00714D",
  percent: "#3525CD",
  homework: "#854F0B",
  exam: "#3525CD",
};

const getIcon = (type: StatItem["iconType"]) => {
  const color = iconColorMap[type ?? ""] ?? "#3525CD";
  switch (type) {
    case "attendance": return <CalendarDays size={15} color={color} />;
    case "percent": return <Percent size={15} color={color} />;
    case "homework": return <BookOpen size={15} color={color} />;
    case "exam": return <FileText size={15} color={color} />;
    default: return null;
  }
};

const getVariant = (
  type: StatItem["iconType"]
): "default" | "success" | "warning" | "info" => {
  switch (type) {
    case "attendance": return "success";
    case "homework": return "warning";
    case "percent":
    case "exam": return "info";
    default: return "default";
  }
};

// ─── Dashboard ─────────────────────────────────────────────────────────────────
export const Dashboard = () => {
  const navigate = useNavigate();

  const profileQuery = useStudentProfile();
  const profile = profileQuery.data;

  // Dependent queries stay pending until profile resolves class/section IDs,
  // so each section shows its own skeleton and resolves independently.
  const studentId = profile?.studentId ?? "";
  const classId = profile?.classId ?? "";
  const sectionId = profile?.sectionId ?? "";

  const attendanceQuery = useStudentAttendance(studentId);
  const homeworkQuery = useStudentHomework(classId, sectionId);
  const scheduleQuery = useStudentSchedule(classId, sectionId);
  const examsQuery = useStudentExams(classId, sectionId);

  const cardRoutes: Record<string, string> = {
    attendance: "/student/attendance",
    percent: "/student/attendance",
    homework: "/student/homework",
    exam: "/student/exams",
  };

  // ── Next exam (from cached exam timetable) ─────────────────────────────
  const nextExam = useMemo(() => {
    const exams = examsQuery.data ?? [];
    const todayStr = new Date().toISOString().slice(0, 10);
    const next = exams.find((e) => e.examDate >= todayStr);
    if (!next) return { value: "—", extra: "Upcoming" };
    const dateStr = new Date(next.examDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
    return { value: next.subject, extra: dateStr };
  }, [examsQuery.data]);

  const profileFailed = profileQuery.isError;

  // ── Precomputed stat values (narrowed safely before JSX) ────────────────
  const attendanceData = attendanceQuery.data;
  const homeworkCount = homeworkQuery.data?.length ?? 0;
  const monthValue =
    attendanceData && attendanceData.monthlyPct != null
      ? `${attendanceData.monthlyPct}%`
      : "—";

  // ── Per-slot stat card: skeleton while its query is pending ─────────────
  const renderStat = (
    iconType: StatItem["iconType"],
    opts: { isLoading: boolean; label: string; value: string; sub: string; badge?: StatItem["badge"] }
  ) => {
    if (opts.isLoading) {
      return <SkeletonStatCard key={opts.label} />;
    }
    return (
      <DashboardStatCard
        key={opts.label}
        label={opts.label}
        value={opts.value}
        sub={opts.sub}
        badge={opts.badge}
        icon={getIcon(iconType)}
        variant={getVariant(iconType)}
        active={iconType === "homework"}
        onClick={() => {
          const route = cardRoutes[iconType];
          if (route) navigate(route);
        }}
      />
    );
  };

  return (
    <div className="min-h-screen">
      <main className="px-3 sm:px-4 md:px-6 pt-2 pb-4 sm:pb-6 max-w-screen-xl mx-auto space-y-4 sm:space-y-5">

        {/* ── GREETING ── */}
        <div className="px-1 sm:px-2 py-1">
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
            Good morning,{" "}
            {profile ? (
              profile.studentName || "Student"
            ) : (
              <Skeleton className="inline-block h-5 w-32 align-middle" />
            )}
            !
          </h1>

          <div className="text-xs sm:text-sm flex flex-wrap items-center gap-2 mt-1 text-slate-500">
            <span className="flex items-center gap-1">
              <GraduationCap size={14} className="text-slate-400" />
              Class {profile?.studentClass || "—"}
              {profile?.studentSection && (
                <span className="text-slate-400">– {profile.studentSection}</span>
              )}
            </span>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <span className="flex items-center gap-1">
              <MdLocationCity size={14} className="text-slate-400" />
              {profile?.studentSchoolCode || ""}
            </span>

            {profile?.rollNumber && (
              <>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <TbListNumbers size={14} className="text-slate-400" />
                  Roll No: {profile.rollNumber}
                </span>
              </>
            )}
          </div>
        </div>

        {/* ── STATS — below greeting ── */}
        {profileFailed ? (
          <SectionError
            message="Couldn't load your dashboard data"
            onRetry={() => profileQuery.refetch()}
          />
        ) : (
          <DashboardStatGrid>
            {renderStat("attendance", {
              isLoading: attendanceQuery.isPending,
              label: "TODAY'S STATUS",
              value: attendanceQuery.data?.todayStatus ?? "—",
              sub: attendanceQuery.data?.todayExtra ?? "Attendance status",
              badge: { text: "Live", variant: "green" },
            })}
            {renderStat("percent", {
              isLoading: attendanceQuery.isPending,
              label: "ATTENDANCE MONTH",
              value: monthValue,
              sub: attendanceData?.monthSummary ?? "0/0 days present",
            })}
            {renderStat("homework", {
              isLoading: homeworkQuery.isPending,
              label: "HOMEWORK DUE",
              value: homeworkCount > 0 ? String(homeworkCount) : "—",
              sub: "Pending tasks",
              badge: {
                text: homeworkCount > 0 ? "Due soon" : "All done",
                variant: homeworkCount > 0 ? "amber" : "green",
              },
            })}
            {renderStat("exam", {
              isLoading: examsQuery.isPending,
              label: "NEXT EXAM",
              value: nextExam.value,
              sub: nextExam.extra,
            })}
          </DashboardStatGrid>
        )}

        {/* ── MAIN LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 sm:gap-5">

          <div className="space-y-4 sm:space-y-5">
            {profileFailed ? (
              <SectionError
                message="Couldn't load today's schedule"
                onRetry={() => profileQuery.refetch()}
              />
            ) : (
              <section>
                {scheduleQuery.isPending ? (
                  <SkeletonTableCard rows={4} minHeight="min-h-[200px]" />
                ) : scheduleQuery.isError ? (
                  <SectionError
                    message="Failed to load today's schedule"
                    onRetry={() => scheduleQuery.refetch()}
                  />
                ) : (
                  <ScheduleTable data={scheduleQuery.data ?? []} />
                )}
              </section>
            )}

            {profileFailed ? (
              <SectionError
                message="Couldn't load your homework"
                onRetry={() => profileQuery.refetch()}
              />
            ) : (
              <section>
                {homeworkQuery.isPending ? (
                  <SkeletonListCard rows={3} />
                ) : homeworkQuery.isError ? (
                  <SectionError
                    message="Failed to load homework"
                    onRetry={() => homeworkQuery.refetch()}
                  />
                ) : (
                  <HomeworkList data={homeworkQuery.data ?? []} />
                )}
              </section>
            )}
          </div>

          <div className="space-y-4 sm:space-y-5">
            {profileFailed ? (
              <SectionError
                message="Couldn't load your attendance"
                onRetry={() => profileQuery.refetch()}
              />
            ) : (
              <section>
                {attendanceQuery.isPending ? (
                  <SkeletonTableCard rows={4} minHeight="min-h-[220px]" />
                ) : attendanceQuery.isError ? (
                  <SectionError
                    message="Failed to load attendance"
                    onRetry={() => attendanceQuery.refetch()}
                  />
                ) : (
                  <AttendanceCalendar
                    data={attendanceQuery.data?.calendarDays ?? []}
                    today={attendanceQuery.data?.todayDate}
                    monthLabel={attendanceQuery.data?.monthLabel}
                  />
                )}
              </section>
            )}

            <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-400">
              No recent results available.
            </div>

            <LatestAnnouncements data={[]} />
          </div>

        </div>
      </main>
    </div>
  );
};
