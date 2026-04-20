import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Report, ReportType, ReportFormat } from "../types/reports.types";
import { mockReports } from "../data/report.data";

/* =========================
   ZOD SCHEMA (DIRECT HERE)
========================= */
const generateReportSchema = z.object({
  asOfDate: z.string().min(1),
  classFilter: z.string(),
  minOverdue: z.enum(["7+ Days", "15+ Days", "30+ Days"]),
  format: z.enum(["PDF", "Excel"]),

  includeColumns: z.object({
    studentName: z.boolean(),
    parentContact: z.boolean(),
    overdueAmount: z.boolean(),
    daysOverdue: z.boolean(),
    feeBreakdown: z.boolean(),
  }),

  sendTo: z.object({
    myEmail: z.boolean(),
    principal: z.boolean(),
  }),
});

export type GenerateReportForm = z.infer<typeof generateReportSchema>;

/* =========================
   MAIN HOOK
========================= */
export const useReports = () => {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [openModal, setOpenModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<{
    id: ReportType;
    title: string;
  } | null>(null);

  /* =========================
     FORM (RHF)
  ========================= */
  const form = useForm<GenerateReportForm>({
    resolver: zodResolver(generateReportSchema),
    defaultValues: {
      asOfDate: "2025-04-07",
      classFilter: "all",
      minOverdue: "15+ Days",
      format: "PDF",
      includeColumns: {
        studentName: true,
        parentContact: true,
        overdueAmount: true,
        daysOverdue: true,
        feeBreakdown: false,
      },
      sendTo: {
        myEmail: true,
        principal: false,
      },
    },
  });

  /* =========================
     ACTIONS
  ========================= */
  const openGenerateModal = (report: { id: ReportType; title: string }) => {
    setSelectedReport(report);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedReport(null);
    form.reset();
  };

  const generateReport = (data: GenerateReportForm) => {
    if (!selectedReport) return;

    const newReport: Report = {
      id: Date.now().toString(),
      name: selectedReport.title,
      type: selectedReport.id,
      generatedAt: new Date().toISOString(),
      format: data.format,
      generatedBy: "Admin",
      period: "April 2025",
    };

    setReports((prev) => [newReport, ...prev]);
    closeModal();
  };

  return {
    reports,
    openModal,
    selectedReport,
    form,

    openGenerateModal,
    closeModal,
    generateReport,
  };
};