import { useQuery } from "@tanstack/react-query";
import { fetchTeacherDashboardStats } from "../api/dashboard.api";

export const useTeacherDashboardStats = () => {
  return useQuery({
    queryKey: ["teacher-dashboard-stats"],
    queryFn: fetchTeacherDashboardStats,
  });
};
