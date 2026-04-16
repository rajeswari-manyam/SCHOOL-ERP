import { useState, useEffect, useMemo } from "react";
import { reportsApi } from "../api/reports.api";
import type { GeneratedReport, ReportStats, GenerateReportFormData, ReportType } from "../types/reports.types";

const EMPTY_FORM: GenerateReportFormData = {
  reportType: "ATTENDANCE",
  dateRangeType: "Last Month",
  fromDate: "2025-03-01",
  toDate: "2025-03-31",
  classFilter: "All Classes",
  format: "PDF",
  includeSections: {
    classwiseSummary: true,
    dailyAttendanceGrid: true,
    chronicAbsentees: true,
    teacherWiseMarkingStatus: true,
  },
  emailToSelf: true,
  additionalEmail: "",
};

export const useReports = () => {
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [academicYear, setAcademicYear] = useState("2024-25");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    Promise.all([reportsApi.getAll(), reportsApi.getStats()]).then(([r, s]) => {
      setReports(r);
      setStats(s);
      setLoading(false);
    });
  }, []);

  const filteredReports = useMemo(() => {
    if (!searchQuery) return reports;
    return reports.filter(r =>
      r.reportName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.generatedBy.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reports, searchQuery]);

  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredReports.slice(start, start + PAGE_SIZE);
  }, [filteredReports, currentPage]);

  const totalPages = Math.ceil(filteredReports.length / PAGE_SIZE);

  const downloadReport = async (reportId: string) => {
    await reportsApi.download(reportId);
  };

  return {
    reports,
    filteredReports,
    paginatedReports,
    stats,
    loading,
    academicYear,
    setAcademicYear,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    downloadReport,
  };
};

export const useGenerateReport = (onSuccess: () => void) => {
  const [form, setForm] = useState<GenerateReportFormData>(EMPTY_FORM);
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const openForType = (type: ReportType) => {
    setForm(prev => ({ ...prev, reportType: type }));
    setSuccess(false);
  };

  const setField = <K extends keyof GenerateReportFormData>(key: K, value: GenerateReportFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const toggleSection = (key: keyof GenerateReportFormData["includeSections"]) => {
    setForm(prev => ({
      ...prev,
      includeSections: {
        ...prev.includeSections,
        [key]: !prev.includeSections[key],
      },
    }));
  };

  const generate = async () => {
    setGenerating(true);
    try {
      await reportsApi.generate(form);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } finally {
      setGenerating(false);
    }
  };

  // Estimated size string
  const estimatedSize = useMemo(() => {
    const sections = Object.values(form.includeSections).filter(Boolean).length;
    const base = form.format === "PDF" ? 0.8 : 0.2;
    return `~${(base + sections * 0.25).toFixed(1)} MB`;
  }, [form]);

  return { form, generating, success, estimatedSize, openForType, setField, toggleSection, generate };
};