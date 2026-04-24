import axios from "@/config/axios";
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

export const attendanceApi = {
  // ── Today ──────────────────────────────────────────────────────────────────
  getTodayAttendance: async (): Promise<AttendancePageData> => {
    // const response = await axios.get("/attendance/today");
    // return response.data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_ATTENDANCE_DATA), 500);
    });
  },

  getClassDetails: async (classId: string): Promise<ClassDetail> => {
    // const response = await axios.get(`/attendance/class/${classId}`);
    // return response.data;
    return new Promise((resolve) => {
      setTimeout(() => {
        const classDetail = MOCK_CLASS_DETAILS.find((c) => c.id === classId);
        if (!classDetail) throw new Error("Class not found");
        resolve(classDetail);
      }, 300);
    });
  },

  // ── History ────────────────────────────────────────────────────────────────
  getAttendanceHistory: async (
    filters: AttendanceHistoryFilters
  ): Promise<AttendanceTrendPoint[]> => {
    // const response = await axios.get("/attendance/history", { params: filters });
    // return response.data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_TREND_DATA), 500);
    });
  },

  getChronicAbsentees: async (): Promise<ChronicAbsentee[]> => {
    // const response = await axios.get("/attendance/chronic-absentees");
    // return response.data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_CHRONIC_ABSENTEES), 500);
    });
  },

  // ── Holidays ───────────────────────────────────────────────────────────────
  getHolidays: async (): Promise<Holiday[]> => {
    // const response = await axios.get("/attendance/holidays");
    // return response.data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_HOLIDAYS), 500);
    });
  },

  createHoliday: async (holiday: Omit<Holiday, "id">): Promise<Holiday> => {
    // const response = await axios.post("/attendance/holidays", holiday);
    // return response.data;
    return new Promise((resolve) => {
      setTimeout(() => {
        const newHoliday: Holiday = { ...holiday, id: Date.now().toString() };
        resolve(newHoliday);
      }, 300);
    });
  },

  deleteHoliday: async (id: string): Promise<void> => {
    // await axios.delete(`/attendance/holidays/${id}`);
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  },

  // ── Mutations ──────────────────────────────────────────────────────────────
  markAttendance: async (
    studentId: string,
    date: string,
    status: "present" | "absent" | "late"
  ): Promise<void> => {
    // await axios.post("/attendance/mark", { studentId, date, status });
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  },

  bulkMarkAttendance: async (
    classId: string,
    date: string,
    attendance: Record<string, "present" | "absent" | "late">
  ): Promise<void> => {
    // await axios.post("/attendance/bulk-mark", { classId, date, attendance });
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  },
};