import { api } from "../../../../config/axios";
import type { AttendanceRecord, MarkAttendanceInput, UpdateAttendanceInput } from "../types/attendance.types";

export const fetchAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
  const { data } = await api.get("/teacher/attendance");
  return data;
};

export const markAttendance = async (input: MarkAttendanceInput): Promise<AttendanceRecord> => {
  const { data } = await api.post("/teacher/attendance", input);
  return data;
};

export const updateAttendance = async (id: string, input: UpdateAttendanceInput): Promise<AttendanceRecord> => {
  const { data } = await api.put(`/teacher/attendance/${id}`, input);
  return data;
};

export const deleteAttendance = async (id: string): Promise<void> => {
  await api.delete(`/teacher/attendance/${id}`);
};