import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleted holiday:", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "holidays"] });
    },
  });
};

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      studentId: string;
      date: string;
      status: "present" | "absent" | "late";
    }) => {
      console.log("Marked:", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
};

export const useBulkMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
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
  });
};

export const useExportCSV = () => {
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