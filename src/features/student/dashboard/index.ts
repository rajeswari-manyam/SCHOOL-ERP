// Page
export { default as StudentDashboardPage } from "./components/Studentdashboardpage";

// Components
export { default as StatCards } from "./components/Statcards";
export { default as TodaySchedule } from "./components/Todayschedule";
export { default as HomeworkList } from "./components/Homeworklist";
export { default as AttendanceCalendar } from "./components/Attendancecalendar";
export { default as RecentResults } from "./components/Recentresults";
export { default as LatestAnnouncements } from "./components/Latestannouncements";

// Hooks
export {
  useStudentDashboard,
  useAttendance,
  useTodaySchedule,
  useHomeworkWeek,
  useRecentResults,
  useAnnouncements,
  useDownloadHomeworkBrief,
  STUDENT_DASHBOARD_KEYS,
} from "./hooks/Usestudentdashboard";

// API
export { studentDashboardApi } from "./api/Student dashboard.api";

// Types
export type {
  AttendanceStatus,
  AttendanceDay,
  AttendanceMonth,
  Period,
  BreakSlot,
  ScheduleSlot,
  TodaySchedule as TodayScheduleData,
  HomeworkItem,
  HomeworkWeek,
  ExamResult,
  ExamResultStatus,
  Announcement,
  StudentInfo,
  DashboardStatCards,
  StudentDashboardResponse,
} from "./types/Student dashboard.types";

// Utils
export {
  formatDisplayDate,
  formatDueDate,
  getTodayDateLabel,
  getTimeAgo,
  getScorePercentage,
  ATTENDANCE_COLORS,
  ATTENDANCE_DOT_COLORS,
  RESULT_STATUS_STYLES,
  ANNOUNCEMENT_ICON_CONFIG,
  WEEK_DAYS,
  getMonthStartOffset,
} from "./utils/Student dashboard.utils";