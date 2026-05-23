import axios from "@/config/axios";
import type { SuperAdminDashboardData } from "../types/dashboard.types";

export const dashboardApi = {
  getDashboard: async (): Promise<SuperAdminDashboardData> => {
    const { data } = await axios.get("/super-admin/dashboard");
    return data;
  },
  exportReport: async (): Promise<Blob> => {
    const { data } = await axios.get("/super-admin/dashboard/export", { responseType: "blob" });
    return data;
  },
};
