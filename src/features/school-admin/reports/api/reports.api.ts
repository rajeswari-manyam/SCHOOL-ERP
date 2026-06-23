import axios from "@/config/axios";
import type { ReportsResponse, GenerateReportPayload, ReportRecord } from "../types/reports.types";

export const reportsApi = {
  getReports: async (page = 1, pageSize = 4): Promise<ReportsResponse> => {
    const { data } = await axios.get("/super-admin/reports", { params: { page, pageSize } });
    return data;
  },

  generateReport: async (payload: GenerateReportPayload): Promise<ReportRecord> => {
    const { data } = await axios.post("/super-admin/reports/generate", payload);
    return data;
  },

  downloadReport: async (id: string): Promise<Blob> => {
    const { data } = await axios.get(`/super-admin/reports/${id}/download`, {
      responseType: "blob",
    });
    return data;
  },

  deleteReport: async (id: string): Promise<void> => {
    await axios.delete(`/super-admin/reports/${id}`);
  },
};
