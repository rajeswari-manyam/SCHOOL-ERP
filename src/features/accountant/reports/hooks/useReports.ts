import { useState } from "react";
import type{ Report } from "../types/reports.types";

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      name: "Monthly Fee Collection",
      type: "monthly",
      generatedAt: "2026-04-14",
      format: "PDF",
    },
  ]);

  const generateReport = (name: string) => {
    const newReport: Report = {
      id: Date.now().toString(),
      name,
      type: "monthly",
      generatedAt: new Date().toISOString(),
      format: "PDF",
    };
    setReports((prev) => [newReport, ...prev]);
  };

  return { reports, generateReport };
};