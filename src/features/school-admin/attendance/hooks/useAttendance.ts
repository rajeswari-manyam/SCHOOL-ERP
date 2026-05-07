import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
<<<<<<< HEAD
import { useAttendanceStore } from "../store/attendance.store";

// ── Today ─────────────────────────────────────────
export const useAttendanceToday = () => {
  return useQuery({
    queryKey: ["attendance", "today"],
    queryFn: async () => {
      return [
        { id: "1", name: "Ravi", status: "present" },
        { id: "2", name: "Sita", status: "absent" },
      ];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ── Holidays ──────────────────────────────────────
export const useHolidays = () => {
  return useQuery({
    queryKey: ["attendance", "holidays"],
    queryFn: async () => [
      { id: "1", name: "Diwali", date: "2025-11-01" },
      { id: "2", name: "Pongal", date: "2025-01-14" },
    ],
  });
};

export const useDeleteHoliday = () => {
=======
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
>>>>>>> b2322df0c36881311796dd895aa45e054008ba98
  const queryClient = useQueryClient();
  const { closeMarkAttendance } = useAttendanceStore();

  return useMutation({
<<<<<<< HEAD
    mutationFn: async (id: string) => {
      console.log("Deleted holiday:", id);
    },
=======
    mutationFn: (form: MarkAttendanceForm) => attendanceApi.submitAttendance(form),
>>>>>>> b2322df0c36881311796dd895aa45e054008ba98
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      closeMarkAttendance();
    },
  });
};
<<<<<<< HEAD

export const useCreateHoliday = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (holiday: { name: string; date: string }) => {
      console.log("Created holiday:", holiday);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "holidays"] });
    },
  });
};

// ── Class Details ─────────────────────────────────
export const useClassDetails = (classId: string | null) => {
  return useQuery({
    queryKey: ["attendance", "class", classId],
    queryFn: async () => {
      return {
        classId,
        students: [
          { id: "1", name: "Ravi" },
          { id: "2", name: "Sita" },
        ],
      };
    },
    enabled: !!classId,
  });
};

// ── History ───────────────────────────────────────
export const useAttendanceTrend = (filters: {
  dateFrom: string;
  dateTo: string;
  classFilter?: string;
}) => {
  return useQuery({
    queryKey: ["attendance", "history", filters],
    queryFn: async () => {
      return [
        { date: filters.dateFrom, present: 20, absent: 5 },
        { date: filters.dateTo, present: 18, absent: 7 },
      ];
    },
  });
};

export const useChronicAbsentees = () => {
  return useQuery({
    queryKey: ["attendance", "chronic-absentees"],
    queryFn: async () => {
      return [
        { id: "2", name: "Sita", absentDays: 10 },
      ];
    },
  });
};

// ── Holidays Combined ─────────────────────────────
export const useHolidaysWithMutations = () => {
  const holidaysQuery = useHolidays();
  const createHoliday = useCreateHoliday();
  const deleteHoliday = useDeleteHoliday();

  return {
    holidays: holidaysQuery.data ?? [],
    isLoading: holidaysQuery.isLoading,
    addHoliday: createHoliday.mutate,
    deleteHoliday: deleteHoliday.mutate,
  };
};

// ── Mutations ─────────────────────────────────────
export const useMarkAttendance = () => {
=======

// ─── Add Holiday ──────────────────────────────────────────────────────────────
export const useAddHoliday = () => {
>>>>>>> b2322df0c36881311796dd895aa45e054008ba98
  const queryClient = useQueryClient();
  const { closeAddHoliday } = useAttendanceStore();

  return useMutation({
<<<<<<< HEAD
    mutationFn: async (data: {
      studentId: string;
      date: string;
      status: "present" | "absent" | "late";
    }) => {
      console.log("Marked:", data);
    },
=======
    mutationFn: attendanceApi.addHoliday,
>>>>>>> b2322df0c36881311796dd895aa45e054008ba98
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      closeAddHoliday();
    },
  });
};

// ─── Send Reminders ───────────────────────────────────────────────────────────
export const useSendReminders = () => {
  return useMutation({
<<<<<<< HEAD
    mutationFn: async (data: {
      classId: string;
      date: string;
      attendance: Record<string, "present" | "absent" | "late">;
    }) => {
      console.log("Bulk attendance:", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
};

export const useSendReminder = () => {
  return useMutation({
    mutationFn: async (studentIds: string[]) => {
      console.log("Reminder sent to:", studentIds);
    },
=======
    mutationFn: attendanceApi.sendReminders,
>>>>>>> b2322df0c36881311796dd895aa45e054008ba98
  });
};

// ─── Export CSV ───────────────────────────────────────────────────────────────
export const useExportCSV = () => {
<<<<<<< HEAD
  return useMutation({
    mutationFn: async (date: string) => {
      console.log("Export CSV for:", date);
    },
  });
};

// ── Combined Mutations ────────────────────────────
export const useAttendanceMutations = () => {
  return {
    sendReminder: useSendReminder(),
    exportCSV: useExportCSV(),
    markAttendance: useMarkAttendance(),
  };
};

// ── Store Hooks ───────────────────────────────────
export const useAttendanceStoreActions = () => {
  const store = useAttendanceStore();

  return {
    setSelectedClass: store.setSelectedClass,
    dismissWhatsAppBanner: store.dismissWhatsAppBanner,
    setHistoryFilters: store.setHistoryFilters,
    addHoliday: store.addHoliday,
    deleteHoliday: store.deleteHoliday,
  };
};

export const useAttendanceStoreState = () => {
  const store = useAttendanceStore();

  return {
    selectedClassId: store.selectedClassId,
    showWhatsAppBanner: store.showWhatsAppBanner,
    historyFilters: store.historyFilters,
    trendData: store.trendData,
    chronicAbsentees: store.chronicAbsentees,
    holidays: store.holidays,
  };
};
=======
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
>>>>>>> b2322df0c36881311796dd895aa45e054008ba98
