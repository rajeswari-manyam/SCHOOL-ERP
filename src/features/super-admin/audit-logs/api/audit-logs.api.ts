import axios from "@/config/axios";
import type { AuditLogsFilters, AuditLogsResponse, AuditLog } from "../types/audit-logs.types";

export const auditLogsApi = {
  getLogs: async (filters: Partial<AuditLogsFilters>): Promise<AuditLogsResponse> => {
    const { data } = await axios.get("/super-admin/audit-logs", { params: filters });
    return data;
  },

  getLog: async (id: string): Promise<AuditLog> => {
    const { data } = await axios.get(`/super-admin/audit-logs/${id}`);
    return data;
  },

  exportLogs: async (filters: Partial<AuditLogsFilters>): Promise<Blob> => {
    const { data } = await axios.get("/super-admin/audit-logs/export", {
      params: filters,
      responseType: "blob",
    });
    return data;
  },
};
