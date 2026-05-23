
import { useState } from "react";
import { mockReports, reportCards } from "../data/report.data";
import type { Report, GenerateReportInput } from "../types/reports.types";

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (reportTypeId: string) => setActiveModal(reportTypeId);
  const closeModal = () => setActiveModal(null);

  const generateReport = (data: GenerateReportInput) => {
    setIsGenerating(true);

    setTimeout(() => {
      const newReport: Report = {
        id: `r${Date.now()}`,
        name: reportCards.find((c) => c.id === data.reportType)?.title ?? data.reportType,
        type: data.reportType,
        generatedAt: new Date().toISOString(),
        format: data.format,
        generatedBy: "Admin",
        period: data.asOfDate,
        downloadUrl: "#",
      };

      setReports((prev) => [newReport, ...prev]);
      setIsGenerating(false);
      closeModal();
    }, 1000);
  };

  const deleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  return {
    reports,
    reportCards,
    isGenerating,
    activeModal,
    openModal,
    closeModal,
    generateReport,
    deleteReport,
  };
};