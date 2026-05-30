import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceApi } from "../api/attendance.api";
import { useAttendanceStore } from "../store";
import type { MarkAttendanceForm } from "../types/attendance.types";

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const attendanceKeys = {
  all: ["attendance"] as const,
  today: (className: string, section: string, date?: string) =>
    [...attendanceKeys.all, "today", className, section, date] as const,
  history: (from: string, to: string, cls: string) =>
    [...attendanceKeys.all, "history", from, to, cls] as const,
  calendar: (month: number, year: number) =>
    [...attendanceKeys.all, "calendar", month, year] as const,
  allHolidays: (year: number) =>
    [...attendanceKeys.all, "holidays", "all", year] as const,
};

// ─── Today ───────────────────────────────────────────────────────────────────
export const useAttendanceToday = (className: string, section: string, date?: string) => {
  return useQuery({
    queryKey: attendanceKeys.today(className, section, date),
    queryFn: () => attendanceApi.getToday(className, section),
    refetchInterval: 60_000,
    staleTime: 30_000,
    enabled: !!className && !!section,
  });
};

// ─── History ─────────────────────────────────────────────────────────────────
export const useAttendanceHistory = () => {
  const { historyDateFrom, historyDateTo, historyClass } = useAttendanceStore();
  return useQuery({
    queryKey: attendanceKeys.history(historyDateFrom, historyDateTo, historyClass),
    queryFn: () =>
      attendanceApi.getHistory({
        dateFrom: historyDateFrom,
        dateTo: historyDateTo,
        classFilter: historyClass,
      }),
    staleTime: 2 * 60_000,
  });
};

// ─── Holiday Calendar ─────────────────────────────────────────────────────────
export const useHolidayCalendar = () => {
  const { calendarMonth, calendarYear } = useAttendanceStore();
  return useQuery({
    queryKey: attendanceKeys.calendar(calendarMonth, calendarYear),
    queryFn: () => attendanceApi.getHolidayCalendar(),
    staleTime: 10 * 60_000,
  });
};

// ─── All Holidays (GET /tenant/getallholidays) ────────────────────────────────
export const useAllHolidays = () => {
  const { calendarMonth, calendarYear } = useAttendanceStore();
  return useQuery({
    queryKey: attendanceKeys.allHolidays(calendarYear),
    queryFn: () => attendanceApi.getAllHolidays(calendarMonth, calendarYear),
    staleTime: 10 * 60_000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// ─── Students for Mark Attendance Modal ──────────────────────────────────────
export const useAttendanceStudents = (className: string, section: string) => {
  return useQuery({
    queryKey: [...attendanceKeys.all, "students", className, section] as const,
    queryFn: () => attendanceApi.getStudentsForMarkAttendance(className, section),
    enabled: !!className && !!section,
    staleTime: 30_000,
    retry: 1,
  });
};

// ─── Submit Attendance ────────────────────────────────────────────────────────
export const useSubmitAttendance = () => {
  const queryClient = useQueryClient();
  const { closeMarkAttendance } = useAttendanceStore();

  return useMutation({
    mutationFn: (form: MarkAttendanceForm) => attendanceApi.submitAttendance(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      closeMarkAttendance();
    },
  });
};

// ─── Add Holiday ──────────────────────────────────────────────────────────────
export const useAddHoliday = () => {
  const queryClient = useQueryClient();
  const { closeAddHoliday } = useAttendanceStore();

  return useMutation({
    mutationFn: attendanceApi.addHoliday,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.allHolidays });
      closeAddHoliday();
    },
  });
};

// ─── Send Reminders ───────────────────────────────────────────────────────────
export const useSendReminders = () => {
  return useMutation({
    mutationFn: attendanceApi.sendReminders,
  });
};

// ─── Export CSV ───────────────────────────────────────────────────────────────
export const useExportCSV = () => {
  return useMutation<Blob, unknown, { date?: string; class?: string }>({
    mutationFn: () => attendanceApi.exportCSV(),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
};
