import { stats, schedule, homework, attendance, recentResult, announcements } from "../data/dashboard.data";

export const useDashboard = () => {
  return {
    stats,
    schedule,
    homework,
    attendance,
    recentResult,
    announcements,
  };
};
