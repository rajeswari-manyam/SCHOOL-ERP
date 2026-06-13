import api from "@/config/axios";
import type {
  ExamSelector,
  StudentMarkEntry,
  SubmittedExam,
  PublishedResult,
  ClassStudentResultsQuery,
  ClassStudentResultsResponse,
  StudentResultItem,
  StudentsBySubjectQuery,
  StudentsBySubjectItem,
  BulkMarksPayload,
  BulkMarksResponse,
  GetAllMarksQuery,
  MarksRecordItem,
} from "../types/exam-marks.types";

const isDev = import.meta.env.DEV;

function logger(level: "log" | "warn" | "error", ...args: unknown[]) {
  if (!isDev) return;
  const fn = console[level];
  fn(`[exam-marks-api]`, ...args);
}

export class ExamMarksApiError extends Error {
  statusCode?: number;
  endpoint?: string;
  originalError?: unknown;

  constructor(
    message: string,
    statusCode?: number,
    endpoint?: string,
    originalError?: unknown,
  ) {
    super(message);
    this.name = "ExamMarksApiError";
    this.statusCode = statusCode;
    this.endpoint = endpoint;
    this.originalError = originalError;
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

function mapMarksRecordItem(item: Record<string, unknown>): MarksRecordItem {
  return {
    id: (item.id ?? item._id ?? item.marksId ?? "") as string,
    studentId: (item.studentId ?? item.student_id ?? item.student ?? "") as string,
    studentName: (item.studentName ?? item.student_name ?? item.name ?? item.student ?? "") as string,
    rollNo: (item.rollNo ?? item.roll_no ?? item.rollNumber ?? item.roll_number ?? "") as string,
    marksObtained: item.marksObtained != null ? Number(item.marksObtained) : item.marks_obtained != null ? Number(item.marks_obtained) : item.marks != null ? Number(item.marks) : undefined,
    maxMarks: item.maxMarks != null ? Number(item.maxMarks) : item.max_marks != null ? Number(item.max_marks) : undefined,
    grade: (item.grade ?? "") as string,
    isAbsent: item.isAbsent === true || item.is_absent === true,
    remarks: (item.remarks ?? "") as string,
    subjectName: (item.subjectName ?? item.subject_name ?? item.subject ?? "") as string,
    examId: (item.examId ?? item.exam_id ?? "") as string,
    examName: (item.examName ?? item.exam_name ?? "") as string,
    className: (item.className ?? item.class_name ?? "") as string,
    sectionName: (item.sectionName ?? item.section_name ?? "") as string,
    academicYearId: (item.academicYearId ?? item.academic_year_id ?? "") as string,
  };
}

function mapStudentsBySubjectItem(item: Record<string, unknown>): StudentsBySubjectItem {
  return {
    id: (item.id ?? item._id ?? item.studentId ?? item.student_id ?? "") as string,
    studentId: (item.studentId ?? item.student_id ?? item.id ?? "") as string,
    studentName: (item.studentName ?? item.student_name ?? item.name ?? item.student ?? "") as string,
    rollNo: (item.rollNo ?? item.roll_no ?? item.rollNumber ?? item.roll_number ?? "") as string,
    className: (item.className ?? item.class_name ?? "") as string,
    sectionName: (item.sectionName ?? item.section_name ?? "") as string,
    subjectName: (item.subjectName ?? item.subject_name ?? "") as string,
  };
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

  // ── /tenant/studentsbysubject ─────────────────────────────────────────────

  getStudentsBySubject: async (params: StudentsBySubjectQuery): Promise<StudentsBySubjectItem[]> => {
    logger("log", "Fetching students by subject", params);

    try {
      const { data: raw } = await api.get("/tenant/studentsbysubject", { params });

      // Response may be { status: true, data: [...] }
      if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        if (Array.isArray(obj?.data)) return (obj.data as Record<string, unknown>[]).map(mapStudentsBySubjectItem);
        if (obj?.status === true && Array.isArray(obj?.students)) return (obj.students as Record<string, unknown>[]).map(mapStudentsBySubjectItem);
      }

      // Response is a flat array
      if (Array.isArray(raw)) return raw.map(mapStudentsBySubjectItem);

      logger("log", "No students returned from studentsbysubject API");
      return [];
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      logger("error", "getStudentsBySubject failed", { params, response: ctx });
      const message = ctx?.message ?? JSON.stringify(ctx) ?? err?.message ?? "Failed to fetch students";
      throw new ExamMarksApiError(message, err?.response?.status, "/tenant/studentsbysubject", err);
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

  // ── /tenant/getallmarks ──────────────────────────────────────────────────

  getAllMarks: async (params: GetAllMarksQuery): Promise<MarksRecordItem[]> => {
    logger("log", "Fetching marks", params);

    try {
      const { data: raw } = await api.get("/tenant/getallmarks", { params });

      if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        if (Array.isArray(obj?.data)) return (obj.data as Record<string, unknown>[]).map(mapMarksRecordItem);
        if (obj?.status === true && Array.isArray(obj?.marks)) return (obj.marks as Record<string, unknown>[]).map(mapMarksRecordItem);
      }

      if (Array.isArray(raw)) return raw.map(mapMarksRecordItem);

      logger("log", "No marks returned from getallmarks API");
      return [];
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      logger("error", "getAllMarks failed", { params, response: ctx });
      const message = ctx?.message ?? JSON.stringify(ctx) ?? err?.message ?? "Failed to fetch marks";
      throw new ExamMarksApiError(message, err?.response?.status, "/tenant/getallmarks", err);
    }
  },

  // ── /tenant/marks/bulk ────────────────────────────────────────────────────

  submitMarksBulk: async (entries: StudentMarkEntry[], selector: ExamSelector): Promise<BulkMarksResponse> => {
    const schoolCode = localStorage.getItem("schoolcode") ?? import.meta.env.VITE_SCHOOL_CODE ?? "";

    const marks: BulkMarksPayload["marks"] = entries
      .filter((e) => e.marks !== "" || e.isAbsent)
      .map((e) => ({
        student_id: e.studentId,
        exam_id: selector.examId ?? "",
        rollNumber: e.rollNo,
        academicYearId: selector.academicYearId ?? "",
        subject_id: selector.subjectId ?? "",
        class_id: selector.classId ?? "",
        section_id: selector.sectionId ?? "",
        marks_obtained: e.isAbsent ? 0 : (e.marks as number),
        max_marks: e.maxMarks,
        grade: e.isAbsent ? "F" : (e.grade ?? ""),
        remarks: e.remarks,
        is_absent: e.isAbsent,
      }));

    if (marks.length === 0) {
      logger("log", "No entries to submit");
      return { status: true, message: "No entries to submit", count: 0 };
    }

    const payload: BulkMarksPayload = { school_code: schoolCode, marks };

    logger("log", `Submitting ${marks.length} marks via /tenant/marks/bulk`, { sample: marks[0], school_code: schoolCode });

    try {
      const { data } = await api.post<BulkMarksResponse>("/tenant/marks/bulk", payload);

      const formatError = (e: unknown): string => {
        if (!e || typeof e !== "object") return String(e);
        const obj = e as Record<string, unknown>;
        const id = (obj.student_id ?? obj.studentId ?? obj.id ?? obj.index ?? "?") as string;
        const err = (obj.error ?? obj.message ?? obj.reason ?? obj.msg ?? JSON.stringify(obj)) as string;
        return `${id}: ${err}`;
      };

      if (data?.status === false || (data?.errors && Array.isArray(data.errors) && data.errors.length > 0)) {
        const errArr = Array.isArray(data?.errors) ? data.errors : [];
        const errorsDetail = errArr.map(formatError).join("; ");
        const prefix = data?.message ?? "Bulk marks API error";
        const msg = errorsDetail ? `${prefix} — ${errorsDetail}` : prefix;
        logger("warn", "Bulk marks API error", { message: data?.message, errors: data?.errors });
        throw new ExamMarksApiError(msg, undefined, "/tenant/marks/bulk");
      }

      logger("log", `Bulk marks submitted successfully: ${data?.count ?? marks.length} records`);
      return data;
    } catch (err) {
      if (err instanceof ExamMarksApiError) throw err;
      const error = err as { response?: { data?: { message?: string; errors?: Array<Record<string, unknown>> }; status?: number }; message?: string };
      const resData = error?.response?.data as Record<string, unknown> | undefined;
      const errorsArr = Array.isArray(resData?.errors) ? (resData.errors as Array<Record<string, unknown>>) : [];
      const errorsDetail = errorsArr.map((e) => `${e.student_id ?? e.studentId ?? "?"}: ${e.error ?? e.message ?? e.reason ?? JSON.stringify(e)}`).join("; ");
      const prefix = resData?.message as string ?? "";
      const msg = errorsDetail ? `${prefix} — ${errorsDetail}` : (prefix || error?.message || "Failed to submit marks");
      logger("error", "submitMarksBulk failed", { count: marks.length, response: resData });
      throw new ExamMarksApiError(msg, error?.response?.status, "/tenant/marks/bulk", err);
    }
  },
};
