import { useState, useEffect, useMemo } from "react";
import { reportsApi } from "@/services/school-reports.api";
import type {
  GeneratedReport,
  ReportStats,
  GenerateReportFormData,
  ReportType,
  CreateReportPayload,
} from "../types/reports.types";

function getSchoolCode(): string {
  return import.meta.env.VITE_SCHOOL_CODE ?? localStorage.getItem("schoolcode") ?? "";
}

function toDateRange(type: GenerateReportFormData["dateRangeType"]): { from: string; to: string } {
  const now   = new Date();
  const y     = now.getFullYear();
  const m     = now.getMonth();
  if (type === "Last Month") {
    const first = new Date(y, m - 1, 1);
    const last  = new Date(y, m, 0);
    return { from: first.toISOString().slice(0, 10), to: last.toISOString().slice(0, 10) };
  }
  // "This Month" or "Custom Range" defaults to current month
  const first = new Date(y, m, 1);
  const last  = new Date(y, m + 1, 0);
  return { from: first.toISOString().slice(0, 10), to: last.toISOString().slice(0, 10) };
}

const thisMonth = toDateRange("This Month");

const EMPTY_FORM: GenerateReportFormData = {
  reportType:   "ATTENDANCE",
  dateRangeType: "This Month",
  fromDate:     thisMonth.from,
  toDate:       thisMonth.to,
  classFilter:  "All Classes",
  format:       "PDF",
  includeSections: {
    classwiseSummary:           true,
    dailyAttendanceGrid:        true,
    chronicAbsentees:           true,
    teacherWiseMarkingStatus:   true,
  },
  emailToSelf:      true,
  additionalEmail:  "",
};

// Map internal ReportType enum to backend reportype string
const REPORT_TYPE_LABEL: Record<ReportType, string> = {
  ATTENDANCE:        "Attendance Report",
  FEE_COLLECTION:    "Fee Collection Report",
  STUDENT:           "Students Report",
  WHATSAPP_ACTIVITY: "WhatsApp Activity",
  ADMISSIONS:        "Admissions Report",
  STAFF:             "Staff Report",
};

export const useReports = () => {
  const [reports, setReports]       = useState<GeneratedReport[]>([]);
  const [stats, setStats]           = useState<ReportStats | null>(null);
  const [loading, setLoading]       = useState(true);
  const [academicYear, setAcademicYear] = useState("2024-25");
  const [searchQuery, setSearchQuery]   = useState("");
  const [currentPage, setCurrentPage]   = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    reportsApi.getAll()
      .then((list) => {
        setReports(list);
        const now = new Date();
        const thisMonthList = list.filter((rep) => {
          const d = new Date(rep.generatedOn);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
        setStats({
          totalGenerated:  list.length,
          scheduledReports: 0,
          monthlyAvg:      thisMonthList.length,
          pendingDelivery: 0,
        });
      })
      .catch(() => {
        setStats({ totalGenerated: 0, scheduledReports: 0, monthlyAvg: 0, pendingDelivery: 0 });
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredReports = useMemo(() => {
    if (!searchQuery) return reports;
    const q = searchQuery.toLowerCase();
    return reports.filter((r) =>
      r.reportName.toLowerCase().includes(q) ||
      r.generatedBy.name.toLowerCase().includes(q)
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
  const [form, setForm]           = useState<GenerateReportFormData>(EMPTY_FORM);
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess]     = useState(false);

  const openForType = (type: ReportType) => {
    setForm((prev) => ({ ...prev, reportType: type }));
    setSuccess(false);
  };

  const setField = <K extends keyof GenerateReportFormData>(
    key: K,
    value: GenerateReportFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleSection = (key: keyof GenerateReportFormData["includeSections"]) =>
    setForm((prev) => ({
      ...prev,
      includeSections: { ...prev.includeSections, [key]: !prev.includeSections[key] },
    }));

  const generate = async () => {
    setGenerating(true);
    setSuccess(false);
    try {
      // Resolve date range if "This Month" / "Last Month"
      const resolved =
        form.dateRangeType === "Custom Range"
          ? { from: form.fromDate, to: form.toDate }
          : toDateRange(form.dateRangeType);

      const payload: CreateReportPayload = {
        reportype:        REPORT_TYPE_LABEL[form.reportType],
        from:             resolved.from,
        to:               resolved.to,
        class_id:         form.classFilter,
        section_id:       null,
        academic_year_id: null,
        format:           form.format,
        emailreport:      form.emailToSelf,
        school_code:      getSchoolCode(),
      };

      await reportsApi.generate(payload);
      setSuccess(true);
      await new Promise((r) => setTimeout(r, 800));
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate report";
      alert(msg);
    } finally {
      setGenerating(false);
    }
  };

  const estimatedSize = useMemo(() => {
    const sections = Object.values(form.includeSections).filter(Boolean).length;
    const base = form.format === "PDF" ? 0.8 : 0.2;
    return `~${(base + sections * 0.25).toFixed(1)} MB`;
  }, [form]);

  return { form, generating, success, estimatedSize, openForType, setField, toggleSection, generate };
};
