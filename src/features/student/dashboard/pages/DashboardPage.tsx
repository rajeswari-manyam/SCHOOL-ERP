
import { useDashboard } from "../hooks/useDashboard";
import {
  DashboardStatCard,
  DashboardStatGrid,
} from "../components/DashboardStatCard";
import { ScheduleTable } from "../components/ScheduleTable";
import { HomeworkList } from "../components/Homeworklist";
import { AttendanceCalendar } from "../components/Attendancecalendar";
import { RecentResults } from "../components/Recentresults";
import { LatestAnnouncements } from "../components/Latestannouncements";
import type { StatItem } from "../types/dashboard.types";
import {
  CalendarDays,
  Percent,
  BookOpen,
  FileText,
  GraduationCap,
} from "lucide-react";
import { MdLocationCity } from "react-icons/md";
import { TbListNumbers } from "react-icons/tb";
import { motion, easeOut } from "framer-motion";
// ─── Animation variants ────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: easeOut } 
  },
};
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

// ─── Skeleton loader ───────────────────────────────────────────────────────────
const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse" />
    ))}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────
export const Dashboard = () => {
  const {
    stats,
    schedule,
    homework,
    attendance,
    recentResult,
    announcements,
    isLoading,
  } = useDashboard();

  return (
    <div className="min-h-screen">
      <main className="p-3 sm:p-4 md:p-6 max-w-screen-xl mx-auto space-y-4 sm:space-y-5">

        {/* ───── GREETING ───── */}
        <motion.div
          className="px-1 sm:px-2 py-2 sm:py-3"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
            Good morning, Ravi!
          </h1>
          <div className="text-xs sm:text-sm flex flex-wrap items-center gap-2 mt-1 text-slate-500">
            <span className="flex items-center gap-1">
              <GraduationCap size={14} className="text-slate-400" />
              Class 10A
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <MdLocationCity size={14} className="text-slate-400" />
              Hanamkonda Public School
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <TbListNumbers size={14} className="text-slate-400" />
              Roll No: 01
            </span>
          </div>
        </motion.div>

        {/* ───── STATS GRID ───── */}
        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <DashboardStatGrid>
              {stats.map((item, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <DashboardStatCard
                    label={item.title}
                    value={item.value}
                    sub={item.extra}
                    icon={getIcon(item.iconType)}
                    variant={getVariant(item.iconType)}
                    active={item.iconType === "homework"}
                  />
                </motion.div>
              ))}
            </DashboardStatGrid>
          </motion.div>
        )}

        {/* ───── MAIN LAYOUT ───── */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 sm:gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* LEFT SECTION */}
          <motion.div className="space-y-4 sm:space-y-5" variants={itemVariants}>
            <ScheduleTable data={schedule} />
            <HomeworkList data={homework} />
          </motion.div>

          {/* RIGHT SECTION */}
          <motion.div className="space-y-4 sm:space-y-5" variants={itemVariants}>
            <AttendanceCalendar
              data={attendance}
              today={24}
              monthLabel="My Attendance – April"
            />
            {recentResult && <RecentResults data={recentResult} />}
            <LatestAnnouncements data={announcements} />
          </motion.div>
        </motion.div>

      </main>
    </div>
  );
};
