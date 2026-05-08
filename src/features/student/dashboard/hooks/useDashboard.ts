import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import {
  stats,
  schedule,
  homework,
  attendance,
  recentResult,
  announcements,
} from "../data/dashboard.data";
import type {
  StatItem,
  ScheduleItem,
  HomeworkItem,
  AttendanceDay,
  RecentResult,
  Announcement,
} from "../types/dashboard.types";

// ─── Zustand store for UI state ───────────────────────────────────────────────
interface DashboardUIState {
  selectedDay: number | null;
  setSelectedDay: (day: number) => void;
}

export const useDashboardStore = create<DashboardUIState>((set) => ({
  selectedDay: null,
  setSelectedDay: (day) => set({ selectedDay: day }),
}));

// ─── Simulated async fetch (ready for real API swap) ──────────────────────────
const fetchDashboard = async () => {
  await new Promise((r) => setTimeout(r, 300));
  return { stats, schedule, homework, attendance, recentResult, announcements };
};

// ─── Main hook (TanStack Query) ───────────────────────────────────────────────
export const useDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 5 * 60 * 1000,
  });

  return {
    stats: (data?.stats ?? []) as StatItem[],
    schedule: (data?.schedule ?? []) as ScheduleItem[],
    homework: (data?.homework ?? []) as HomeworkItem[],
    attendance: (data?.attendance ?? []) as AttendanceDay[],
    recentResult: data?.recentResult as RecentResult | undefined,
    announcements: (data?.announcements ?? []) as Announcement[],
    isLoading,
  };
};
