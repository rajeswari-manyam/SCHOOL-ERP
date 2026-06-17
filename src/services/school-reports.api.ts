import api from "@/config/axios";
import type {
  GeneratedReport,
  RawReport,
  CreateReportPayload,
  CreateReportResponse,
  GetAllReportsResponse,
  GetReportByIdResponse,
  ReportFormat,
  ReportType,
} from "../features/school-admin/reports/types/reports.types";

// ─── Map reportype string → ReportType enum ───────────────────────────────────

const REPORT_TYPE_MAP: Record<string, ReportType> = {
  attendance:               "ATTENDANCE",
  "attendance report":      "ATTENDANCE",
  fee:                      "FEE_COLLECTION",
  "fee collection":         "FEE_COLLECTION",
  "fee collection report":  "FEE_COLLECTION",
  student:                  "STUDENT",
  "student report":         "STUDENT",
  "students report":        "STUDENT",
  whatsapp:                 "WHATSAPP_ACTIVITY",
  "whatsapp activity":      "WHATSAPP_ACTIVITY",
  admissions:               "ADMISSIONS",
  "admissions report":      "ADMISSIONS",
  staff:                    "STAFF",
  "staff report":           "STAFF",
};

function toReportType(reportype: string): ReportType {
  return REPORT_TYPE_MAP[reportype.toLowerCase().trim()] ?? "ATTENDANCE";
}

function fmtDate(d: string): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return d; }
}

function normalise(raw: RawReport): GeneratedReport {
  const fmt = (raw.format ?? "PDF").toUpperCase();
  return {
    id:          raw.id,
    reportName:  raw.reportype,
    generatedOn: fmtDate(raw.createdAt),
    period:      raw.from && raw.to ? `${raw.from} – ${raw.to}` : "—",
    format:      (fmt === "CSV" ? "CSV" : "PDF") as ReportFormat,
    generatedBy: { initials: "SA", name: "School Admin" },
    type:        toReportType(raw.reportype),
  };
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const reportsApi = {

  /** GET /tenant/getallreports */
  getAll: async (): Promise<GeneratedReport[]> => {
    const { data } = await api.get<GetAllReportsResponse>("/tenant/getallreports");
    const list: RawReport[] = Array.isArray(data?.data) ? data.data : [];
    return list.map(normalise);
  },

  /** POST /tenant/createreports */
  generate: async (payload: CreateReportPayload): Promise<CreateReportResponse> => {
    const { data } = await api.post<CreateReportResponse>("/tenant/createreports", payload);
    if (!data?.status) throw new Error(data?.message ?? "Failed to create report");
    return data;
  },

  /** GET /tenant/getreportById/:id */
  getById: async (id: string): Promise<RawReport> => {
    const { data } = await api.get<GetReportByIdResponse>(`/tenant/getreportById/${id}`);
    if (!data?.status || !data?.data) throw new Error("Report not found");
    return data.data;
  },

  /** PUT /tenant/updatereportById/:id */
  update: async (id: string, payload: Partial<CreateReportPayload>): Promise<RawReport> => {
    const { data } = await api.put<CreateReportResponse>(`/tenant/updatereportById/${id}`, payload);
    if (!data?.status || !data?.data) throw new Error(data?.message ?? "Failed to update report");
    return data.data;
  },

  /** Download — fetches metadata and triggers a JSON download since no file URL exists */
  download: async (reportId: string): Promise<void> => {
    const raw = await reportsApi.getById(reportId);
    const blob = new Blob([JSON.stringify(raw, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `report-${raw.reportype.replace(/\s+/g, "-")}-${reportId.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
};
