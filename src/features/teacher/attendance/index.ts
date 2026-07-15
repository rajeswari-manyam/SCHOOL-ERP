// teacher/attendance/index.ts
// Barrel exports — same pattern as teacher/dashboard/index.ts

export { default as MyAttendancePage }        from "./Myattendancepage";
export { default as WAMethodCard }             from "./components/WAMethodCard";
export { default as TodayTab }                 from "./components/TodayTab";
export { default as MyHistoryTab }             from "./components/MyHistoryTab";
export { default as ConfirmSubmitModal }        from "./components/ConfirmSubmitModal";
export { default as EditAttendanceModal }      from "./components/EditAttendanceModal";

export {
  useTodayAttendance,
  useTodayAttendanceSummary,
  useAttendanceStudents,
  useMyAttendanceHistory,
  useMarkAttendanceViaWeb,
  useRetryWaAlert,
  useUpdateStudentAttendance,
  ATTENDANCE_KEYS,
} from "./hooks/useAttendance";

export { attendanceApi }  from "@/services/teacher-attendance.api";

export type {
  AttendanceStatus,
  AttendanceMethod,
  AttendanceStudent,
  AbsentEntry,
  TodayAttendance,
  AttendanceHistoryEntry,
  MarkAttendancePayload,
} from "./types/attendance.types";
export type { EditAttendanceTarget } from "./components/EditAttendanceModal";