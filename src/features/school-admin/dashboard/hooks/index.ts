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

/** Fetch today's attendance from dedicated endpoint */
export function useSchoolTodayAttendance() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'today-attendance'],
    queryFn: () => dashboardApi.getSchoolTodayAttendance(),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 2,
  });
}

/** Fetch class attendance status (stat card count) from dedicated endpoint */
export function useClassAttendanceStatus() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'class-attendance-status'],
    queryFn: () => dashboardApi.getClassAttendanceStatus(),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 2,
  });
}

/** Fetch class-wise today's attendance from dedicated endpoint */
export function useClassTodayAttendance() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'class-today-attendance'],
    queryFn: () => dashboardApi.getClassTodayAttendance(),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 2,
  });
}

/** Fetch all classes today's attendance from /tenant/getallclassestodayattendance */
export function useAllClassesTodayAttendance() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'all-classes-today-attendance'],
    queryFn: () => dashboardApi.getAllClassesTodayAttendance(),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 2,
  });
}

/** Fetch admissions-this-week data from dedicated endpoint */
export function useAdmissionsThisWeek() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'admissions-this-week'],
    queryFn: () => dashboardApi.getAdmissionsThisWeek(),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 2,
  });
}

/** Fetch all enquiries and build pipeline stage counts for AdmissionsPipeline */
export function useEnquiriesPipeline() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'enquiries-pipeline'],
    queryFn: () => dashboardApi.getEnquiriesPipeline(),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 2,
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
