export { default as DashboardPage } from "./DashboardPage";
export { default as PlatformStatCards } from "./components/PlatformStatCards";
export { default as SchoolActivityTable } from "./components/SchoolActivityTable";
export { default as PlatformHealthCard } from "./components/PlatformHealthCard";
export { default as RevenueChart } from "./components/RevenueChart";
export { default as RecentSchoolsCard } from "./components/RecentSchoolsCard";
export { default as CriticalTicketsTable } from "./components/CriticalTicketsTable";
export { useDashboard, useExportDashboard } from "./hooks/useDashboard";
export type {
  PlatformStats, SchoolActivityRow, HealthItem, CronJob,
  RecentSchool, RevenuePoint, CriticalTicket, SuperAdminDashboardData,
} from "./types/dashboard.types";
