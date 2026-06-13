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