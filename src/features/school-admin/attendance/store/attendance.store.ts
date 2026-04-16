import { create } from "zustand";
import type {
  AttendancePageData,
  ClassDetail,
  ChronicAbsentee,
  Holiday,
  AttendanceTrendPoint,
  AttendanceHistoryFilters,
} from "../types/attendance.types";
import {
  MOCK_ATTENDANCE_DATA,
  MOCK_CLASS_DETAILS,
  MOCK_CHRONIC_ABSENTEES,
  MOCK_HOLIDAYS,
  MOCK_TREND_DATA,
} from "../utils/constants";

interface AttendanceState {
  // ── Today ──────────────────────────────────────────────────────────────────
  todayData: AttendancePageData;
  selectedClassId: string | null;
  classDetails: Record<string, ClassDetail>;
  showWhatsAppBanner: boolean;

  // ── History ────────────────────────────────────────────────────────────────
  historyFilters: AttendanceHistoryFilters;
  trendData: AttendanceTrendPoint[];
  chronicAbsentees: ChronicAbsentee[];

  // ── Holidays ───────────────────────────────────────────────────────────────
  holidays: Holiday[];

  // ── Actions ────────────────────────────────────────────────────────────────
  setSelectedClass: (classId: string | null) => void;
  dismissWhatsAppBanner: () => void;
  setHistoryFilters: (filters: Partial<AttendanceHistoryFilters>) => void;
  addHoliday: (holiday: Omit<Holiday, "id">) => void;
  deleteHoliday: (id: string) => void;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  // ── Today ────────────────────────────────────────────────────────────────
  todayData: MOCK_ATTENDANCE_DATA,
  selectedClassId: null,
  classDetails: Object.fromEntries(MOCK_CLASS_DETAILS.map((c) => [c.id, c])),
  showWhatsAppBanner: true,

  // ── History ──────────────────────────────────────────────────────────────
  historyFilters: {
    dateFrom: "2025-03-01",
    dateTo: "2025-04-07",
  },
  trendData: MOCK_TREND_DATA,
  chronicAbsentees: MOCK_CHRONIC_ABSENTEES,

  // ── Holidays ──────────────────────────────────────────────────────────────
  holidays: MOCK_HOLIDAYS,

  // ── Actions ────────────────────────────────────────────────────────────────
  setSelectedClass: (classId) => set({ selectedClassId: classId }),
  dismissWhatsAppBanner: () => set({ showWhatsAppBanner: false }),
  setHistoryFilters: (filters) =>
    set((state) => ({
      historyFilters: { ...state.historyFilters, ...filters },
    })),
  addHoliday: (holiday) =>
    set((state) => ({
      holidays: [
        ...state.holidays,
        { ...holiday, id: Date.now().toString() },
      ],
    })),
  deleteHoliday: (id) =>
    set((state) => ({
      holidays: state.holidays.filter((h) => h.id !== id),
    })),
}));