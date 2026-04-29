import type { AttendanceDay, AttendanceHistory, HolidayCalendar, MarkAttendanceForm } from "../types/attendance.types";
import {
  mockAttendanceToday,
  mockAttendanceHistory,
  mockHolidayCalendar,
} from "../store/mockData";

// ─── Simulate async API delay ───────────────────────────────────────────────
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// ─── Attendance API ──────────────────────────────────────────────────────────
export const attendanceApi = {
  /** Fetch today's attendance summary + class list */
  getToday: async (): Promise<AttendanceDay> => {
    await delay();
    return mockAttendanceToday;
  },

  /** Fetch attendance history with trend data + chronic absentees */
  getHistory: async (_params: {
    dateFrom: string;
    dateTo: string;
    classFilter: string;
  }): Promise<AttendanceHistory> => {
    await delay(600);
    return mockAttendanceHistory;
  },

  /** Fetch holiday calendar for a given month/year */
  getHolidayCalendar: async (): Promise<HolidayCalendar> => {
    await delay(300);
    return mockHolidayCalendar;
  },

  /** Submit attendance via web form */
  submitAttendance: async (form: MarkAttendanceForm): Promise<{ success: boolean; message: string }> => {
    await delay(800);
    const absentCount = form.students.filter((s) => !s.isPresent).length;
    return {
      success: true,
      message: `Attendance submitted. ${absentCount} parent alert(s) will be sent via WhatsApp.`,
    };
  },

  /** Add a new holiday */
  addHoliday: async (_holiday: {
    name: string;
    date: string;
    type: string;
    repeatAnnually: boolean;
    notes?: string;
    notifyTeachers: boolean;
  }): Promise<{ success: boolean }> => {
    await delay(500);
    return { success: true };
  },

  /** Send reminder to all unmarked classes */
  sendReminders: async (): Promise<{ success: boolean; remindersSent: number }> => {
    await delay(600);
    return { success: true, remindersSent: 3 };
  },

  /** Export attendance CSV */
  exportCSV: async (): Promise<Blob> => {
    await delay(500);
    const csv = "Class,Present,Absent,Method\n6A,32,2,WhatsApp\n6B,30,2,Web Form\n7A,28,2,WhatsApp\n";
    return new Blob([csv], { type: "text/csv" });
  },
};
