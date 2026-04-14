import axios from "@/config/axios";
import type { SchoolAdminDashboardData } from "../types/sa-dashboard.types";

export const saDashboardApi = {
  getDashboard: async (): Promise<SchoolAdminDashboardData> => {
    const { data } = await axios.get("/school-admin/dashboard");
    return data;
  },
  sendWAReminders: async (classes: string[]): Promise<void> => {
    await axios.post("/school-admin/attendance/send-reminders", { classes });
  },
  downloadReport: async (): Promise<Blob> => {
    const { data } = await axios.get("/school-admin/dashboard/report", { responseType: "blob" });
    return data;
  },
  sendBroadcast: async (message: string, target: string): Promise<void> => {
    await axios.post("/school-admin/broadcast", { message, target });
  },
};
