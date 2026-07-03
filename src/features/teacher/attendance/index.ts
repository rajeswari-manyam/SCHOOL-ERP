// teacher/attendance/index.ts
// Barrel exports — same pattern as teacher/dashboard/index.ts

export { default as MyAttendancePage }        from "./Myattendancepage";
export { default as WAMethodCard }             from "./components/WAMethodCard";
export { default as TodayTab }                 from "./components/TodayTab";
export { default as MyHistoryTab }             from "./components/MyHistoryTab";
export { default as ConfirmSubmitModal }        from "./components/ConfirmSubmitModal";
export { default as CorrectionRequestModal }   from "./components/CorrectionRequestModal";

export {
  useTodayAttendance,
  useTodayAttendanceSummary,
  useAttendanceStudents,
  useMyAttendanceHistory,
  useMyCorrectionRequests,
  useMarkAttendanceViaWeb,
  useRetryWaAlert,
  useSubmitCorrectionRequest,
  ATTENDANCE_KEYS,
} from "./hooks/useAttendance";

export { attendanceApi }  from "@/services/teacher-attendance.api";

export type {
  AttendanceMark,
  AttendanceStatus,
  AttendanceMethod,
  CorrectionStatus,
  AttendanceStudent,
  AbsentEntry,
  TodayAttendance,
  AttendanceHistoryEntry,
  MarkAttendancePayload,
  CorrectionRequestPayload,
  CorrectionRequest,
} from "./types/attendance.types";