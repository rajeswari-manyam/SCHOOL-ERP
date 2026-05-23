import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceApi } from "../api/attendance.api";
import { useAttendanceStore } from "../store";
import type { MarkAttendanceForm } from "../types/attendance.types";

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const attendanceKeys = {
  all: ["attendance"] as const,
  today: (date?: string) => [...attendanceKeys.all, "today", date] as const,
  history: (from: string, to: string, cls: string) =>
    [...attendanceKeys.all, "history", from, to, cls] as const,
  calendar: (month: number, year: number) =>
    [...attendanceKeys.all, "calendar", month, year] as const,
};

// ─── Today ───────────────────────────────────────────────────────────────────
export const useAttendanceToday = (date?: string) => {
  return useQuery({
    queryKey: attendanceKeys.today(date),
    queryFn: () => attendanceApi.getToday(),
    refetchInterval: 60_000, // Auto-refresh every 60 seconds as shown in UI
    staleTime: 30_000,
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
