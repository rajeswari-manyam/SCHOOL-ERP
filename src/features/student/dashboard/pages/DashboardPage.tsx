import { useDashboard } from "../hooks/useDashboard";
import { StatCard } from "../../../../components/ui/statcard";
import { ScheduleTable } from "../components/ScheduleTable";
import { HomeworkList } from "../components/HomeWorkList";
import { AttendanceCalendar } from "../components/AttendanceCalendar";
import { RecentResults } from "../components/RecentResults";
import { LatestAnnouncements } from "../components/LatestAnnouncements";
import {
  CalendarDays,
  Percent,
  BookOpen,
  FileText,
} from "lucide-react";
const getIcon = (type: StatItem["iconType"]) => {
  switch (type) {
    case "attendance":
      return <CalendarDays size={18} />;
    case "percent":
      return <Percent size={18} />;
    case "homework":
      return <BookOpen size={18} />;
    case "exam":
      return <FileText size={18} />;
    default:
      return null;
  }
};
export const Dashboard = () => {
  const { stats, schedule, homework, attendance, recentResult, announcements } = useDashboard();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            S
          </div>
          <span className="text-sm font-semibold text-gray-800">School ERP</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Student Portal</span>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-semibold">
            R
          </div>
        </div>
      </header>

      <main className="p-6 max-w-screen-xl mx-auto space-y-5">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((item, i) => (
 <StatCard
  key={i}
  label={item.title}           // ✅ FIX
  value={item.value}
  badge={item.badge}
  sub={item.extra}             // ✅ FIX
  suffixLabel={item.suffixLabel}
  icon={getIcon(item.iconType)} // ✅ FIX
/>
          ))}
        </div>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
          {/* Left column */}
          <div className="space-y-5">
            <ScheduleTable data={schedule} />
            <HomeworkList data={homework} />
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            <AttendanceCalendar data={attendance} today={24} monthLabel="My Attendance – April" />
            <RecentResults data={recentResult} />
            <LatestAnnouncements data={announcements} />
          </div>
        </div>
      </main>
    </div>
  );
};
