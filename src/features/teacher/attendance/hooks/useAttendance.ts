// teacher/attendance/hooks/useAttendance.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceApi } from "@/services/teacher-attendance.api";
import { getAllHolidays } from "../../../../services/holidays.api";
import type {
  MarkAttendancePayload,
  CorrectionRequestPayload,
} from "../types/attendance.types";

// ── Query keys ────────────────────────────────────────────────────────────────
export const ATTENDANCE_KEYS = {
  all:         ["attendance"] as const,
  today:       () => [...ATTENDANCE_KEYS.all, "today"]   as const,
  todaySummary:(teacherId: string) => [...ATTENDANCE_KEYS.all, "today-summary", teacherId] as const,
  students:    () => [...ATTENDANCE_KEYS.all, "students"] as const,
  myHistory:   () => [...ATTENDANCE_KEYS.all, "my-history"] as const,
  corrections: () => [...ATTENDANCE_KEYS.all, "corrections"] as const,
  holidays:    () => [...ATTENDANCE_KEYS.all, "holidays"] as const,
};

// ── Queries ───────────────────────────────────────────────────────────────────
export const useTodayAttendance = () =>
  useQuery({
    queryKey: ATTENDANCE_KEYS.today(),
    queryFn:  attendanceApi.getToday,
    enabled: false,   // endpoint not yet on backend
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  });

export const useTodayAttendanceSummary = (teacherId: string, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ATTENDANCE_KEYS.todaySummary(teacherId),
    queryFn: () => attendanceApi.getTodayAttendanceSummary(teacherId),
    enabled: Boolean(teacherId) && (options?.enabled ?? true),
    staleTime: 1000 * 60,
    retry: 2,
    refetchOnWindowFocus: true,
  });

export const useAttendanceStudents = () =>
  useQuery({
    queryKey: ATTENDANCE_KEYS.students(),
    queryFn:  attendanceApi.getStudents,
    staleTime: 1000 * 60 * 10,
  });

export const useMyAttendanceHistory = () =>
  useQuery({
    queryKey: ATTENDANCE_KEYS.myHistory(),
    queryFn:  attendanceApi.getMyHistory,
    enabled: false,   // endpoint not yet on backend
    staleTime: 1000 * 60 * 5,
  });

export const useMyCorrectionRequests = () =>
  useQuery({
    queryKey: ATTENDANCE_KEYS.corrections(),
    queryFn:  attendanceApi.getMyCorrectionRequests,
    staleTime: 1000 * 60 * 5,
  });

// ── Holidays ───────────────────────────────────────────────────────────────────
export const useAllHolidays = () =>
  useQuery({
    queryKey: ATTENDANCE_KEYS.holidays(),
    queryFn:  () => getAllHolidays(),
    staleTime: 10 * 60_000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

// ── Mutations ─────────────────────────────────────────────────────────────────
export const useMarkAttendanceViaWeb = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: MarkAttendancePayload) => attendanceApi.markViaWeb(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ATTENDANCE_KEYS.all }),
  });
};

export const useRetryWaAlert = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (_studentId: string) => Promise.resolve(), // endpoint not yet on backend
    onSuccess: () => qc.invalidateQueries({ queryKey: ATTENDANCE_KEYS.today() }),
  });
};

export const useSubmitCorrectionRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CorrectionRequestPayload) => attendanceApi.submitCorrection(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ATTENDANCE_KEYS.corrections() }),
  });
};

// ── Teacher attendance summary by date range ──────────────────────────────────
export const useTeacherAttendanceSummaryRange = (
  teacherId: string,
  fromDate: string,
  toDate: string
) =>
  useQuery({
    queryKey: [...ATTENDANCE_KEYS.all, "summary-range", teacherId, fromDate, toDate],
    queryFn: () => attendanceApi.getTeacherAttendanceSummaryRange(teacherId, fromDate, toDate),
    enabled: Boolean(teacherId) && Boolean(fromDate) && Boolean(toDate),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });