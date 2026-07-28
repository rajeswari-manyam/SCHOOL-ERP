// services/marks.api.ts
import api from "@/config/axios";

/* =========================================================
   📘 TYPES
========================================================= */

export interface Mark {
  id: string;
  student_id: string;
  student_name: string;
  roll_number: string;
  exam_id: string;
  exam_name: string | null;
  subject_id: string;
  subject_name: string | null;
  class_id: string;
  class_name: string;
  section_id: string;
  section_name: string;
  academicYearId: string;
  academic_year: string;
  marks_obtained: number;
  max_marks: number;
  grade: string;
  remarks: string;
  is_absent: boolean;
}

/* =========================================================
   📘 GET MARKS BY STUDENT ID
========================================================= */

export interface GetMarksByStudentIdResponse {
  status: boolean;
  count: number;
  data: Mark[];
}

export const getMarksByStudentId = async (
  studentId: string,
  examId?: string
): Promise<GetMarksByStudentIdResponse> => {
  const { data } = await api.get<GetMarksByStudentIdResponse>(
    `/tenant/getmarksbystudentId`,
    {
      params: {
        student_id: studentId,
        exam_id: examId, // ✅ ADD THIS
      },
    }
  );
  return data;
};

/* =========================================================
   📘 CREATE MARK
========================================================= */

export interface CreateMarkPayload {
  student_id: string;
  exam_id: string;
  rollNumber: string;
  academicYearId: string;
  subject_id: string;
  class_id: string;
  section_id: string;
  marks_obtained: number;
  max_marks: number;
  grade: string;
  remarks?: string;
  is_absent: boolean;
  school_code: string;
}

export interface CreateMarkResponse {
  status: boolean;
  message: string;
  data: Mark & { createdAt: string; updatedAt: string };
}

export const createMark = async (
  payload: CreateMarkPayload
): Promise<CreateMarkResponse> => {
  const { data } = await api.post<CreateMarkResponse>(
    `/tenant/createmarks`,
    payload
  );
  return data;
};

/* =========================================================
   📘 DOWNLOAD MARKS / RESULT PDF
   GET /tenant/marksdownload?student_id=&exam_id=
========================================================= */

export interface DownloadedMarksFile {
  blob: Blob;
  filename: string;
}

export const downloadMarksPdf = async (
  studentId: string,
  examId: string
): Promise<DownloadedMarksFile> => {
  const response = await api.get(`/tenant/marksdownload`, {
    params: { student_id: studentId, exam_id: examId },
    responseType: "blob",
  });
  const blob: Blob = response.data;

  if (blob.type === "application/json" || blob.type === "text/plain") {
    const text = await blob.text();
    try {
      const json = JSON.parse(text);
      throw new Error(json.message || json.error || "Server returned an error instead of a PDF.");
    } catch (e) {
      if (e instanceof SyntaxError) throw new Error(text || "Server returned an unexpected response.");
      throw e;
    }
  }

  const disposition = String(response.headers["content-disposition"] ?? "");
  const nameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  if (nameMatch) {
    return { blob, filename: nameMatch[1].replace(/['"]/g, "").trim() };
  }

  return { blob, filename: `result-${studentId.slice(0, 8)}.pdf` };
};

/** Fetches the result PDF and triggers a browser download. */
export const triggerMarksDownload = async (
  studentId: string,
  examId: string
): Promise<void> => {
  const { blob, filename } = await downloadMarksPdf(studentId, examId);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => window.URL.revokeObjectURL(url), 100);
};