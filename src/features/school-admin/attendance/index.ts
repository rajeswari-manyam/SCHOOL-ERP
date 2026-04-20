<<<<<<< HEAD
// attendance/index.ts
export { default as AttendancePage }         from "./AttendancePage";
export { default as TodayTab }               from "./components/TodayTab";
export { default as HistoryTab }             from "./components/HistoryTab";
export { default as HolidayCalendarTab }     from "./components/HolidayCalendarTab";
export { default as ClassDetailDrawer }      from "./components/ClassDetailDrawer";
export { default as MarkAttendanceModal }    from "./modals/MarkAttendanceModal";
export { default as AddHolidayModal }        from "./modals/AddHolidayModal";

export {
  ATT_KEYS,
  useTodaySummary, useTodayClasses, useClassDetail,
  useAttendanceTrend, useChronicAbsentees,
  useHolidays, useClassStudents,
  useSendReminders, useResendAlerts,
  useSubmitWebForm, useAddHoliday, useDeleteHoliday,
  MOCK_SUMMARY, MOCK_CLASSES, MOCK_CLASS_DETAIL,
  MOCK_WEB_STUDENTS, MOCK_TREND, MOCK_CHRONIC, MOCK_HOLIDAYS,
} from "./hooks/useAttendance";

export { attendanceApi } from "./api/attendance.api";

export type {
  AttendanceMethod, ClassStatus, HolidayType, AlertStatus, StudentMark,
  ClassTeacher, ClassAttendanceRow, TodaySummary,
  StudentAttendanceDetail, ClassAttendanceDetail,
  AttendanceTrendPoint, ChronicAbsentee,
  Holiday, WebFormStudent,
} from "./types/attendance.types";
=======
export { default as AttendancePage } from "./AttendancePage";
>>>>>>> 7c18aaca4dacf17d5e1f32afac3cde3f6ac84ddd
