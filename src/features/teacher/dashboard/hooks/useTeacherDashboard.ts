import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherDashboardApi } from "../api/teacher-dashboard.api";

export const TEACHER_KEYS = {
  all:       ["teacher"] as const,
  dashboard: () => [...TEACHER_KEYS.all, "dashboard"] as const,
};

export const useTeacherDashboard = () =>
  useQuery({
    queryKey: TEACHER_KEYS.dashboard(),
    queryFn:  teacherDashboardApi.getDashboard,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  });

export const useMarkAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: teacherDashboardApi.markAttendanceViaWeb,
    onSuccess: () => qc.invalidateQueries({ queryKey: TEACHER_KEYS.all }),
  });
};

export const useMarkAttendanceViaWA = () =>
  useMutation({ mutationFn: teacherDashboardApi.markAttendanceViaWA });

export const useAssignHomework = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: teacherDashboardApi.assignHomework,
    onSuccess: () => qc.invalidateQueries({ queryKey: TEACHER_KEYS.all }),
  });
};

export const useUploadMaterial = () =>
  useMutation({ mutationFn: teacherDashboardApi.uploadMaterial });

export const useApplyLeave = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: teacherDashboardApi.applyLeave,
    onSuccess: () => qc.invalidateQueries({ queryKey: TEACHER_KEYS.all }),
  });
};
