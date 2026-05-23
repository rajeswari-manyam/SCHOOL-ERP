export { default as TeacherDashboardPage } from "./TeacherDashboardPage";
export { default as AttendanceBanner } from "./components/AttendanceBanner";
export { default as TeacherStatCards } from "./components/TeacherStatCards";
export { default as TodayScheduleCard } from "./components/TodayScheduleCard";
export { default as QuickActionsCard } from "./components/QuickActionsCard";
export { default as HomeworkDueCard } from "./components/HomeworkDueCard";
export { default as ClassOverviewCard } from "./components/ClassOverviewCard";
export { default as MarkAttendanceModal } from "./components/MarkAttendanceModal";
export { default as AssignHomeworkModal } from "./components/AssignHomeworkModal";
export { ApplyLeaveModal, UploadMaterialModal } from "./components/TeacherModals";
export {
  useTeacherDashboard, useMarkAttendance, useMarkAttendanceViaWA,
  useAssignHomework, useUploadMaterial, useApplyLeave,
} from "./hooks/useTeacherDashboard";
export type {
  TeacherDashboardData, TeacherProfile, AttendanceBanner as AttendanceBannerType,
  Period, HomeworkItem, ClassOverview, ChronicAbsentee,
} from "./types/teacher-dashboard.types";
