export { default as MarketingTeamPage } from "./MarketingTeamPage";
export { default as MarketingStatCards } from "./components/MarketingStatCards";
export { default as MarketingTabs } from "./components/MarketingTabs";
export { default as TeamOverviewTab } from "./components/TeamOverviewTab";
export { default as AttendanceTab } from "./components/AttendanceTab";
export { default as TargetsTab } from "./components/TargetsTab";
export { default as PayoutsTab } from "./components/PayoutsTab";
export { default as AddRepModal } from "./components/AddRepModal";
export { RepAvatar, StatusBadge, PayoutBadge, AchievementBadge } from "./components/RepBadges";
export { useReps, useAttendance, useMarketingStats, useMarketingMutations } from "./hooks/useMarketing";
export type {
  MarketingRep, MarketingStats, TicketFilters as RepFilters,
  AttendanceRecord, RepStatus, PayoutStatus, MarketingTab,
} from "./types/marketing.types";
