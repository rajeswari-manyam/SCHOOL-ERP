// teacher/attendance/api/attendance.api.ts
import axios from "@/config/axios";
import type {
  TodayAttendance,
  AttendanceHistoryEntry,
  MarkAttendancePayload,
  CorrectionRequestPayload,
  CorrectionRequest,
  TodayAttendanceSummaryItem,
} from "../types/attendance.types";

// ── Extract / transform helpers for /tenant/getteachertodayattendancesummary ──

const extractTodaySummary = (raw: unknown): TodayAttendanceSummaryItem | null => {
  if (!raw || typeof raw !== "object") return null;

  const obj = raw as Record<string, unknown>;

  // { data: { ... } }
  const inner =
    obj?.data && typeof obj.data === "object" && !Array.isArray(obj.data)
      ? (obj.data as Record<string, unknown>)
      : null;

  const source = inner ?? obj;

  // Must have at least totalStudents / date to be valid
  if (!source?.totalStudents && !source?.date) return null;

  return {
    totalStudents: Number(source.totalStudents) || 0,
    presentCount: source.presentCount != null ? Number(source.presentCount) : undefined,
    absentCount: source.absentCount != null ? Number(source.absentCount) : undefined,
    halfDayCount: source.halfDayCount != null ? Number(source.halfDayCount) : undefined,
    isMarked: Boolean(source.isMarked),
    markedAt: source.markedAt as string | undefined,
    method: source.method as string | undefined,
    date: (source.date as string) ?? new Date().toISOString().slice(0, 10),
    className: source.className as string | undefined,
    sectionName: source.sectionName as string | undefined,
    absentStudents: Array.isArray(source.absentStudents)
      ? source.absentStudents.map((s: unknown) => {
          const st = s as Record<string, unknown>;
          return {
            id: (st.id as string) ?? "",
            name: (st.name as string) ?? "",
            rollNo: (st.rollNo as string) ?? "",
            waNumber: (st.waNumber as string) ?? "",
            alertSent: Boolean(st.alertSent),
            alertSentAt: st.alertSentAt as string | undefined,
          };
        })
      : [],
  };
};

const transformSummaryToToday = (item: TodayAttendanceSummaryItem): TodayAttendance => ({
  isMarked: item.isMarked,
  markedAt: item.markedAt,
  method: (item.method === "whatsapp" || item.method === "web") ? item.method : undefined,
  presentCount: item.presentCount,
  absentCount: item.absentCount,
  halfDayCount: item.halfDayCount,
  totalStudents: item.totalStudents,
  classLabel: [item.className, item.sectionName].filter(Boolean).join("-"),
  date: item.date,
  absentStudents: (item.absentStudents ?? []).map((s) => ({
    student: { id: s.id, name: s.name, rollNo: s.rollNo, waNumber: s.waNumber },
    alertSent: s.alertSent,
    alertSentAt: s.alertSentAt,
  })),
});

export const attendanceApi = {
  // ── Today ─────────────────────────────────────────────────────────────────
  getToday: async (): Promise<TodayAttendance> => {
    const { data } = await axios.get("/teacher/attendance/today");
    return data;
  },

  getTodayAttendanceSummary: async (teacherId: string): Promise<TodayAttendance> => {
    const url = "/tenant/getteachertodayattendancesummary";
    console.log("📥 getTodayAttendanceSummary request:", { url, teacherId });

    try {
      const response = await axios.get<unknown>(url, {
        params: { teacher_id: teacherId },
      });
      const { data: raw, status: httpStatus } = response;

      console.log("📥 getTodayAttendanceSummary raw response:", {
        httpStatus,
        keys: typeof raw === "object" && raw ? Object.keys(raw as Record<string, unknown>) : typeof raw,
        data: JSON.stringify(raw),
      });

      // Handle status:false as not-marked, not error
      if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        if (obj?.status === false) {
          console.log("ℹ️ getTodayAttendanceSummary: status:false —", (obj?.message as string) ?? "");
          return {
            isMarked: false,
            totalStudents: 0,
            classLabel: "—",
            date: new Date().toISOString().slice(0, 10),
            absentStudents: [],
          };
        }
      }

      const item = extractTodaySummary(raw);
      if (item) {
        console.log("✅ getTodayAttendanceSummary: received summary");
        return transformSummaryToToday(item);
      }

      console.warn("⚠️ getTodayAttendanceSummary: no summary extracted — response keys:",
        typeof raw === "object" && raw ? Object.keys(raw as Record<string, unknown>) : typeof raw);
      return {
        isMarked: false,
        totalStudents: 0,
        classLabel: "—",
        date: new Date().toISOString().slice(0, 10),
        absentStudents: [],
      };
    } catch (err: unknown) {
      const errObj = err as { response?: { status?: number; data?: unknown }; message?: string; code?: string };
      const statusCode = errObj?.response?.status;
      const respData = errObj?.response?.data;
      const responseBody = respData ? JSON.stringify(respData) : "—";
      const errMsg = errObj?.message ?? "Unknown error";

      // 404 with status:false = no data, return unmarked
      const isNoData =
        statusCode === 404 &&
        respData && typeof respData === "object" &&
        (respData as Record<string, unknown>)?.status === false;

      if (isNoData) {
        console.log("ℹ️ getTodayAttendanceSummary: 404 with status:false — no attendance summary");
        return {
          isMarked: false,
          totalStudents: 0,
          classLabel: "—",
          date: new Date().toISOString().slice(0, 10),
          absentStudents: [],
        };
      }

      console.error("❌ getTodayAttendanceSummary failed", {
        url, teacherId,
        status: statusCode,
        responseData: responseBody,
        message: errMsg,
        code: errObj?.code,
      });

      throw new Error(`Attendance summary error (${statusCode ?? "network"}): ${errMsg}`);
    }
  },

  getStudents: async (): Promise<{ id: string; name: string; rollNo: string; waNumber: string }[]> => {
    const { data } = await axios.get("/teacher/attendance/students");
    return data;
  },

  markViaWeb: async (payload: MarkAttendancePayload): Promise<void> => {
    await axios.post("/teacher/attendance/mark", payload);
  },

  retryWaAlert: async (studentId: string): Promise<void> => {
    await axios.post(`/teacher/attendance/alert/retry`, { studentId });
  },

  // ── History ────────────────────────────────────────────────────────────────
  getMyHistory: async (): Promise<AttendanceHistoryEntry[]> => {
    const { data } = await axios.get("/teacher/attendance/my-history");
    return data;
  },

  // ── Correction ─────────────────────────────────────────────────────────────
  submitCorrection: async (payload: CorrectionRequestPayload): Promise<void> => {
    await axios.post("/teacher/attendance/correction", payload);
  },

  getMyCorrectionRequests: async (): Promise<CorrectionRequest[]> => {
    const { data } = await axios.get("/teacher/attendance/corrections");
    return data;
  },
};