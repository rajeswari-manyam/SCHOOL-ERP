// Page
export { default as AttendanceDashboardPage } from "../dashboard/components/Attendancecalendar";

// Components
export { default as StatCards } from "./components/Statcards";
export { default as AttendanceCalendar } from "./components/Attendancecalendar";
export { default as AbsentDaysPanel } from "./components/Absentdayspanel";
export { default as AttendancePolicyBar } from "./components/Attendancepolicybar";

// Hooks
export {
  useAttendanceDashboard,
  useMonthAttendance,
  useMonthNavigation,
  ATTENDANCE_KEYS,
} from "./hooks/Useattendance";

// API
export { attendanceApi } from "./api/Attendance.api";

// Types
export type {
  AttendanceStatus,
  AttendanceDay,
  MonthAttendance,
  YearAttendance,
  AttendancePolicy,
  AbsentDayDetail,
  StudentInfo,
  AttendanceDashboardResponse,
} from "./types/Attendance.types";

// Utils
export {
  getMonthStartOffset,
  getDaysInMonth,
  ATTENDANCE_CELL_STYLES,
  ATTENDANCE_DOT_COLORS,
  POLICY_STATUS_STYLES,
  formatPercentage,
  getMonthLabel,
} from "./utils/Attendance.utils";