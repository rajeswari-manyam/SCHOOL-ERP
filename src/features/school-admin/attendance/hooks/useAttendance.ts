import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceApi } from "../api/attendance.api";
import { useAttendanceStore } from "../store/attendance.store";

// ── Today ──────────────────────────────────────────────────────────────────────
export const useAttendanceToday = () => {
  return useQuery({
    queryKey: ["attendance", "today"],
    queryFn: attendanceApi.getTodayAttendance,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
// ✅ ADD THIS
export const useHolidays = () => {
  return useQuery({
    queryKey: ["attendance", "holidays"],
    queryFn: async () => {
      // dummy data (since no API)
      return [
        { id: "1", name: "Diwali", date: "2025-11-01" },
        { id: "2", name: "Pongal", date: "2025-01-14" },
      ];
    },
  });
};










// ✅ ADD THIS
export const useDeleteHoliday = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log("delete holiday", id);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "holidays"] });
    },
  });
};
export const useClassDetails = (classId: string | null) => {
  return useQuery({
    queryKey: ["attendance", "class", classId],
    queryFn: () => attendanceApi.getClassDetails(classId!),
    enabled: !!classId,
    staleTime: 5 * 60 * 1000,
  });
};

// ── History ───────────────────────────────────────────────────────────────────
export const useAttendanceTrend = (filters: { dateFrom: string; dateTo: string; classFilter?: string }) => {
  return useQuery({
    queryKey: ["attendance", "history", filters],
    queryFn: () => attendanceApi.getAttendanceHistory({
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      classId: filters.classFilter && filters.classFilter !== "All Classes" ? filters.classFilter : undefined,
    }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useChronicAbsentees = () => {
  return useQuery({
    queryKey: ["attendance", "chronic-absentees"],
    queryFn: attendanceApi.getChronicAbsentees,
    staleTime: 10 * 60 * 1000,
  });
};

// ── Holidays ──────────────────────────────────────────────────────────────────
export const useHolidaysWithMutations = () => {
  const holidaysQuery = useHolidays();
  const createHolidayMutation = useCreateHoliday();
  const deleteHolidayMutation = useDeleteHoliday();

  return {
    holidays: holidaysQuery.data ?? [],
    isLoading: holidaysQuery.isLoading,
    addHoliday: createHolidayMutation.mutate,
    deleteHoliday: deleteHolidayMutation.mutate,
  };
};

// ── Mutations ─────────────────────────────────────────────────────────────────
export const useMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentId,
      date,
      status,
    }: {
      studentId: string;
      date: string;
      status: "present" | "absent" | "late";
    }) => attendanceApi.markAttendance(studentId, date, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
};

export const useBulkMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classId,
      date,
      attendance,
    }: {
      classId: string;
      date: string;
      attendance: Record<string, "present" | "absent" | "late">;
    }) => attendanceApi.bulkMarkAttendance(classId, date, attendance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
};

export const useCreateHoliday = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attendanceApi.createHoliday,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "holidays"] });
    },
  });
};

export const useSendReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_studentIds: string[]) => {
      // await attendanceApi.sendReminder(studentIds);
    return new Promise<void>((resolve) => {
  setTimeout(() => resolve(), 1000);
});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
};

export const useExportCSV = () => {
  return useMutation({
    mutationFn: async (_date: string) => {
      // await attendanceApi.exportCSV(date);
   return new Promise<void>((resolve) => {
  setTimeout(() => resolve(), 1500);
});
    },
  });
};

// ── Combined Mutations Hook ───────────────────────────────────────────────────
export const useAttendanceMutations = () => {
  const sendReminder = useSendReminder();
  const exportCSV = useExportCSV();
  const markAttendance = useMarkAttendance();

  return {
    sendReminder,
    exportCSV,
    markAttendance,
  };
};

// ── Store Hooks ───────────────────────────────────────────────────────────────
export const useAttendanceStoreActions = () => {
  const {
    setSelectedClass,
    dismissWhatsAppBanner,
    setHistoryFilters,
    addHoliday,
    deleteHoliday,
  } = useAttendanceStore();

  return {
    setSelectedClass,
    dismissWhatsAppBanner,
    setHistoryFilters,
    addHoliday,
    deleteHoliday,
  };
};

export const useAttendanceStoreState = () => {
  const {
    selectedClassId,
    showWhatsAppBanner,
    historyFilters,
    trendData,
    chronicAbsentees,
    holidays,
  } = useAttendanceStore();

  return {
    selectedClassId,
    showWhatsAppBanner,
    historyFilters,
    trendData,
    chronicAbsentees,
    holidays,
  };
};