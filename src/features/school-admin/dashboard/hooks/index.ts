// ─── Dashboard Hooks (TanStack Query v5) ───────────────────────────────────

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from '../api';

export const DASHBOARD_QUERY_KEY = ['dashboard'] as const;

/** Fetch full dashboard data */
export function useDashboard() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: () => dashboardApi.fetchDashboard(),
    staleTime: 30_000,      // 30 seconds
    refetchInterval: 60_000, // auto-refresh every minute
  });
}

/** Send WhatsApp reminders to unmarked classes */
export function useSendReminders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (classes: string[]) => dashboardApi.sendWhatsAppReminder(classes),
    onSuccess: () => {
      // Invalidate so dashboard re-fetches
      qc.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });
}
