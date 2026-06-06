import api from "@/config/axios";
import type {
  ExamSelector,
  StudentMarkEntry,
  SubmittedExam,
  PublishedResult,
  ClassStudentResultsQuery,
  ClassStudentResultsResponse,
  StudentResultItem,
  CreateStudentResultPayload,
  CreateStudentResultResponse,
} from "../types/exam-marks.types";

const isDev = import.meta.env.DEV;

function logger(level: "log" | "warn" | "error", ...args: unknown[]) {
  if (!isDev) return;
  const fn = console[level];
  fn(`[exam-marks-api]`, ...args);
}

export class ExamMarksApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly endpoint?: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "ExamMarksApiError";
  }
}

function extractFlatArray(raw: unknown): Record<string, unknown>[] | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  if (Array.isArray(obj?.data)) return obj.data as Record<string, unknown>[];
  return null;
}

function hasApiError(raw: unknown): string | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  if (obj?.status === false) return (obj?.message as string) ?? "Unknown API error";
  if (obj?.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
    const inner = obj.data as Record<string, unknown>;
    if (inner?.status === false) return (inner?.message as string) ?? "Unknown API error";
  }
  return null;
}

function mapStudentResultItem(item: Record<string, unknown>): StudentResultItem {
  return {
    id: (item.id ?? item._id ?? item.studentId ?? item.student_id ?? "") as string,
    studentId: (item.studentId ?? item.student_id ?? item.id ?? "") as string,
    studentName: (item.studentName ?? item.student_name ?? item.name ?? "") as string,
    rollNo: (item.rollNo ?? item.roll_no ?? item.rollNumber ?? "") as string,
    marks: item.marks != null ? Number(item.marks) : undefined,
    maxMarks: item.maxMarks != null ? Number(item.maxMarks) : undefined,
    grade: (item.grade ?? "") as string,
    isAbsent: item.isAbsent === true || item.is_absent === true,
    remarks: (item.remarks ?? "") as string,
    subjectName: (item.subjectName ?? item.subject_name ?? item.subject ?? "") as string,
    examType: (item.examType ?? item.exam_type ?? "") as string,
    className: (item.className ?? item.class_name ?? "") as string,
    sectionName: (item.sectionName ?? item.section_name ?? "") as string,
  };
}

export const examMarksApi = {
  loadStudents: async (selector: ExamSelector): Promise<StudentMarkEntry[]> => {
    try {
      const { data } = await api.get<StudentMarkEntry[]>("/tenant/teacher/exams/students", { params: selector });
      return data;
    } catch {
      return [];
    }
  },

  saveDraft: async (selector: ExamSelector, entries: StudentMarkEntry[]): Promise<void> => {
    try {
      await api.post("/tenant/teacher/exams/draft", { selector, entries });
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      logger("error", "saveDraft failed", { url: "/tenant/teacher/exams/draft", selector, response: ctx });
      const message = ctx?.message ?? JSON.stringify(ctx) ?? err?.message ?? "Failed to save draft";
      throw new ExamMarksApiError(message, err?.response?.status, "/tenant/teacher/exams/draft", err);
    }
  },

  submitMarks: async (selector: ExamSelector, entries: StudentMarkEntry[]): Promise<void> => {
    try {
      await api.post("/tenant/teacher/exams/submit", { selector, entries });
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      logger("error", "submitMarks failed", { url: "/tenant/teacher/exams/submit", selector, response: ctx });
      const message = ctx?.message ?? JSON.stringify(ctx) ?? err?.message ?? "Failed to submit marks";
      throw new ExamMarksApiError(message, err?.response?.status, "/tenant/teacher/exams/submit", err);
    }
  },

  getSubmittedExams: async (): Promise<SubmittedExam[]> => {
    try {
      const { data } = await api.get<SubmittedExam[]>("/tenant/teacher/exams/submitted");
      return data;
    } catch {
      return [];
    }
  },

  getPublishedResults: async (): Promise<PublishedResult[]> => {
    try {
      const { data } = await api.get<PublishedResult[]>("/tenant/teacher/exams/published");
      return data;
    } catch {
      return [];
    }
  },

  downloadReport: async (resultId: string): Promise<void> => {
    try {
      const res = await api.get(`/tenant/teacher/exams/published/${resultId}/pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `result-${resultId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      logger("error", "downloadReport failed", { resultId, response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to download report";
      throw new ExamMarksApiError(message, err?.response?.status, `/tenant/teacher/exams/published/${resultId}/pdf`, err);
    }
  },

  // ── /tenant/class-student-results ──────────────────────────────────────────

  getClassStudentResults: async (params: ClassStudentResultsQuery): Promise<StudentResultItem[]> => {
    logger("log", "Fetching class student results", params);

    try {
      const { data: raw } = await api.get<ClassStudentResultsResponse>("/tenant/class-student-results", { params });

      const apiError = hasApiError(raw);
      if (apiError) {
        logger("warn", "Class-student-results API returned error", { message: apiError });
        throw new ExamMarksApiError(apiError, undefined, "/tenant/class-student-results");
      }

      // Flat format: { status, count, data: [...] }
      const flatItems = extractFlatArray(raw);
      if (flatItems) {
        return flatItems.map(mapStudentResultItem);
      }

      // Response is already an array
      if (Array.isArray(raw)) {
        return raw.map(mapStudentResultItem);
      }

      logger("log", "No results returned from class-student-results API");
      return [];
    } catch (err) {
      if (err instanceof ExamMarksApiError) throw err;
      const error = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
      const ctx = error?.response?.data ?? error?.message;
      logger("error", "getClassStudentResults failed", { params, response: ctx });
      const message = error?.response?.data?.message ?? JSON.stringify(error?.response?.data) ?? error?.message ?? "Failed to fetch student results";
      throw new ExamMarksApiError(message, error?.response?.status, "/tenant/class-student-results", err);
    }
  },

  // ── /tenant/createresults ─────────────────────────────────────────────────

  createStudentResult: async (payload: CreateStudentResultPayload): Promise<CreateStudentResultResponse> => {
    logger("log", "Creating student result", { student_id: payload.student_id, subjectName: payload.subjectName });

    try {
      const { data } = await api.post<CreateStudentResultResponse>("/tenant/createresults", payload);

      if (data?.status === false) {
        const msg = data?.message ?? "Create result API returned error";
        logger("warn", "Create result API returned error", { message: msg });
        throw new ExamMarksApiError(msg, undefined, "/tenant/createresults");
      }

      logger("log", "Student result created successfully", { student_id: payload.student_id });
      return data;
    } catch (err) {
      if (err instanceof ExamMarksApiError) throw err;
      const error = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
      const ctx = error?.response?.data ?? error?.message;
      logger("error", "createStudentResult failed", { student_id: payload.student_id, response: ctx });
      const message = error?.response?.data?.message ?? JSON.stringify(error?.response?.data) ?? error?.message ?? "Failed to create student result";
      throw new ExamMarksApiError(message, error?.response?.status, "/tenant/createresults", err);
    }
  },

  createBatchResults: async (entries: StudentMarkEntry[], selector: ExamSelector): Promise<CreateStudentResultResponse[]> => {
    const schoolCode = localStorage.getItem("schoolcode") ?? import.meta.env.VITE_SCHOOL_CODE ?? "";

    const payloads: CreateStudentResultPayload[] = entries
      .filter((e) => e.marks !== "" || e.isAbsent)
      .map((e) => ({
        student_id: e.studentId,
        exam_type: selector.examType,
        className: selector.className,
        subjectName: selector.subject,
        academic_year: selector.academicYear,
        marks: e.isAbsent ? 0 : (e.marks as number),
        grade: e.isAbsent ? "F" : (e.grade ?? ""),
        remarks: e.remarks,
        absent: e.isAbsent,
        school_code: schoolCode,
      }));

    if (payloads.length === 0) {
      logger("log", "No entries to submit");
      return [];
    }

    logger("log", `Submitting ${payloads.length} results in batch`);

    const results: CreateStudentResultResponse[] = [];
    for (const payload of payloads) {
      const result = await examMarksApi.createStudentResult(payload);
      results.push(result);
    }

    return results;
  },
};
