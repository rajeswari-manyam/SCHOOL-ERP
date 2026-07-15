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
  StudentReportPayload,
  StudentReportResponse,
  StaffReportPayload,
  StaffReportResponse,
  GetRecentlyGeneratedReportsResponse,
  DeleteReportResponse,
  AttendanceReportPayload,
  AttendanceReportResponse,
  FeeCollectionReportPayload,
  FeeCollectionReportResponse,
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
  "whatsapp":                 "WHATSAPP_ACTIVITY",
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

  /** GET /tenant/getallreports — returns mapped GeneratedReport[] */
  getAll: async (): Promise<GeneratedReport[]> => {
    const { data } = await api.get<GetAllReportsResponse>("/tenant/getallreports");
    const list: RawReport[] = Array.isArray(data?.data) ? data.data : [];
    return list.map(normalise);
  },

  /** GET /tenant/getallreports — returns raw RawReport[] for the table */
  getAllRaw: async (): Promise<RawReport[]> => {
    const { data } = await api.get<GetAllReportsResponse>("/tenant/getallreports");
    return Array.isArray(data?.data) ? data.data : [];
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

  /** GET /tenant/downloadreport/:id — returns blob + resolved filename */
  download: async (reportId: string): Promise<{ blob: Blob; filename: string }> => {
    const response = await api.get(`/tenant/downloadreport/${reportId}`, {
      responseType: "blob",
    });
    const blob: Blob = response.data;

    // 1. Try Content-Disposition: attachment; filename="report.csv"
    const disposition = String(response.headers["content-disposition"] ?? "");
    const nameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (nameMatch) {
      return { blob, filename: nameMatch[1].replace(/['"]/g, "").trim() };
    }

    // 2. Derive extension from Content-Type
    const contentType = String(response.headers["content-type"] ?? "");
    const ext = contentType.includes("pdf")  ? ".pdf"
              : contentType.includes("csv")  ? ".csv"
              : contentType.includes("json") ? ".json"
              : ".csv"; // API always returns CSV

    return { blob, filename: `report-${reportId.slice(0, 8)}${ext}` };
  },

  /** POST /tenant/attendance-report — generate attendance report */
  generateAttendanceReport: async (payload: AttendanceReportPayload): Promise<AttendanceReportResponse> => {
    const { data } = await api.post<AttendanceReportResponse>("/tenant/attendance-report", payload);
    return data;
  },

  /** POST /tenant/student-report — generate student report */
  studentReport: async (payload: StudentReportPayload): Promise<StudentReportResponse> => {
    const { data } = await api.post<StudentReportResponse>("/tenant/student-report", payload);
    return data;
  },

  /** POST /tenant/staff-report — generate staff report */
  staffReport: async (payload: StaffReportPayload): Promise<StaffReportResponse> => {
    const { data } = await api.post<StaffReportResponse>("/tenant/staff-report", payload);
    return data;
  },

  /** GET /tenant/getrecentlygeneratedreports */
  getRecentlyGenerated: async (): Promise<GetRecentlyGeneratedReportsResponse> => {
    const { data } = await api.get<GetRecentlyGeneratedReportsResponse>("/tenant/getrecentlygeneratedreports");
    return data;
  },

  /** DELETE /tenant/deletereportById/:id */
  delete: async (id: string): Promise<DeleteReportResponse> => {
    const { data } = await api.delete<DeleteReportResponse>(`/tenant/deletereportById/${id}`);
    return data;
  },

  /** POST /tenant/monthlyfeecollectionreport */
  monthlyFeeCollectionReport: async (payload: FeeCollectionReportPayload): Promise<FeeCollectionReportResponse> => {
    const { data } = await api.post<FeeCollectionReportResponse>("/tenant/monthlyfeecollectionreport", payload);
    return data;
  },
};
