import { create } from "zustand";
import type { AttendanceTab, AttendanceDay, AttendanceHistory } from "../types/attendance.types";

interface AttendanceState {
  activeTab: AttendanceTab;
  setActiveTab: (tab: AttendanceTab) => void;

  selectedDate: string;
  setSelectedDate: (date: string) => void;

  // Today
  todayData: AttendanceDay | null;

  // History
  historyData: AttendanceHistory | null;
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

  // Mark Attendance Modal
  showMarkAttendanceModal: boolean;
  prefilledClassId: string;
  prefilledSectionId: string;
  openMarkAttendance: (classId?: string, sectionId?: string) => void;
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

  todayData: null,
  historyData: null,

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
  prefilledClassId: "",
  prefilledSectionId: "",
  openMarkAttendance: (classId = "", sectionId = "") =>
    set({ showMarkAttendanceModal: true, prefilledClassId: classId, prefilledSectionId: sectionId }),
  closeMarkAttendance: () =>
    set({ showMarkAttendanceModal: false, prefilledClassId: "", prefilledSectionId: "" }),

  showAddHolidayModal: false,
  openAddHoliday: () => set({ showAddHolidayModal: true }),
  closeAddHoliday: () => set({ showAddHolidayModal: false }),

  showMarkStaffAttendanceModal: false,
  openMarkStaffAttendance: () => set({ showMarkStaffAttendanceModal: true }),
  closeMarkStaffAttendance: () => set({ showMarkStaffAttendanceModal: false }),
}));
