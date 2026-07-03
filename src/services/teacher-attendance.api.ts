// teacher/attendance/api/attendance.api.ts
import axios from "@/config/axios";
import { createAttendance } from "@/services/attendance.api";
import type {
  TodayAttendance,
  AttendanceHistoryEntry,
  MarkAttendancePayload,
  CorrectionRequestPayload,
  CorrectionRequest,
} from "@/features/teacher/attendance/types/attendance.types";

// ── Types matching /tenant/getteachertodayattendancesummary response ──────────

interface RawSummarySection {
  class_id: string;
  class_name: string;
  section_id: string;
  section_name: string;
  teacher_id: string;
  teacher_name: string;
  total_strength: number;
  marked_time: string;
  students: Array<{
    student_id: string;
    student_name: string;
    roll_number: string;
    marked_time: string;
    status?: string;
  }>;
  absent_students: Array<{
    student_id: string;
    student_name: string;
    roll_number: string;
    marked_time: string;
    status?: string;
  }>;
  // ✅ The real API response uses a nested summary object — not flat count fields
  summary: {
    total_strength: number;
    present_count: number;
    absent_count: number;
    halfday_count: number;
  };
}

interface RawSummaryDay {
  attendance_date: string;
  total_sections: number;
  sections: RawSummarySection[];
}

interface RawSummaryResponse {
  status: boolean;
  teacher_id: string;
  from_date: string;
  to_date: string;
  total_days: number;
  data: RawSummaryDay[];
}

// ── Transform: pick today's entry from the response array ────────────────────

const transformSummaryResponse = (raw: RawSummaryResponse): TodayAttendance => {
  const todayStr = new Date().toISOString().slice(0, 10);

  // Find today's day entry; fallback to most recent
  const dayEntry =
    raw.data.find((d) => d.attendance_date === todayStr) ?? raw.data[0] ?? null;

  if (!dayEntry || dayEntry.sections.length === 0) {
    return {
      isMarked: false,
      totalStudents: 0,
      classLabel: "—",
      date: todayStr,
      absentStudents: [],
    };
  }

  const sections = dayEntry.sections;

  // ✅ Use summary.present_count / absent_count / halfday_count from each section
  const totalStudents = sections.reduce((s, sec) => s + (sec.summary?.total_strength ?? sec.total_strength ?? 0), 0);
  const presentCount  = sections.reduce((s, sec) => s + (sec.summary?.present_count  ?? 0), 0);
  const absentCount   = sections.reduce((s, sec) => s + (sec.summary?.absent_count   ?? 0), 0);
  const halfDayCount  = sections.reduce((s, sec) => s + (sec.summary?.halfday_count  ?? 0), 0);

  // ✅ Build a smart class label
  // If all sections belong to the same class → "4th-C"
  // If multiple classes → "4th, 5 (2 sections)"
  const uniqueClasses = [...new Set(sections.map((s) => s.class_name))];
  const classLabel =
    sections.length === 1
      ? `${sections[0].class_name}-${sections[0].section_name}`
      : uniqueClasses.length === 1
      ? `${uniqueClasses[0]} (${sections.length} sections)`
      : `${uniqueClasses.join(", ")} (${sections.length} sections)`;

  // Use the first section for meta (class id, marked time)
  const firstSec = sections[0];

  // ✅ Flatten absent students across ALL sections
  const absentStudents: TodayAttendance["absentStudents"] = sections.flatMap((sec) =>
    sec.absent_students.map((s) => ({
      student: {
        id: s.student_id,
        name: s.student_name,
        rollNo: s.roll_number,
        waNumber: "",
      },
      alertSent: false,
      alertSentAt: undefined,
    }))
  );

  return {
    isMarked: true,
    markedAt: firstSec.marked_time,
    method: "web",
    presentCount,
    absentCount,
    halfDayCount,
    totalStudents,
    classLabel,
    classId: firstSec.class_id,
    sectionId: firstSec.section_id,
    date: dayEntry.attendance_date,
    absentStudents,
  };
};

// ── Empty fallback ────────────────────────────────────────────────────────────

const emptyToday = (): TodayAttendance => ({
  isMarked: false,
  totalStudents: 0,
  classLabel: "—",
  date: new Date().toISOString().slice(0, 10),
  absentStudents: [],
});

export const attendanceApi = {
  // ── Today Summary (new endpoint) ───────────────────────────────────────────
  getTodayAttendanceSummary: async (teacherId: string): Promise<TodayAttendance> => {
    const url = "/tenant/getteachertodayattendancesummary";
    console.log("📥 getTodayAttendanceSummary →", { url, teacherId });

    try {
      const { data: raw } = await axios.get<RawSummaryResponse>(url, {
        params: { teacher_id: teacherId },
      });

      console.log("📥 raw response:", JSON.stringify(raw));

      if (!raw?.status) {
        console.log("ℹ️ status:false — no attendance data");
        return emptyToday();
      }

      if (!Array.isArray(raw.data) || raw.data.length === 0) {
        console.warn("⚠️ empty data array");
        return emptyToday();
      }

      return transformSummaryResponse(raw);
    } catch (err: unknown) {
      const errObj = err as { response?: { status?: number; data?: unknown }; message?: string };
      const statusCode = errObj?.response?.status;
      const respData   = errObj?.response?.data as Record<string, unknown> | undefined;

      // 404 with status:false → no data, not an error
      if (statusCode === 404 && respData?.status === false) {
        console.log("ℹ️ 404 + status:false — no attendance summary");
        return emptyToday();
      }

      console.error("❌ getTodayAttendanceSummary failed", {
        url, teacherId, status: statusCode, message: errObj?.message,
      });
      throw new Error(`Attendance summary error (${statusCode ?? "network"}): ${errObj?.message}`);
    }
  },

  // ── Legacy today (kept for fallback) ──────────────────────────────────────
  getToday: async (): Promise<TodayAttendance> => {
    const { data } = await axios.get("/teacher/attendance/today");
    return data;
  },

  getStudents: async (): Promise<{ id: string; name: string; rollNo: string; waNumber: string }[]> => {
    const { data } = await axios.get("/teacher/attendance/students");
    return data;
  },

  markViaWeb: async (payload: MarkAttendancePayload): Promise<{ alreadyMarked?: string[] }> => {
    const result = await createAttendance({
      class_id: payload.classId,
      section_id: payload.sectionId,
      teacher_id: payload.teacherId,
      academicYearId: payload.academicYearId,
      date: payload.date,
      attendance: payload.records.map((r) => ({
        studentId: r.studentId,
        status: r.status === "ABSENT" ? ("absent" as const) : ("present" as const),
      })),
    });

    const raw = result as unknown as { errors?: { data?: { studentId?: string }; error?: string }[] };
    const alreadyMarked: string[] = (raw?.errors ?? [])
      .filter((e) => e?.error?.toLowerCase().includes("already marked"))
      .map((e) => e?.data?.studentId ?? "");

    return { alreadyMarked };
  },

  retryWaAlert: async (studentId: string): Promise<void> => {
    await axios.post("/teacher/attendance/alert/retry", { studentId });
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

  // ── Teacher attendance summary by date range ───────────────────────────────
  getTeacherAttendanceSummaryRange: async (
    teacherId: string,
    fromDate: string,
    toDate: string
  ): Promise<RawSummaryResponse | null> => {
    const url = "/tenant/getteachertodayattendancesummary";
    console.log("📥 getTeacherAttendanceSummaryRange →", { teacherId, fromDate, toDate });

    try {
      const { data: raw } = await axios.get<RawSummaryResponse>(url, {
        params: { teacher_id: teacherId, from_date: fromDate, to_date: toDate },
      });

      console.log("📥 range raw response:", JSON.stringify(raw));

      if (!raw?.status || !Array.isArray(raw.data) || raw.data.length === 0) {
        return null;
      }

      return raw;
    } catch (err: unknown) {
      const errObj = err as { response?: { status?: number; data?: unknown }; message?: string };
      const statusCode = errObj?.response?.status;
      const respData   = errObj?.response?.data as Record<string, unknown> | undefined;

      if (statusCode === 404 && respData?.status === false) {
        return null;
      }

      console.error("❌ getTeacherAttendanceSummaryRange failed", { teacherId, fromDate, toDate, statusCode });
      throw new Error(`Attendance range error (${statusCode ?? "network"}): ${(errObj as { message?: string })?.message}`);
    }
  },
};
