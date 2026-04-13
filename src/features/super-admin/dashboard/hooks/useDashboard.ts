import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";

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

export const useExportDashboard = () => {
  const handleExport = async () => {
    const blob = await dashboardApi.exportReport();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `platform-overview-${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return { handleExport };
};
