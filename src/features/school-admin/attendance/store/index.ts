import { create } from "zustand";
import type { AttendanceTab } from "../types/attendance.types";
import {
  mockAttendanceToday,
  mockAttendanceHistory,
} from "./mockData";

interface AttendanceState {
  activeTab: AttendanceTab;
  setActiveTab: (tab: AttendanceTab) => void;

  selectedDate: string;
  setSelectedDate: (date: string) => void;

  // Today
  todayData: typeof mockAttendanceToday;

  // History
  historyData: typeof mockAttendanceHistory;
  historyDateFrom: string;
  historyDateTo: string;
  historyClass: string;
  setHistoryDateFrom: (d: string) => void;
  setHistoryDateTo: (d: string) => void;
  setHistoryClass: (c: string) => void;

  // Holiday Calendar
  calendarMonth: number; // 0-indexed
  calendarYear: number;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;

  // Mark Attendance Modal (visibility only; form state lives in the component)
  showMarkAttendanceModal: boolean;
  openMarkAttendance: () => void;
  closeMarkAttendance: () => void;

  // Add Holiday Modal
  showAddHolidayModal: boolean;
  openAddHoliday: () => void;
  closeAddHoliday: () => void;

  // Mark Staff Attendance Modal
  showMarkStaffAttendanceModal: boolean;
  openMarkStaffAttendance: () => void;
  closeMarkStaffAttendance: () => void;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  activeTab: "today",
  setActiveTab: (tab) => set({ activeTab: tab }),

  selectedDate: "2025-04-07",
  setSelectedDate: (date) => set({ selectedDate: date }),

  todayData: mockAttendanceToday,
  historyData: mockAttendanceHistory,

  historyDateFrom: "2025-03-01",
  historyDateTo: "2025-04-07",
  historyClass: "All Classes",
  setHistoryDateFrom: (d) => set({ historyDateFrom: d }),
  setHistoryDateTo: (d) => set({ historyDateTo: d }),
  setHistoryClass: (c) => set({ historyClass: c }),

  calendarMonth: new Date().getMonth(),
  calendarYear: new Date().getFullYear(),
  goToPrevMonth: () => {
    const { calendarMonth, calendarYear } = get();
    if (calendarMonth === 0) {
      set({ calendarMonth: 11, calendarYear: calendarYear - 1 });
    } else {
      set({ calendarMonth: calendarMonth - 1 });
    }
  },
  goToNextMonth: () => {
    const { calendarMonth, calendarYear } = get();
    if (calendarMonth === 11) {
      set({ calendarMonth: 0, calendarYear: calendarYear + 1 });
    } else {
      set({ calendarMonth: calendarMonth + 1 });
    }
  },

  showMarkAttendanceModal: false,
  openMarkAttendance: () => set({ showMarkAttendanceModal: true }),
  closeMarkAttendance: () => set({ showMarkAttendanceModal: false }),

  showAddHolidayModal: false,
  openAddHoliday: () => set({ showAddHolidayModal: true }),
  closeAddHoliday: () => set({ showAddHolidayModal: false }),

  showMarkStaffAttendanceModal: false,
  openMarkStaffAttendance: () => set({ showMarkStaffAttendanceModal: true }),
  closeMarkStaffAttendance: () => set({ showMarkStaffAttendanceModal: false }),
}));
