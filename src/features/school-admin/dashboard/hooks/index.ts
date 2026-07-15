// ─── Dashboard Hooks (TanStack Query v5) ───────────────────────────────────

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from '@/services/dashboard.api';
import { useUIStore } from '@/store/uiStore';
import api from '@/config/axios';
import {
  useStaffList,
  useAllStaffAttendance,
} from '../../attendance/hooks/useAttendance';

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
    staleTime: 0,
    refetchOnMount: true,
    refetchInterval: 60_000,
    retry: 2,
  });
}

/** Fetch class attendance status (stat card count) from dedicated endpoint */
export function useClassAttendanceStatus() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'class-attendance-status'],
    queryFn: () => dashboardApi.getClassAttendanceStatus(),
    staleTime: 0,
    refetchOnMount: true,
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
    staleTime: 0,
    refetchOnMount: true,
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
  const academicYearId = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'enquiries-pipeline', academicYearId],
    queryFn: () => dashboardApi.getEnquiriesPipeline(academicYearId),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 2,
    enabled: !!academicYearId,
  });
}

/** Fetch all academic years and return the one matching the store's selected academicYearId */
export function useActiveAcademicYear() {
  const storeYearId = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'academic-years', storeYearId],
    queryFn: async () => {
      const { getAllAcademicYears } = await import('@/services/academicYear.api');
      const res = await getAllAcademicYears();
      const years = res?.status && Array.isArray(res?.data) ? res.data : [];
      const selected = years.find((y) => y.id === storeYearId);
      if (selected) return selected;
      const active = years.find((y) => y.active) || years[0] || null;
      return active;
    },
    staleTime: 5 * 60_000,
  });
}

// ─── Academic-Year-scoped Dashboard Hooks ─────────────────────────

/** Fetch academic-year dashboard overview */
export function useAcademicYearDashboard() {
  const academicYearId = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'ay-dashboard', academicYearId],
    queryFn: () => dashboardApi.getAcademicYearDashboard(academicYearId!),
    enabled: !!academicYearId,
    staleTime: 30_000,
  });
}

/** Fetch students for the selected academic year */
export function useAcademicYearStudents() {
  const academicYearId = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'ay-students', academicYearId],
    queryFn: () => dashboardApi.getAcademicYearStudents(academicYearId!),
    enabled: !!academicYearId,
    staleTime: 30_000,
  });
}

/** Fetch staff for the selected academic year */
export function useAcademicYearStaffs() {
  const academicYearId = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'ay-staffs', academicYearId],
    queryFn: () => dashboardApi.getAcademicYearStaffs(academicYearId!),
    enabled: !!academicYearId,
    staleTime: 30_000,
  });
}

/** Fetch classes for the selected academic year */
export function useAcademicYearClasses() {
  const academicYearId = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'ay-classes', academicYearId],
    queryFn: () => dashboardApi.getAcademicYearClasses(academicYearId!),
    enabled: !!academicYearId,
    staleTime: 30_000,
  });
}

/** Fetch subjects for the selected academic year */
export function useAcademicYearSubjects() {
  const academicYearId = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'ay-subjects', academicYearId],
    queryFn: () => dashboardApi.getAcademicYearSubjects(academicYearId!),
    enabled: !!academicYearId,
    staleTime: 30_000,
  });
}

/** Fetch attendance for the selected academic year */
export function useAcademicYearAttendance() {
  const academicYearId = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'ay-attendance', academicYearId],
    queryFn: () => dashboardApi.getAcademicYearAttendance(academicYearId!),
    enabled: !!academicYearId,
    staleTime: 30_000,
  });
}

/** Fetch exams for the selected academic year */
export function useExamsByAcademicYear() {
  const academicYearId = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'ay-exams', academicYearId],
    queryFn: () => dashboardApi.getExamsByAcademicYear(academicYearId!),
    enabled: !!academicYearId,
    staleTime: 30_000,
  });
}

/** Fetch results for the selected academic year */
export function useResultsByAcademicYear() {
  const academicYearId = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'ay-results', academicYearId],
    queryFn: () => dashboardApi.getResultsByAcademicYear(academicYearId!),
    enabled: !!academicYearId,
    staleTime: 30_000,
  });
}

/** Fetch fees for the selected academic year */
export function useFeesByAcademicYear() {
  const academicYearId = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'ay-fees', academicYearId],
    queryFn: () => dashboardApi.getFeesByAcademicYear(academicYearId!),
    enabled: !!academicYearId,
    staleTime: 30_000,
  });
}

/** GET /tenant/getdashboardsummary — fee collection summary for stat card */
export function useFeeSummary() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'fee-summary'],
    queryFn: () => dashboardApi.getFeeSummary(),
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
    retry: 2,
  });
}

/** GET /tenant/getpendingleaves — all staff pending leaves for admin */
export function usePendingLeaves() {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'pending-leaves'],
    queryFn: async () => {
      const { data } = await api.get('/tenant/getpendingleaves');
      return Array.isArray(data?.data) ? data.data : [];
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 2,
  });
}

/**
 * Teacher/staff attendance for today — derived from the existing staff list
 * and all-staff-attendance data already used on the Staff Attendance page.
 * No new endpoint needed.
 */
export function useStaffAttendanceToday() {
  const { data: staffList, isLoading: isStaffLoading } = useStaffList();
  const { data: allAttendance, isLoading: isAttendanceLoading } = useAllStaffAttendance();

  const data = useMemo(() => {
    if (!staffList) return undefined;

    const todayStr = new Date().toISOString().slice(0, 10);
    const totalStaff = staffList.length;

    const todaysStatusByStaffId = new Map<string, string>();
    for (const rec of allAttendance?.data ?? []) {
      if (rec.date === todayStr) todaysStatusByStaffId.set(rec.staff_id, rec.status);
    }

    let present = 0;
    let absent = 0;
    let marked = 0;

    for (const staff of staffList) {
      const status = todaysStatusByStaffId.get(staff.id);
      if (!status) continue;
      marked += 1;
      if (status === 'present' || status === 'late' || status === 'halfday') present += 1;
      else if (status === 'absent') absent += 1;
    }

    return { present, absent, marked, total: totalStaff, notMarked: totalStaff - marked };
  }, [staffList, allAttendance]);

  return { data, isLoading: isStaffLoading || isAttendanceLoading };
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