export { default as SchoolAdminDashboardPage } from "./SchoolAdminDashboardPage";
export { default as AlertBannerStrip } from "./components/AlertBannerStrip";
export { default as SAStatCards } from "./components/SAStatCards";
export { default as ClassAttendanceTable } from "./components/ClassAttendanceTable";
export { default as FeeDuesSummaryCard } from "./components/FeeDuesSummaryCard";
export { default as WhatsAppActivityCard } from "./components/WhatsAppActivityCard";
export { default as AdmissionsPipelineCard } from "./components/AdmissionsPipelineCard";
export { default as SendBroadcastModal } from "./components/SendBroadcastModal";
export { useSADashboard, useSendWAReminders, useDownloadReport, useSendBroadcast } from "./hooks/useSADashboard";
export type {
  SchoolAdminDashboardData, DashboardStat, ClassAttendanceRow,
  FeeDuesSummary, WAActivity, AdmissionStage, AlertBanner,
} from "./types/sa-dashboard.types";
