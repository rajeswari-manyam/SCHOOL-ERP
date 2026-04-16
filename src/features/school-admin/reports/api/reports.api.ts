import type { GeneratedReport, ReportStats } from "../types/reports.types";

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
    await new Promise(r => setTimeout(r, 300));
    return MOCK_GENERATED_REPORTS;
  },
  getStats: async (): Promise<ReportStats> => {
    await new Promise(r => setTimeout(r, 200));
    return MOCK_REPORT_STATS;
  },
  generate: async (data: object): Promise<{ success: boolean; reportId: string }> => {
    await new Promise(r => setTimeout(r, 1200));
    console.log("Generating report with:", data);
    return { success: true, reportId: `RPT-${Date.now()}` };
  },
  download: async (reportId: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 500));
    console.log("Downloading report:", reportId);
  },
};