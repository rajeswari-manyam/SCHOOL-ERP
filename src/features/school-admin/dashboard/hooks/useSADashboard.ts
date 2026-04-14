import { useQuery, useMutation } from "@tanstack/react-query";
import { saDashboardApi } from "../api/sa-dashboard.api";

export const SA_KEYS = {
  all:       ["school-admin"] as const,
  dashboard: () => [...SA_KEYS.all, "dashboard"] as const,
};

export const useSADashboard = () =>
  useQuery({
    queryKey: SA_KEYS.dashboard(),
    queryFn:  saDashboardApi.getDashboard,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60 * 2,
  });

export const useSendWAReminders = () =>
  useMutation({ mutationFn: (classes: string[]) => saDashboardApi.sendWAReminders(classes) });

export const useDownloadReport = () => {
  const handleDownload = async () => {
    const blob = await saDashboardApi.downloadReport();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `school-report-${new Date().toISOString().slice(0,10)}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return { handleDownload };
};

export const useSendBroadcast = () =>
  useMutation({ mutationFn: ({ message, target }: { message: string; target: string }) =>
    saDashboardApi.sendBroadcast(message, target) });
