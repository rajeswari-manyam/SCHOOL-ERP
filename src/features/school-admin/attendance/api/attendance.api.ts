import { api } from "@/config/axios";
import { MarkAttendanceInput } from "../types/attendance.types";

export const getAttendanceGrid = async (date: string) => {
  const { data } = await api.get(`/school-admin/attendance?date=${date}`);
  return data;
};

export const markAttendance = async (input: MarkAttendanceInput) => {
  const { data } = await api.post("/school-admin/attendance/mark", input);
  return data;
};
