import { useNavigate } from "react-router-dom";
import { useStudentDashboard } from "../hooks/Usestudentdashboard";
import StatCards from "../components/Statcards";
import TodaySchedule from "../components/Todayschedule";
import HomeworkList from "../components/Homeworklist";
import AttendanceCalendar from "../components/Attendancecalendar";
import RecentResults from "../components/Recentresults";
import LatestAnnouncements from "../components/Latestannouncements";

const StudentDashboardPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useStudentDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3 text-gray-500">
        <span className="text-4xl">⚠️</span>
        <p className="font-semibold">Failed to load dashboard. Please refresh.</p>
      </div>
    );
  }

  const {
    student,
    stats,
    todaySchedule,
    homeworkWeek,
    recentResults,
    latestAnnouncements,
  } = data;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex flex-col gap-6 min-h-full">
      {/* Greeting header */}
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          {greeting}, {student.name.split(" ")[0]}!
        </h1>
        <div className="flex items-center gap-2 mt-1 text-sm text-gray-400 font-medium">
          <span>🏫 {student.className}</span>
          <span>•</span>
          <span>{student.schoolName}</span>
          <span>•</span>
          <span>Roll No: {student.rollNo}</span>
        </div>
      </div>

      {/* Stat cards row */}
      <StatCards stats={stats} />

      {/* Main grid: left (schedule + homework) | right (attendance + results + announcements) */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <TodaySchedule slots={todaySchedule.slots} />
          <HomeworkList items={homeworkWeek.items} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <AttendanceCalendar attendance={stats.attendanceMonth} />
          <RecentResults
            results={recentResults}
            onViewDetailedReport={(r) => navigate(`/student/results/${r.id}`)}
          />
          <LatestAnnouncements
            announcements={latestAnnouncements}
            onViewAll={() => navigate("/student/announcements")}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;