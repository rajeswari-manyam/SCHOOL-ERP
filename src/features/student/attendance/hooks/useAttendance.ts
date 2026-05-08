import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { attendanceMock } from "../data/attendance.mock";
import type { AttendanceData } from "../types/Attendance.types";

// ─── Zustand store for month navigation ─────────────────────────────────────
interface AttendanceUIState {
  currentMonth: number;
  currentYear: number;
  setMonth: (month: number) => void;
  prevMonth: () => void;
  nextMonth: () => void;
}

export const useAttendanceStore = create<AttendanceUIState>((set) => ({
  currentMonth: 3,
  currentYear: 2025,
  setMonth: (month) => set({ currentMonth: month }),
  prevMonth: () =>
    set((s) => ({
      currentMonth: s.currentMonth === 0 ? 11 : s.currentMonth - 1,
      currentYear:
        s.currentMonth === 0 ? s.currentYear - 1 : s.currentYear,
    })),
  nextMonth: () =>
    set((s) => ({
      currentMonth: s.currentMonth === 11 ? 0 : s.currentMonth + 1,
      currentYear:
        s.currentMonth === 11 ? s.currentYear + 1 : s.currentYear,
    })),
}));

// ─── TanStack Query fetch ─────────────────────────────────────────────────────
const fetchAttendance = async (): Promise<AttendanceData> => {
  await new Promise((r) => setTimeout(r, 600));
  return attendanceMock;
};

export const useAttendance = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["attendance"],
    queryFn: fetchAttendance,
    staleTime: 5 * 60 * 1000,
  });

  return { data: data ?? null, loading: isLoading };
};
