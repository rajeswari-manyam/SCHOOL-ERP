// teacher/attendance/api/attendance.api.ts
import axios from "@/config/axios";
import type {
  TodayAttendance,
  AttendanceHistoryEntry,
  MarkAttendancePayload,
  CorrectionRequestPayload,
  CorrectionRequest,
} from "../types/attendance.types";

export const attendanceApi = {
  // ── Today ─────────────────────────────────────────────────────────────────
  getToday: async (): Promise<TodayAttendance> => {
    const { data } = await axios.get("/teacher/attendance/today");
    return data;
  },

  getStudents: async (): Promise<{ id: string; name: string; rollNo: string; waNumber: string }[]> => {
    const { data } = await axios.get("/teacher/attendance/students");
    return data;
  },

  markViaWeb: async (payload: MarkAttendancePayload): Promise<void> => {
    await axios.post("/teacher/attendance/mark", payload);
  },

  retryWaAlert: async (studentId: string): Promise<void> => {
    await axios.post(`/teacher/attendance/alert/retry`, { studentId });
  },

  // ── History ────────────────────────────────────────────────────────────────
  getMyHistory: async (): Promise<AttendanceHistoryEntry[]> => {
    const { data } = await axios.get("/teacher/attendance/my-history");
    return data;
  },

  // ── Correction ─────────────────────────────────────────────────────────────
  submitCorrection: async (payload: CorrectionRequestPayload): Promise<void> => {
    await axios.post("/teacher/attendance/correction", payload);
  },

  getMyCorrectionRequests: async (): Promise<CorrectionRequest[]> => {
    const { data } = await axios.get("/teacher/attendance/corrections");
    return data;
  },
};