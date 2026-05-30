import api from "@/config/axios";
import type {
  CreateHomeworkPayload,
  UpdateHomeworkPayload,
  HomeworkListQuery,
  HomeworkApiResponse,
  HomeworkApiItem,
  HomeworkItem,
  HomeworkStatus,
  StudyMaterial,
  MaterialType,
  MaterialApiItem,
  CreateStudyMaterialPayload,
} from "../types/homework.types";

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

const toStatus = (dueDate: string, isPublished: boolean): HomeworkStatus => {
  if (!isPublished) return "PAST";
  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return due >= now ? "ACTIVE" : "PAST";
};

const extractHomeworkList = (raw: unknown): HomeworkApiItem[] => {
  if (!raw || typeof raw !== "object") return [];

  const obj = raw as Record<string, unknown>;

  // { data: [...] }
  if (Array.isArray(obj?.data)) {
    return obj.data as HomeworkApiItem[];
  }

  // { data: { homework: [...] } } or { homework: [...] }
  const innerData = obj?.data && typeof obj.data === "object"
    ? obj.data as Record<string, unknown>
    : null;

  if (innerData && Array.isArray(innerData?.homework)) {
    return innerData.homework as HomeworkApiItem[];
  }

  if (Array.isArray(obj?.homework)) {
    return obj.homework as HomeworkApiItem[];
  }

  // Flat array
  if (Array.isArray(raw)) {
    return raw as HomeworkApiItem[];
  }

  return [];
};

const extractStudyMaterialList = (raw: unknown): MaterialApiItem[] => {
  if (!raw || typeof raw !== "object") return [];

  const obj = raw as Record<string, unknown>;

  if (Array.isArray(obj?.data)) {
    return obj.data as MaterialApiItem[];
  }

  const innerData = obj?.data && typeof obj.data === "object"
    ? obj.data as Record<string, unknown>
    : null;

  if (innerData && Array.isArray(innerData?.materials)) {
    return innerData.materials as MaterialApiItem[];
  }

  if (Array.isArray(obj?.materials)) {
    return obj.materials as MaterialApiItem[];
  }

  if (Array.isArray(raw)) {
    return raw as MaterialApiItem[];
  }

  return [];
};

const extractSingleMaterial = (raw: unknown): MaterialApiItem | null => {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  // { data: { ... } }
  if (obj?.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
    const d = obj.data as Record<string, unknown>;
    if (d.id) return d as unknown as MaterialApiItem;
  }

  // The item itself has an `id` — response is the item directly
  if (obj.id) return obj as unknown as MaterialApiItem;

  // { material: { ... } } or { studyMaterial: { ... } }
  for (const key of ["material", "studyMaterial", "result"]) {
    const val = obj[key];
    if (val && typeof val === "object" && !Array.isArray(val) && (val as Record<string, unknown>).id) {
      return val as unknown as MaterialApiItem;
    }
  }

  return null;
};

const transformMaterialItem = (item: MaterialApiItem): StudyMaterial => ({
  id: item.id,
  title: item.title,
  subject: item.subjectName,
  className: item.className,
  section: item.section,
  type: item.open_link ? "LINK" : "FILE" as MaterialType,
  fileType: item.fileType ?? (item.open_link ? "LINK" : "PDF"),
  url: item.download ?? item.open_link,
  download: item.download,
  openLink: item.open_link,
  description: item.description,
  fileName: item.download?.split("/").pop(),
  uploadedAt: item.upload_date ?? item.createdAt,
});

const transformHomeworkItem = (item: HomeworkApiItem): HomeworkItem => ({
  id: item.id,
  title: item.title,
  subject: item.subjectName,
  className: item.className,
  section: item.sectionName,
  dueDate: item.submission_date,
  description: item.description,
  attachmentName: item.attachments?.[0]?.split("/").pop() ?? undefined,
  attachmentUrl: item.attachments?.[0] ?? undefined,
  attachments: item.attachments ?? [],
  submittedCount: item.submittedCount ?? 0,
  totalCount: item.totalCount ?? 0,
  waNotifyStatus: item.waNotifyStatus ?? "NOT_SENT",
  waNotifiedAt: item.waNotifiedAt,
  status: toStatus(item.submission_date, item.is_published),
  createdAt: item.createdAt,
  isPublished: item.is_published,
});

// ── Mock fallback ───────────────────────────────────────────────────────────

const MOCK_HOMEWORK_ITEMS: HomeworkItem[] = [
  {
    id: "hw1", title: "Algebra Homework", subject: "Mathematics",
    className: "10", section: "B", dueDate: "2026-05-20",
    description: "Complete exercises 1 to 10 from chapter 5",
    attachmentName: "homework1.pdf", attachmentUrl: "https://example.com/homework1.pdf",
    attachments: ["https://example.com/homework1.pdf"],
    submittedCount: 18, totalCount: 42,
    waNotifyStatus: "NOT_SENT",
    status: "ACTIVE", createdAt: new Date().toISOString().split("T")[0],
    isPublished: true,
  },
  {
    id: "hw2", title: "Essay: My Favourite Scientist", subject: "English",
    className: "10", section: "B", dueDate: "2026-05-25",
    description: "Write a 300–400 word essay about your favourite scientist.",
    attachments: [],
    submittedCount: 8, totalCount: 42,
    waNotifyStatus: "SENT", waNotifiedAt: "2026-05-15 09:00 AM",
    status: "ACTIVE", createdAt: "2026-05-14",
    isPublished: true,
  },
  {
    id: "hw3", title: "Newton's Laws – Problem Set", subject: "Science",
    className: "10", section: "B", dueDate: "2026-05-10",
    description: "Solve the 10 numerical problems based on Newton's laws.",
    attachments: [],
    submittedCount: 38, totalCount: 42,
    waNotifyStatus: "SENT", waNotifiedAt: "2026-05-08 10:30 AM",
    status: "PAST", createdAt: "2026-05-06",
    isPublished: true,
  },
];

const MOCK_MATERIALS: StudyMaterial[] = [
  { id: "m1", title: "Chapter 5 Full Notes", subject: "Mathematics", className: "10", section: "B", type: "FILE", fileType: "PDF", fileName: "Math_Ch5_Notes.pdf", description: "Complete notes for Chapter 5.", uploadedAt: "2026-05-12", size: "2.4 MB", download: "https://example.com/math_ch5_notes.pdf" },
  { id: "m2", title: "Newton's Laws – Video", subject: "Science", className: "10", section: "B", type: "LINK", fileType: "LINK", url: "https://youtube.com", openLink: "https://youtube.com", description: "Khan Academy video.", uploadedAt: "2026-05-11" },
];

// ── Teacher ID resolution ────────────────────────────────────────────────────
// The auth store's user.id may not be the staff UUID the backend expects.
// We fetch GET /tenant/getallstaff and match by phone to get the real UUID,
// then cache it in localStorage for subsequent requests.

const CACHED_TEACHER_ID_KEY = "teacherStaffId";

export const fetchTeacherId = async (phone: string): Promise<string> => {
  const cached = localStorage.getItem(CACHED_TEACHER_ID_KEY);
  if (cached) {
    console.log("📋 using cached teacherStaffId:", cached);
    return cached;
  }

  try {
    const { data: raw } = await api.get<unknown>("/tenant/getallstaff");
    let list: Record<string, unknown>[] = [];
    if (Array.isArray(raw)) list = raw as Record<string, unknown>[];
    else if (raw && typeof raw === "object") {
      const obj = raw as Record<string, unknown>;
      if (Array.isArray(obj.staff)) list = obj.staff as Record<string, unknown>[];
      else if (Array.isArray(obj.data)) list = obj.data as Record<string, unknown>[];
    }

    const normalizedPhone = phone.replace(/\D/g, "");
    const match = list.find((s) => {
      const sp = ((s.phone as string) ?? "").replace(/\D/g, "");
      return sp === normalizedPhone;
    });

    if (match?.id && typeof match.id === "string") {
      const uuid = match.id as string;
      localStorage.setItem(CACHED_TEACHER_ID_KEY, uuid);
      console.log("✅ resolved teacherStaffId:", uuid);
      return uuid;
    }

    console.warn("⚠️ could not resolve teacherStaffId from staff list, falling back to user.id");
    return "";
  } catch (err) {
    console.error("❌ fetchTeacherId error:", err);
    return "";
  }
};

export const clearCachedTeacherId = (): void => {
  localStorage.removeItem(CACHED_TEACHER_ID_KEY);
};

// ── API service ─────────────────────────────────────────────────────────────

export const homeworkApi = {
  getHomeworkList: async (params: HomeworkListQuery): Promise<HomeworkItem[]> => {
    const url = "/tenant/getallhomework";
    console.log("📥 getHomeworkList request:", { url, params });

    try {
      const { data: raw, status: httpStatus } = await api.get<unknown>(url, { params });

      const apiError = extractApiError(raw);
      if (apiError) {
        console.warn("⚠️ getHomeworkList: server returned error:", apiError);
        throw new Error(apiError);
      }

      const list = extractHomeworkList(raw);
      if (list.length > 0) {
        console.log("✅ getHomeworkList: received", list.length, "items");
        return list.map(transformHomeworkItem);
      }

      console.warn("⚠️ getHomeworkList: empty response", { httpStatus, raw });
      return MOCK_HOMEWORK_ITEMS;
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: unknown }; message?: string };
      const statusCode = error?.response?.status;
      const isServerError = !!statusCode && statusCode >= 500;
      const isNetworkError = !statusCode && error?.message === "Network Error";

      console.error("❌ getHomeworkList failed", {
        url, params, status: statusCode,
        responseData: error?.response?.data,
        message: error?.message,
      });

      if (isServerError || isNetworkError) {
        console.warn("⚠️ getHomeworkList: server error, falling back to mock data");
        return MOCK_HOMEWORK_ITEMS;
      }

      if (error?.message) throw error;
      throw new Error("Failed to fetch homework list");
    }
  },

  createHomework: async (payload: CreateHomeworkPayload): Promise<HomeworkItem> => {
    try {
      console.log("📤 createHomework payload:", JSON.stringify(payload, null, 2));
      const { data: raw, status } = await api.post<HomeworkApiResponse>("/tenant/createhomework", payload);
      console.log("📥 createHomework response:", { status, data: JSON.stringify(raw, null, 2) });

      const apiError = extractApiError(raw);
      if (apiError) throw new Error(apiError);

      if (!raw?.data || Array.isArray(raw.data)) {
        throw new Error("Invalid response from server");
      }

      return transformHomeworkItem(raw.data as HomeworkApiItem);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
      const ctx = error?.response?.data ?? error?.message;
      console.error("❌ createHomework failed", {
        status: error?.response?.status,
        responseData: error?.response?.data,
        message: error?.message,
      });
      const message =
        error?.response?.data?.message ??
        (typeof ctx === "string" ? ctx : undefined) ??
        error?.message ??
        "Failed to create homework";
      throw new Error(message);
    }
  },

  updateHomework: async (id: string, payload: UpdateHomeworkPayload): Promise<HomeworkItem> => {
    try {
      const { data: raw } = await api.put<HomeworkApiResponse>(`/tenant/updatehomeworkById/${id}`, payload);

      const apiError = extractApiError(raw);
      if (apiError) throw new Error(apiError);

      if (!raw?.data || Array.isArray(raw.data)) {
        throw new Error("Invalid response from server");
      }

      return transformHomeworkItem(raw.data as HomeworkApiItem);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const ctx = error?.response?.data ?? error?.message;
      const message =
        error?.response?.data?.message ??
        (typeof ctx === "string" ? ctx : undefined) ??
        error?.message ??
        "Failed to update homework";
      throw new Error(message);
    }
  },

  deleteHomework: async (id: string): Promise<void> => {
    try {
      const { data: raw } = await api.delete<HomeworkApiResponse>(`/tenant/deletehomeworkById/${id}`);
      const apiError = extractApiError(raw);
      if (apiError) throw new Error(apiError);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Failed to delete homework";
      throw new Error(message);
    }
  },

  sendReminder: async (id: string): Promise<void> => {
    try {
      const { data: raw } = await api.post<HomeworkApiResponse>(`/tenant/teacher/homework/${id}/remind`);
      const apiError = extractApiError(raw);
      if (apiError) throw new Error(apiError);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Failed to send reminder";
      throw new Error(message);
    }
  },

  getMaterials: async (): Promise<StudyMaterial[]> => {
    try {
      const { data: raw } = await api.get<unknown>("/tenant/teacher/materials");

      const apiError = extractApiError(raw);
      if (apiError) throw new Error(apiError);

      const list = extractStudyMaterialList(raw);
      if (list.length === 0) {
        console.warn("getMaterials: empty response from server", raw);
        return MOCK_MATERIALS;
      }

      return list.map(transformMaterialItem);
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const statusCode = (error as Record<string, unknown>)?.response
        ? ((error as Record<string, unknown>)?.response as Record<string, unknown>)?.status
        : null;
      const isServerError = statusCode === 404 || statusCode === 500;
      const isNetworkError = !statusCode && error?.message === "Network Error";

      if (isServerError || isNetworkError) {
        console.warn("getMaterials failed, falling back to mock data", {
          url: "/tenant/teacher/materials", statusCode,
        });
        return MOCK_MATERIALS;
      }

      if (error?.message) throw error;
      throw new Error("Failed to fetch study materials");
    }
  },

  createStudyMaterial: async (payload: CreateStudyMaterialPayload): Promise<StudyMaterial> => {
    const url = "/tenant/createstudymaterial";
    const isFileUpload = !!payload.downloadFile;

    try {
      let reqPayload: FormData | Record<string, unknown>;
      let config: Record<string, unknown> = {};

      if (isFileUpload) {
        const fd = new FormData();
        fd.append("className", payload.className);
        fd.append("section", payload.section);
        fd.append("subjectName", payload.subjectName);
        fd.append("upload_date", payload.upload_date);
        fd.append("download", payload.downloadFile as Blob);
        fd.append("school_code", payload.school_code);
        if (payload.title) fd.append("title", payload.title);
        if (payload.description) fd.append("description", payload.description);
        reqPayload = fd;
        config = { headers: { "Content-Type": "multipart/form-data" } };
      } else {
        const body: Record<string, unknown> = {
          className: payload.className,
          section: payload.section,
          subjectName: payload.subjectName,
          upload_date: payload.upload_date,
          school_code: payload.school_code,
          download: payload.download ?? "0",
        };
        if (payload.open_link) body.open_link = payload.open_link;
        if (payload.title) body.title = payload.title;
        if (payload.description) body.description = payload.description;
        reqPayload = body;
      }

      const payloadDump = isFileUpload
        ? "FormData(file)"
        : JSON.stringify(reqPayload, null, 2);
      console.log("📤 createStudyMaterial →", url, "\n", payloadDump);

      const { data: raw, status: httpStatus } = await api.post<unknown>(url, reqPayload, config);
      console.log("📥 createStudyMaterial ←", httpStatus, JSON.stringify(raw, null, 2));

      const apiError = extractApiError(raw);
      if (apiError) throw new Error(apiError);

      const item = extractSingleMaterial(raw);
      if (!item) {
        console.error("❌ createStudyMaterial: unexpected response shape", raw);
        throw new Error("Invalid response from server");
      }

      return transformMaterialItem(item);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const ctx = error?.response?.data ?? error?.message;
      console.error(
        "❌ createStudyMaterial failed",
        error?.response?.status,
        JSON.stringify(error?.response?.data, null, 2) ?? error?.message,
      );
      const message =
        error?.response?.data?.message ??
        (typeof ctx === "string" ? ctx : undefined) ??
        error?.message ??
        "Failed to upload material";
      throw new Error(message);
    }
  },

  getStudyMaterialById: async (id: string): Promise<StudyMaterial | null> => {
    const url = `/tenant/getstudymaterialById/${id}`;
    console.log("📥 getStudyMaterialById →", url);

    try {
      const { data: raw, status: httpStatus } = await api.get<unknown>(url);
      console.log("📥 getStudyMaterialById ←", httpStatus, JSON.stringify(raw, null, 2));

      const apiError = extractApiError(raw);
      if (apiError) {
        console.warn("⚠️ getStudyMaterialById: server returned error:", apiError);
        throw new Error(apiError);
      }

      const item = extractSingleMaterial(raw);
      if (item) return transformMaterialItem(item);

      console.warn("⚠️ getStudyMaterialById: unexpected response shape", raw);
      return null;
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: unknown }; message?: string };
      const statusCode = error?.response?.status;

      if (statusCode === 404) {
        console.warn("⚠️ getStudyMaterialById: material not found", { id, url });
        return null;
      }

      console.error(
        "❌ getStudyMaterialById failed",
        statusCode,
        JSON.stringify(error?.response?.data, null, 2) ?? error?.message,
      );
      throw error instanceof Error ? error : new Error("Failed to fetch study material");
    }
  },

  deleteMaterial: async (id: string): Promise<void> => {
    try {
      const { data: raw } = await api.delete<HomeworkApiResponse>(`/tenant/teacher/materials/${id}`);
      const apiError = extractApiError(raw);
      if (apiError) throw new Error(apiError);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Failed to delete material";
      throw new Error(message);
    }
  },
};
