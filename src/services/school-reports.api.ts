import api from "@/config/axios";
import type { GeneratedReport, ReportStats, CreateReportPayload, CreateReportResponse } from "@/features/school-admin/reports/types/reports.types";

export const MOCK_GENERATED_REPORTS: GeneratedReport[] = [
  {
    id: "1",
    reportName: "Fee Collection",
    generatedOn: "March 28, 2025, 10:30 AM",
    period: "March 2025",
    format: "PDF",
    generatedBy: { initials: "MA", name: "Manyam Admin" },
    type: "FEE_COLLECTION",
  },
  {
    id: "2",
    reportName: "Attendance Report",
    generatedOn: "March 27, 2025, 04:15 PM",
    period: "March 2025",
    format: "PDF",
    generatedBy: { initials: "RK", name: "Rajesh Kumar" },
    type: "ATTENDANCE",
  },
  {
    id: "3",
    reportName: "Student List",
    generatedOn: "March 25, 2025, 09:00 AM",
    period: "All Classes",
    format: "CSV",
    generatedBy: { initials: "MA", name: "Manyam Admin" },
    type: "STUDENT",
  },
  {
    id: "4",
    reportName: "WhatsApp Activity",
    generatedOn: "March 24, 2025, 11:20 AM",
    period: "Week 13",
    format: "PDF",
    generatedBy: { initials: "SY", name: "System Auto" },
    type: "WHATSAPP_ACTIVITY",
  },
  {
    id: "5",
    reportName: "Fee Defaulters",
    generatedOn: "March 22, 2025, 02:45 PM",
    period: "March 2025",
    format: "PDF",
    generatedBy: { initials: "MA", name: "Manyam Admin" },
    type: "FEE_COLLECTION",
  },
  {
    id: "6",
    reportName: "Admissions Pipeline",
    generatedOn: "March 20, 2025, 04:30 PM",
    period: "Q1 2025",
    format: "PDF",
    generatedBy: { initials: "PS", name: "Priya Sharma" },
    type: "ADMISSIONS",
  },
];

export const MOCK_REPORT_STATS: ReportStats = {
  totalGenerated: 94,
  scheduledReports: 8,
  monthlyAvg: 24,
  pendingDelivery: 2,
};

export const reportsApi = {
  getAll: async (): Promise<GeneratedReport[]> => {
    try {
      const { data } = await api.get("/tenant/getallreports");
      const list = Array.isArray(data) ? data : (data as any)?.reports ?? (data as any)?.data ?? [];
      return Array.isArray(list) ? list : [];
    } catch {
      return MOCK_GENERATED_REPORTS;
    }
  },
  getStats: async (): Promise<ReportStats> => {
    await new Promise(r => setTimeout(r, 200));
    return MOCK_REPORT_STATS;
  },
  generate: async (payload: CreateReportPayload): Promise<CreateReportResponse> => {
    try {
      const { data } = await api.post<CreateReportResponse>("/tenant/createreports", payload);
      return data;
    } catch (err: any) {
      console.error("generate report failed", { url: "/tenant/createreports", payload, response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to generate report";
      throw new Error(message);
    }
  },
  download: async (reportId: string): Promise<void> => {
    try {
      const response = await api.get(`/tenant/getreportById/${reportId}`, { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${reportId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("download report failed", { reportId, response: err?.response?.data ?? err?.message });
      throw new Error(err?.response?.data?.message ?? err?.message ?? "Failed to download report");
    }
  },
};
