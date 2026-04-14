// attendance/api/attendance.api.ts
import axios from "@/config/axios";
import type {
  ClassAttendanceRow, TodaySummary, ClassAttendanceDetail,
  AttendanceTrendPoint, ChronicAbsentee, Holiday, WebFormStudent,
} from "../types/attendance.types";

export const attendanceApi = {
  // ── Today ──────────────────────────────────────────────────────────────────
  getTodaySummary: async (): Promise<TodaySummary> => {
    const { data } = await axios.get("/attendance/today/summary");
    return data;
  },

  getTodayClasses: async (date: string): Promise<ClassAttendanceRow[]> => {
    const { data } = await axios.get("/attendance/today/classes", { params: { date } });
    return data;
  },

  getClassDetail: async (classId: string, date: string): Promise<ClassAttendanceDetail> => {
    const { data } = await axios.get(`/attendance/class/${classId}`, { params: { date } });
    return data;
  },

  sendRemindersToUnmarked: async (date: string): Promise<{ sent: number }> => {
    const { data } = await axios.post("/attendance/remind-unmarked", { date });
    return data;
  },

  resendFailedAlerts: async (classId: string, date: string): Promise<void> => {
    await axios.post("/attendance/resend-alerts", { classId, date });
  },

  // ── Web Form ───────────────────────────────────────────────────────────────
  getClassStudents: async (classId: string): Promise<WebFormStudent[]> => {
    const { data } = await axios.get(`/attendance/class/${classId}/students`);
    return data;
  },

  submitWebForm: async (payload: {
    classId: string;
    section: string;
    date: string;
    records: { studentId: string; present: boolean }[];
  }): Promise<void> => {
    await axios.post("/attendance/mark/web", payload);
  },

  // ── History ────────────────────────────────────────────────────────────────
  getAttendanceTrend: async (params: {
    from: string; to: string; classFilter?: string;
  }): Promise<AttendanceTrendPoint[]> => {
    const { data } = await axios.get("/attendance/history/trend", { params });
    return data;
  },

  getChronicAbsentees: async (params: {
    from: string; to: string; classFilter?: string;
  }): Promise<ChronicAbsentee[]> => {
    const { data } = await axios.get("/attendance/chronic-absentees", { params });
    return data;
  },

  exportCsv: async (date: string): Promise<Blob> => {
    const { data } = await axios.get("/attendance/export", {
      params: { date },
      responseType: "blob",
    });
    return data;
  },

  // ── Holiday Calendar ───────────────────────────────────────────────────────
  getHolidays: async (year: number, month: number): Promise<Holiday[]> => {
    const { data } = await axios.get("/attendance/holidays", { params: { year, month } });
    return data;
  },

  addHoliday: async (payload: Omit<Holiday, "id">): Promise<Holiday> => {
    const { data } = await axios.post("/attendance/holidays", payload);
    return data;
  },

  deleteHoliday: async (id: string): Promise<void> => {
    await axios.delete(`/attendance/holidays/${id}`);
  },
};
