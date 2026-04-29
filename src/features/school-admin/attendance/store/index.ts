import { create } from "zustand";
import type { AttendanceTab, MarkAttendanceForm } from "../types/attendance.types";
import {
  mockAttendanceToday,
  mockAttendanceHistory,
  mockHolidayCalendar,
  mockMarkAttendanceForm,
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
  calendarData: typeof mockHolidayCalendar;
  calendarMonth: number; // 0-indexed
  calendarYear: number;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;

  // Mark Attendance Modal
  showMarkAttendanceModal: boolean;
  markAttendanceForm: MarkAttendanceForm;
  openMarkAttendance: () => void;
  closeMarkAttendance: () => void;
  toggleStudentPresent: (rollNo: string) => void;
  setMarkClass: (cls: string) => void;
  setMarkSection: (sec: string) => void;

  // Add Holiday Modal
  showAddHolidayModal: boolean;
  openAddHoliday: () => void;
  closeAddHoliday: () => void;
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

  calendarData: mockHolidayCalendar,
  calendarMonth: 3, // April = index 3
  calendarYear: 2025,
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
  markAttendanceForm: mockMarkAttendanceForm,
  openMarkAttendance: () => set({ showMarkAttendanceModal: true }),
  closeMarkAttendance: () => set({ showMarkAttendanceModal: false }),
  toggleStudentPresent: (rollNo) => {
    const form = get().markAttendanceForm;
    set({
      markAttendanceForm: {
        ...form,
        students: form.students.map((s) =>
          s.rollNo === rollNo ? { ...s, isPresent: !s.isPresent } : s
        ),
      },
    });
  },
  setMarkClass: (cls) =>
    set((s) => ({ markAttendanceForm: { ...s.markAttendanceForm, class: cls } })),
  setMarkSection: (sec) =>
    set((s) => ({ markAttendanceForm: { ...s.markAttendanceForm, section: sec } })),

  showAddHolidayModal: false,
  openAddHoliday: () => set({ showAddHolidayModal: true }),
  closeAddHoliday: () => set({ showAddHolidayModal: false }),
}));
