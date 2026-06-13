import axios from "@/config/axios";
import { createAttendance } from "../../../../services/attendance.api";
import type {
  TeacherDashboardData,
  HomeworkItem,
  Period,
  PendingHomeworkApiItem,
  AllHomeworkApiItem,
  TimetableApiItem,
} from "../types/teacher-dashboard.types";

// ── Helpers ─────────────────────────────────────────────────────────────────

const extractApiError = (raw: unknown): string | null => {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  if (obj?.status === false) {
    return (obj?.message as string) ?? null;
  }

  const inner = obj?.data && typeof obj.data === "object"
    ? obj.data as Record<string, unknown>
    : null;

  if (inner?.status === false) {
    return (inner?.message as string) ?? null;
  }

  return null;
};

const extractPendingHomeworkList = (raw: unknown, depth = 0): PendingHomeworkApiItem[] => {
  if (depth > 3) return [];
  if (Array.isArray(raw)) return raw as PendingHomeworkApiItem[];
  if (!raw || typeof raw !== "object") return [];

  const obj = raw as Record<string, unknown>;

  const keysToTry = [
    "data", "homework", "homeworks", "homeworkList",
    "items", "list", "records", "result", "pending",
  ];

  for (const key of keysToTry) {
    const val = obj[key];
    if (Array.isArray(val)) return val as PendingHomeworkApiItem[];
    if (val && typeof val === "object") {
      const nested = extractPendingHomeworkList(val, depth + 1);
      if (nested.length > 0) return nested;
    }
  }

  for (const v of Object.values(obj)) {
    if (Array.isArray(v)) return v as PendingHomeworkApiItem[];
    if (v && typeof v === "object") {
      const nested = extractPendingHomeworkList(v, depth + 1);
      if (nested.length > 0) return nested;
    }
  }

  return [];
};

const transformPendingHomeworkItem = (item: PendingHomeworkApiItem): HomeworkItem => ({
  id: item.id,
  title: item.title,
  subject: item.subjectName,
  class: `${item.className}${item.sectionName ? `-${item.sectionName}` : ""}`,
  dueDate: item.submission_date,
  submittedCount: item.submittedCount ?? 0,
  totalCount: item.totalCount ?? 0,
});

// ── All Homework helpers (uses /tenant/getallhomework endpoint) ──────────

const extractAllHomeworkList = (raw: unknown, depth = 0): AllHomeworkApiItem[] => {
  if (depth > 3) return [];
  if (Array.isArray(raw)) return raw as AllHomeworkApiItem[];
  if (!raw || typeof raw !== "object") return [];

  const obj = raw as Record<string, unknown>;

  if (depth === 0) {
    console.log("🔍 extractAllHomeworkList top-level keys:", Object.keys(obj));
  }

  const keysToTry = [
    "data", "homework", "homeworks", "homeworkList",
    "items", "list", "records", "result", "all",
  ];

  for (const key of keysToTry) {
    const val = obj[key];
    if (Array.isArray(val)) {
      console.log("🔍 extractAllHomeworkList: found array at key:", key);
      return val as AllHomeworkApiItem[];
    }
    if (val && typeof val === "object") {
      const nested = extractAllHomeworkList(val, depth + 1);
      if (nested.length > 0) return nested;
    }
  }

  for (const v of Object.values(obj)) {
    if (Array.isArray(v)) {
      console.log("🔍 extractAllHomeworkList: found array in value walk");
      return v as AllHomeworkApiItem[];
    }
    if (v && typeof v === "object") {
      const nested = extractAllHomeworkList(v, depth + 1);
      if (nested.length > 0) return nested;
    }
  }

  return [];
};

const transformAllHomeworkItem = (item: AllHomeworkApiItem): HomeworkItem => ({
  id: item.id,
  title: item.title,
  subject: item.subjectName,
  class: `${item.className}${item.sectionName ? `-${item.sectionName}` : ""}`,
  dueDate: item.submission_date,
  submittedCount: item.submittedCount ?? 0,
  totalCount: item.totalCount ?? 0,
});

// ── Timetable helpers (uses /teacher/timetable endpoint) ─────────────────────

type TimetableGridCell = {
  subject: string;
  class: string;
  room?: string;
  isFree?: boolean;
};

type TimetablePeriodSlot = {
  id: string;
  label: string;
  time: string;
  kind: "PERIOD" | "BREAK" | "LUNCH" | "FREE";
};

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const extractTodayPeriods = (raw: unknown): Period[] => {
  if (!raw || typeof raw !== "object") return [];

  const obj = raw as Record<string, unknown>;

  // Unwrap envelope: { data: { ... } } or { status, message, data: { ... } }
  let timetableData: Record<string, unknown> | null = null;

  if (obj?.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
    timetableData = obj.data as Record<string, unknown>;
  } else {
    timetableData = obj;
  }

  const grid = timetableData?.grid as Record<string, Record<string, unknown>> | undefined;
  const slots = timetableData?.periods as unknown[] | undefined;

  if (!grid || !Array.isArray(slots)) return [];

  const todayName = DAY_NAMES[new Date().getDay()];
  const periods: Period[] = [];
  let order = 0;

  for (const slot of slots) {
    if (!slot || typeof slot !== "object") continue;
    const s = slot as Record<string, unknown>;
    if (s.kind !== "PERIOD") continue;

    const slotId = s.id as string | undefined;
    const cell = slotId ? grid[slotId]?.[todayName] : undefined;

    if (!cell || typeof cell !== "object") continue;
    const c = cell as Record<string, unknown>;
    if (c.isFree || !c.subject) continue;

    const timeStr = (s.time as string) ?? "";
    const [start, end] = timeStr.includes("–")
      ? timeStr.split("–").map((t) => t.trim())
      : timeStr.includes("-")
        ? timeStr.split("-").map((t) => t.trim())
        : [timeStr, ""];

    periods.push({
      id: slotId ?? `p-${order}`,
      time: timeStr,
      subject: (c.subject as string) ?? "",
      class: (c.class as string) ?? "",
      room: (c.room as string) ?? "—",
      status: computePeriodStatus(start, end),
    });
    order++;
  }

  return periods;
};

const computePeriodStatus = (start: string, end: string): Period["status"] => {
  const parseMins = (t: string): number | null => {
    const cleaned = t.replace(/(AM|PM)/i, "").trim();
    const parts = cleaned.split(":").map(Number);
    if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
    let h = parts[0];
    const m = parts[1];
    const isPM = /PM/i.test(t);
    const is12 = h === 12;
    if (isPM && !is12) h += 12;
    if (!isPM && is12) h = 0;
    return h * 60 + m;
  };

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const startMin = parseMins(start);
  const endMin = parseMins(end);

  if (startMin === null || endMin === null) return "UPCOMING";
  if (nowMin < startMin) return "UPCOMING";
  if (nowMin > endMin) return "COMPLETED";
  return "CURRENT";
};

// ── Flat‑list timetable helpers (uses /tenant/getteacherTodayTimetable) ────

const extractTodayTimetableItems = (raw: unknown, depth = 0): TimetableApiItem[] => {
  if (depth > 3) return [];
  if (Array.isArray(raw)) return raw as TimetableApiItem[];
  if (!raw || typeof raw !== "object") return [];

  const obj = raw as Record<string, unknown>;

  // log shape for debugging
  if (depth === 0) {
    console.log("🔍 extractTodayTimetableItems top-level keys:", Object.keys(obj));
  }

  const keysToTry = [
    "data", "timetable", "periods", "schedule", "items", "list",
    "records", "result", "today", "classes",
  ];

  for (const key of keysToTry) {
    const val = obj[key];
    if (Array.isArray(val)) {
      console.log("🔍 extractTodayTimetableItems: found array at key:", key);
      return val as TimetableApiItem[];
    }
    if (val && typeof val === "object") {
      const nested = extractTodayTimetableItems(val, depth + 1);
      if (nested.length > 0) return nested;
    }
  }

  for (const v of Object.values(obj)) {
    if (Array.isArray(v)) {
      console.log("🔍 extractTodayTimetableItems: found array in value walk");
      return v as TimetableApiItem[];
    }
    if (v && typeof v === "object") {
      const nested = extractTodayTimetableItems(v, depth + 1);
      if (nested.length > 0) return nested;
    }
  }

  return [];
};

const transformTimetableItemToPeriod = (item: TimetableApiItem, order: number): Period => {
  const timeStr = item.start_time && item.end_time
    ? `${item.start_time} – ${item.end_time}`
    : "—";

  const [start, end] = timeStr.includes("–")
    ? timeStr.split("–").map((t) => t.trim())
    : [item.start_time ?? "", item.end_time ?? ""];

  return {
    id: item.id ?? `tt-${order}`,
    time: timeStr,
    subject: item.subjectName,
    class: `${item.className}${item.sectionName ? `-${item.sectionName}` : ""}`,
    room: item.room ?? "—",
    status: computePeriodStatus(start, end),
  };
};

// ── Mock fallback ───────────────────────────────────────────────────────────

const MOCK_TODAY_TIMETABLE: Period[] = [
  { id: "tt1", time: "8:00 AM – 8:45 AM",  subject: "Mathematics",   class: "8-A", room: "Room 12", status: "COMPLETED" },
  { id: "tt2", time: "8:45 AM – 9:30 AM",  subject: "Mathematics",   class: "9-B", room: "Room 7",  status: "CURRENT" },
  { id: "tt3", time: "9:45 AM – 10:30 AM", subject: "Mathematics",   class: "7-C", room: "Room 3",  status: "UPCOMING" },
  { id: "tt4", time: "11:00 AM – 11:45 AM",subject: "Free Period",   class: "Staff Room", room: "—", status: "UPCOMING" },
  { id: "tt5", time: "12:30 PM – 1:15 PM", subject: "Mathematics",   class: "8-B", room: "Room 11", status: "UPCOMING" },
];

const MOCK_PENDING_HOMEWORK: HomeworkItem[] = [
  {
    id: "mph1", title: "Chapter 5 – Exercise 5.2", subject: "Mathematics",
    class: "8-A", dueDate: new Date().toISOString().slice(0, 10),
    submittedCount: 28, totalCount: 42,
  },
  {
    id: "mph2", title: "Quadratic Equations Practice", subject: "Mathematics",
    class: "9-B", dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    submittedCount: 15, totalCount: 38,
  },
  {
    id: "mph3", title: "Fractions Revision Sheet", subject: "Mathematics",
    class: "7-C", dueDate: new Date(Date.now() + 172800000).toISOString().slice(0, 10),
    submittedCount: 5, totalCount: 35,
  },
];

export const teacherDashboardApi = {
  getDashboard: async (): Promise<TeacherDashboardData> => {
    const { data } = await axios.get("/teacher/dashboard");
    return data;
  },

  getPendingHomeworkByTeacher: async (teacherId: string): Promise<HomeworkItem[]> => {
    const url = "/tenant/pendinghomeworkbyteacher";
    console.log("📥 getPendingHomeworkByTeacher request:", { url, teacherId });

    try {
      const response = await axios.get<unknown>(url, {
        params: { teacher_id: teacherId },
      });
      const { data: raw, status: httpStatus } = response;

      console.log("📥 getPendingHomeworkByTeacher raw response:", {
        httpStatus,
        data: JSON.stringify(raw),
      });

      const apiError = extractApiError(raw);
      if (apiError) {
        console.warn("⚠️ getPendingHomeworkByTeacher: API returned error:", apiError);
        throw new Error(apiError);
      }

      const list = extractPendingHomeworkList(raw);
      if (list.length > 0) {
        console.log("✅ getPendingHomeworkByTeacher: received", list.length, "items");
        return list.map(transformPendingHomeworkItem);
      }

      console.warn("⚠️ getPendingHomeworkByTeacher: empty response, using mock", {
        httpStatus,
        raw: JSON.stringify(raw),
      });
      return MOCK_PENDING_HOMEWORK;
    } catch (err: unknown) {
      console.error("❌ getPendingHomeworkByTeacher failed", {
        url,
        teacherId,
        status: (err as { response?: { status?: number } })?.response?.status,
        responseData: (err as { response?: { data?: unknown } })?.response?.data,
        message: (err as Error)?.message,
      });

      console.warn("⚠️ getPendingHomeworkByTeacher: falling back to mock data");
      return MOCK_PENDING_HOMEWORK;
    }
  },

  getAllHomeworkList: async (teacherId: string): Promise<HomeworkItem[]> => {
    const url = "/tenant/getallhomework";
    console.log("📥 getAllHomeworkList request:", { url, teacherId });

    try {
      const response = await axios.get<unknown>(url, {
        params: { teacher_id: teacherId },
      });
      const { data: raw, status: httpStatus } = response;

      console.log("📥 getAllHomeworkList raw response:", {
        httpStatus,
        keys: typeof raw === "object" && raw ? Object.keys(raw as Record<string, unknown>) : typeof raw,
        data: JSON.stringify(raw),
      });

      // Handle status:false as empty data, not error
      if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        if (obj?.status === false) {
          console.log("ℹ️ getAllHomeworkList: API returned status:false —", (obj?.message as string) ?? "");
          return [];
        }
      }

      const list = extractAllHomeworkList(raw);
      if (list.length > 0) {
        console.log("✅ getAllHomeworkList: received", list.length, "items");
        return list.map(transformAllHomeworkItem);
      }

      console.warn("⚠️ getAllHomeworkList: empty response — no homework found");
      return [];
    } catch (err: unknown) {
      const errObj = err as { response?: { status?: number; data?: unknown }; message?: string; code?: string };
      const statusCode = errObj?.response?.status;
      const respData = errObj?.response?.data;
      const responseBody = respData ? JSON.stringify(respData) : "—";
      const errMsg = errObj?.message ?? "Unknown error";

      console.error("❌ getAllHomeworkList failed", {
        url, teacherId,
        status: statusCode,
        responseData: responseBody,
        message: errMsg,
        code: errObj?.code,
      });

      throw new Error(`Homework API error (${statusCode ?? "network"}): ${errMsg}`);
    }
  },

  getTeacherTodayTimetableV2: async (teacherId: string): Promise<Period[]> => {
    const url = "/tenant/getteacherTodayTimetable";
    console.log("📥 getTeacherTodayTimetableV2 request:", { url, teacherId });

    try {
      const response = await axios.get<unknown>(url, {
        params: { teacher_id: teacherId },
      });
      const { data: raw, status: httpStatus } = response;

      console.log("📥 getTeacherTodayTimetableV2 raw response:", {
        httpStatus,
        keys: typeof raw === "object" && raw ? Object.keys(raw as Record<string, unknown>) : typeof raw,
        data: JSON.stringify(raw),
      });

      // Handle status:false with "no entries" message as empty data, not error
      if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        if (obj?.status === false) {
          const msg = (obj?.message as string) ?? "";
          console.log("ℹ️ getTeacherTodayTimetableV2: API returned status:false —", msg);
          return [];
        }
      }

      const items = extractTodayTimetableItems(raw);
      if (items.length > 0) {
        console.log("✅ getTeacherTodayTimetableV2: received", items.length, "periods");
        return items.map((item, i) => transformTimetableItemToPeriod(item, i));
      }

      console.warn("⚠️ getTeacherTodayTimetableV2: no items extracted — response keys:", typeof raw === "object" && raw ? Object.keys(raw as Record<string, unknown>) : typeof raw);
      return [];
    } catch (err: unknown) {
      const errObj = err as { response?: { status?: number; data?: unknown }; message?: string; code?: string };
      const statusCode = errObj?.response?.status;
      const respData = errObj?.response?.data;
      const responseBody = respData ? JSON.stringify(respData) : "—";
      const errMsg = errObj?.message ?? "Unknown error";

      // 404 with status:false body = no timetable data, not an error
      const isNoData =
        statusCode === 404 &&
        respData && typeof respData === "object" &&
        (respData as Record<string, unknown>)?.status === false;

      if (isNoData) {
        console.log("ℹ️ getTeacherTodayTimetableV2: 404 with status:false — no timetable for today");
        return [];
      }

      console.error("❌ getTeacherTodayTimetableV2 failed", {
        url, teacherId,
        status: statusCode,
        responseData: responseBody,
        message: errMsg,
        code: errObj?.code,
      });

      throw new Error(
        `Timetable not available (${errMsg})`
      );
    }
  },

  getTeacherTodayTimetable: async (teacherId: string): Promise<Period[]> => {
    const url = "/teacher/timetable";
    const academicYear = `${new Date().getFullYear()}`;
    console.log("📥 getTeacherTodayTimetable request:", { url, teacherId, academicYear });

    try {
      const response = await axios.get<unknown>(url, {
        params: { teacher_id: teacherId, academic_year: academicYear },
      });
      const { data: raw, status: httpStatus } = response;

      console.log("📥 getTeacherTodayTimetable raw response:", {
        httpStatus,
        data: JSON.stringify(raw),
      });

      const periods = extractTodayPeriods(raw);
      if (periods.length > 0) {
        console.log("✅ getTeacherTodayTimetable: received", periods.length, "periods");
        return periods;
      }

      console.warn("⚠️ getTeacherTodayTimetable: no periods for today, using mock", {
        httpStatus,
        raw: JSON.stringify(raw),
      });
      return MOCK_TODAY_TIMETABLE;
    } catch (err: unknown) {
      console.error("❌ getTeacherTodayTimetable failed", {
        url,
        teacherId,
        academicYear,
        status: (err as { response?: { status?: number } })?.response?.status,
        responseData: (err as { response?: { data?: unknown } })?.response?.data,
        message: (err as Error)?.message,
      });

      console.warn("⚠️ getTeacherTodayTimetable: falling back to mock data");
      return MOCK_TODAY_TIMETABLE;
    }
  },

  markAttendanceViaWeb: async (payload: {
    classId: string;
    sectionId?: string;
    teacherId?: string;
    academicYearId?: string;
    date: string;
    records: { studentId: string; status: "PRESENT" | "ABSENT" | "HALF_DAY" }[];
  }): Promise<void> => {
    if (!payload.sectionId) throw new Error("Section selection is required to submit attendance.");

    await createAttendance({
      class_id: payload.classId,
      section_id: payload.sectionId,
      teacher_id: payload.teacherId ?? "",
      academicYearId: payload.academicYearId ?? "",
      date: payload.date,
      attendance: payload.records.map((record) => ({
        studentId: record.studentId,
        status: record.status === "ABSENT" ? "absent" : "present",
      })),
    });
  },

  markAttendanceViaWA: async (): Promise<{ sent: boolean }> => {
    const { data } = await axios.post("/teacher/attendance/mark-via-wa");
    return data;
  },

  assignHomework: async (payload: {
    classId: string;
    subject: string;
    title: string;
    description: string;
    dueDate: string;
  }): Promise<void> => {
    await axios.post("/teacher/homework", payload);
  },

  uploadMaterial: async (formData: FormData): Promise<void> => {
    await axios.post("/teacher/materials", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  applyLeave: async (payload: {
    fromDate: string;
    toDate: string;
    reason: string;
    type: string;
  }): Promise<void> => {
    await axios.post("/teacher/leave/apply", payload);
  },
};
