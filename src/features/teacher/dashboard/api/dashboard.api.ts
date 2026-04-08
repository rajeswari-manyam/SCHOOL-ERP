import { api } from "@/config/axios";
import type{ TeacherDashboardStats } from "../types/dashboard.types";

export const fetchTeacherDashboardStats = async (): Promise<TeacherDashboardStats> => {
  const { data } = await api.get("/teacher/dashboard/stats");
  return data;
};
