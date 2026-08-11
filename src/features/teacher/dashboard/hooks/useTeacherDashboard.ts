import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveApi } from "@/services/teacher-leave.api";
import { teacherDashboardApi } from "@/services/teacher-dashboard.api";
import { getMonthlyStaffAttendance, getYearlyStaffAttendance } from "@/services/attendance.api";
import { getSectionsByTeacherId } from "@/services/section.api";
import { getUpcomingExams } from "@/services/examtimetable.api";

export const TEACHER_KEYS = {
  all:                    ["teacher"] as const,
  dashboard:              () => [...TEACHER_KEYS.all, "dashboard"] as const,
  pendingHomework:        (teacherId: string) => [...TEACHER_KEYS.all, "pending-homework", teacherId] as const,
  todayTimetable:         (teacherId: string) => [...TEACHER_KEYS.all, "timetable", teacherId] as const,
  allHomework:            (teacherId: string) => [...TEACHER_KEYS.all, "all-homework", teacherId] as const,
  monthlyAttendance:      (staffId: string, month: number, year: number) => [...TEACHER_KEYS.all, "monthly-attendance", staffId, month, year] as const,
  sections:               (teacherId: string) => [...TEACHER_KEYS.all, "sections", teacherId] as const,
};

export const useTeacherDashboard = () =>
  useQuery({
    queryKey: TEACHER_KEYS.dashboard(),
    queryFn:  teacherDashboardApi.getDashboard,
    enabled:  false,   // endpoint not yet on backend (/teacher/dashboard 404)
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

export const usePendingHomeworkByTeacher = (teacherId: string, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: TEACHER_KEYS.pendingHomework(teacherId),
    queryFn: () => teacherDashboardApi.getPendingHomeworkByTeacher(teacherId),
    enabled: Boolean(teacherId) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 2,
    retry: 2,
    refetchOnWindowFocus: true,
  });

export const useTeacherTodayTimetable = (teacherId: string, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: TEACHER_KEYS.todayTimetable(teacherId),
    queryFn: () => teacherDashboardApi.getTeacherTodayTimetable(teacherId),
    enabled: Boolean(teacherId) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 2,
    retry: 2,
    refetchOnWindowFocus: true,
  });

export const useAllHomeworkList = (teacherId: string, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: TEACHER_KEYS.allHomework(teacherId),
    queryFn: () => teacherDashboardApi.getAllHomeworkList(teacherId),
    enabled: Boolean(teacherId) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 2,
    retry: 2,
    refetchOnWindowFocus: true,
  });

export const useTeacherTodayTimetableV2 = (teacherId: string, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: TEACHER_KEYS.todayTimetable(teacherId),
    queryFn: () => teacherDashboardApi.getTeacherTodayTimetableV2(teacherId),
    enabled: Boolean(teacherId) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 2,
    retry: 2,
    refetchOnWindowFocus: true,
  });

export const useTeacherSections = (teacherId: string) =>
  useQuery({
    queryKey: TEACHER_KEYS.sections(teacherId),
    queryFn: () => getSectionsByTeacherId(teacherId),
    enabled: Boolean(teacherId),
    staleTime: 10 * 60_000,
  });

export const useTeacherLeaveBalance = (staffId?: string, academicYearId?: string) =>
  useQuery({
    queryKey: ["teacher", "leave-balance", staffId, academicYearId],
    queryFn: () => leaveApi.getLeaveBalances(staffId ?? "", academicYearId),
    enabled: Boolean(staffId) && Boolean(academicYearId),
    staleTime: 5 * 60_000,
    retry: 1,
  });

export const useTeacherMonthlyAttendance = (staffId: string, month: number, year: number) =>
  useQuery({
    queryKey: TEACHER_KEYS.monthlyAttendance(staffId, month, year),
    queryFn: () => getMonthlyStaffAttendance({ staff_id: staffId, month, year }),
    enabled: Boolean(staffId),
    staleTime: 5 * 60_000,
  });

export const useTeacherYearlyAttendance = (staffId: string, year: number) =>
  useQuery({
    queryKey: [...TEACHER_KEYS.all, "yearly-attendance", staffId, year] as const,
    queryFn: () => getYearlyStaffAttendance({ staff_id: staffId, year }),
    enabled: Boolean(staffId),
    staleTime: 10 * 60_000,
  });

export const useMarkAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: teacherDashboardApi.markAttendanceViaWeb,
    onSuccess: () => qc.invalidateQueries({ queryKey: TEACHER_KEYS.all, refetchType: "all" }),
  });
};

export const useTeacherUpcomingExams = (classId: string, sectionId: string) =>
  useQuery({
    queryKey: [...TEACHER_KEYS.all, "upcoming-exams", classId, sectionId] as const,
    queryFn:  () => getUpcomingExams({ class_id: classId, section_id: sectionId }),
    enabled:  Boolean(classId) && Boolean(sectionId),
    staleTime: 5 * 60_000,
    retry: 1,
  });

export const useMarkAttendanceViaWA = () =>
  useMutation({ mutationFn: teacherDashboardApi.markAttendanceViaWA });

export const useAssignHomework = (teacherId?: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: teacherDashboardApi.assignHomework,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TEACHER_KEYS.all, refetchType: "all" });
      if (teacherId) qc.invalidateQueries({ queryKey: TEACHER_KEYS.allHomework(teacherId), refetchType: "all" });
    },
  });
};

export const useUploadMaterial = () =>
  useMutation({ mutationFn: teacherDashboardApi.uploadMaterial });

export const useApplyLeave = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: teacherDashboardApi.applyLeave,
    onSuccess: () => qc.invalidateQueries({ queryKey: TEACHER_KEYS.all, refetchType: "all" }),
  });
};