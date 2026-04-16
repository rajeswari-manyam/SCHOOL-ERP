import {
  mockStudent,
  mockCurrentMonth,
  mockYearSummary,
  mockPolicy,
  mockAbsentDays,
  mockMotivationalMessage,
  mockSelectedMonth,
} from "../store";
import type {
  AttendanceDashboardResponse,
  MonthAttendance,
} from "../types/Attendance.types";

// Simulated delay for realistic loading
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const attendanceApi = {
  /** Full attendance dashboard for the current/selected month */
  getDashboard: async (): Promise<AttendanceDashboardResponse> => {
    await delay(500);
    return {
      student: mockStudent,
      currentMonth: mockCurrentMonth as MonthAttendance,
      yearSummary: mockYearSummary,
      policy: mockPolicy,
      absentDays: mockAbsentDays,
      motivationalMessage: mockMotivationalMessage,
      selectedMonth: mockSelectedMonth,
    };
  },

  /** Attendance for a specific month (stub — returns same mock) */
  getMonthAttendance: async (
    _year: number,
    _month: number
  ): Promise<MonthAttendance> => {
    await delay(400);
    return mockCurrentMonth as MonthAttendance;
  },

  /** Navigate to previous month (stub) */
  getPreviousMonth: async (): Promise<MonthAttendance> => {
    await delay(400);
    return {
      ...mockCurrentMonth,
      month: "March",
      year: 2025,
      percentage: 89.5,
      daysPresent: 20,
      daysAbsent: 2,
      totalSchoolDays: 22,
    } as MonthAttendance;
  },

  /** Navigate to next month (stub) */
  getNextMonth: async (): Promise<MonthAttendance> => {
    await delay(400);
    return {
      ...mockCurrentMonth,
      month: "May",
      year: 2025,
      percentage: 93.1,
      daysPresent: 21,
      daysAbsent: 1,
      totalSchoolDays: 22,
    } as MonthAttendance;
  },
};