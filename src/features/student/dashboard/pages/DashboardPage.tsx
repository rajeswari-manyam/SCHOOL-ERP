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


// ─── Icon helpers ─────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────
export const Dashboard = () => {
  const {
    stats,
    schedule,
    homework,
    attendance,
    recentResult,
    announcements,
  } = useDashboard();

  return (
    <div className="min-h-screen">

      <main className="p-3 sm:p-4 md:p-6 max-w-screen-xl mx-auto space-y-4 sm:space-y-5">

        {/* ───── GREETING ───── */}
        <div className="bg-white border border-gray-100 rounded-xl px-4 sm:px-6 py-4 hover:border-[#3525CD] transition-all duration-200">
          
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            Good morning, Ravi!
          </h1>

          <div className="text-xs sm:text-sm flex flex-wrap items-center gap-2 mt-1 text-gray-500">
            <span className="flex items-center gap-1">
              <GraduationCap size={14} className="text-gray-400" />
              Class 10A
            </span>

            <span className="text-gray-300 hidden sm:inline">•</span>

            <span className="flex items-center gap-1">
              <MdLocationCity size={14} className="text-gray-400" />
              Hanamkonda Public School
            </span>

            <span className="text-gray-300 hidden sm:inline">•</span>

            <span className="flex items-center gap-1">
              <TbListNumbers size={14} className="text-gray-400" />
              Roll No: 01
            </span>
          </div>
        </div>

        {/* ───── STATS GRID (RESPONSIVE) ───── */}
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
            />
          ))}
        </DashboardStatGrid>

        {/* ───── MAIN LAYOUT (STACK ON MOBILE) ───── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 sm:gap-5">

          {/* LEFT SECTION */}
          <div className="space-y-4 sm:space-y-5">
            <ScheduleTable data={schedule} />
            <HomeworkList data={homework} />
          </div>

          {/* RIGHT SECTION (BECOMES BELOW ON MOBILE) */}
          <div className="space-y-4 sm:space-y-5">
            <AttendanceCalendar
              data={attendance}
              today={24}
              monthLabel="My Attendance – April"
            />
            <RecentResults data={recentResult} />
            <LatestAnnouncements data={announcements} />
          </div>

        </div>

      </main>
    </div>
  );
};