import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/services/super-admin-dashboard.api";

export const DASHBOARD_KEYS = {
  all:  ["super-admin", "dashboard"] as const,
  main: () => [...DASHBOARD_KEYS.all, "main"] as const,
};

export const useDashboard = () =>
  useQuery({
    queryKey: DASHBOARD_KEYS.main(),
    queryFn:  dashboardApi.getDashboard,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60 * 2,
  });
