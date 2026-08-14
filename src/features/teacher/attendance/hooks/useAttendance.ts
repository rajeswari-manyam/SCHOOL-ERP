// teacher/attendance/hooks/useAttendance.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceApi } from "@/services/teacher-attendance.api";
import { getAllHolidays } from "../../../../services/holidays.api";
import type {
  MarkAttendancePayload,
} from "../types/attendance.types";

// ── Query keys ────────────────────────────────────────────────────────────────
export const ATTENDANCE_KEYS = {
  all:         ["attendance"] as const,
  today:       () => [...ATTENDANCE_KEYS.all, "today"]   as const,
  todaySummary:(teacherId: string) => [...ATTENDANCE_KEYS.all, "today-summary", teacherId] as const,
  students:    () => [...ATTENDANCE_KEYS.all, "students"] as const,
  myHistory:   () => [...ATTENDANCE_KEYS.all, "my-history"] as const,
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
    onSuccess: () => qc.invalidateQueries({ queryKey: ATTENDANCE_KEYS.all, refetchType: "all" }),
  });
};

export const useRetryWaAlert = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (_studentId: string) => Promise.resolve(), // endpoint not yet on backend
    onSuccess: () => qc.invalidateQueries({ queryKey: ATTENDANCE_KEYS.today(), refetchType: "all" }),
  });
};

// Corrects a single student's attendance for a given date. The backend has no
// approval-queue endpoint — this looks up the real attendance record id for
// (studentId, date) then updates it directly via PUT /tenant/updateattendanceById.
export const useUpdateStudentAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ studentId, date, status, remarks }: {
      studentId: string; date: string; status: string; remarks?: string;
    }) => {
      const { getAllAttendance, updateAttendanceById } = await import("@/services/attendance.api");
      const res = await getAllAttendance(studentId, date);
      const record = res.data?.[0];
      if (!record) throw new Error("No attendance record found for this student on this date.");
      return updateAttendanceById(record.id, { status, remarks });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ATTENDANCE_KEYS.all, refetchType: "all" }),
  });
};

// ── Staff (teacher) own monthly attendance ────────────────────────────────────
export const useStaffMonthlyAttendance = (staffId: string, month: number, year: number) =>
  useQuery({
    queryKey: [...ATTENDANCE_KEYS.all, "staff-monthly", staffId, month, year],
    queryFn: () => import("@/services/attendance.api").then((m) =>
      m.getMonthlyStaffAttendance({ staff_id: staffId, month, year })
    ),
    enabled: Boolean(staffId),
    staleTime: 5 * 60_000,
    retry: 1,
  });

// ── All staff attendance records by staff ID ──────────────────────────────────
export const useStaffAttendanceByStaffId = (staffId: string) =>
  useQuery({
    queryKey: [...ATTENDANCE_KEYS.all, "staff-by-id", staffId],
    queryFn: () => import("@/services/attendance.api").then((m) =>
      m.getStaffAttendanceByStaffId(staffId)
    ),
    enabled: Boolean(staffId),
    staleTime: 5 * 60_000,
    retry: 1,
  });

// ── Teacher attendance summary by date range ──────────────────────────────────
export const useTeacherAttendanceSummaryRange = (
  teacherId: string,
  fromDate: string,
  toDate: string,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: [...ATTENDANCE_KEYS.all, "summary-range", teacherId, fromDate, toDate],
    queryFn: () => attendanceApi.getTeacherAttendanceSummaryRange(teacherId, fromDate, toDate),
    enabled: Boolean(teacherId) && Boolean(fromDate) && Boolean(toDate) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });