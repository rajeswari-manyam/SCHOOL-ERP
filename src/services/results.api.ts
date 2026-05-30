import api from "@/config/axios";

/* =========================
   TYPES
========================= */

export interface Result {
  id: string;
  student_id: string;
  exam_type: string;
  examName: string | null;
  class_id: string | null;
  className: string | null;
  subject_id: string | null;
  subjectName: string | null;
  academic_year: string;
  marks: number;
  grade: string;
  remarks: string;
  absent: boolean;
  school_code: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllResultsResponse {
  status: boolean;
  count: number;
  data: Result[];
}

export interface GetResultByIdResponse {
  status: boolean;
  data: Result;
}

export interface CreateResultPayload {
  student_id: string;
  exam_type: string;
  classname: string;
  section: string;
  academic_year: string;
  marks: number;
  grade: string;
  remarks: string;
  absent: boolean;
  school_code: string;
}

export interface UpdateResultPayload {
  exam_type?: string;
  marks?: number;
  grade?: string;
  remarks?: string;
  absent?: boolean;
}

/* =========================
   API FUNCTIONS
========================= */

// POST /tenant/createresults
export const createResult = async (
  payload: CreateResultPayload
): Promise<{ status: boolean; message: string; data: Result }> => {
  const { data } = await api.post("/tenant/createresults", payload);
  return data;
};

// GET /tenant/getallresults
export const getAllResults = async (): Promise<GetAllResultsResponse> => {
  const { data } = await api.get("/tenant/getallresults");
  return data;
};

// GET /tenant/getresultById/:id
export const getResultById = async (
  id: string
): Promise<GetResultByIdResponse> => {
  const { data } = await api.get(`/tenant/getresultById/${id}`);
  return data;
};

// PUT /tenant/updateresultById/:id
export const updateResult = async (
  id: string,
  payload: UpdateResultPayload
): Promise<{ status: boolean; data: Result }> => {
  const { data } = await api.put(
    `/tenant/updateresultById/${id}`,
    payload
  );
  return data;
};

// DELETE /tenant/deleteresultById/:id
export const deleteResult = async (
  id: string
): Promise<{ status: boolean; message: string }> => {
  const { data } = await api.delete(
    `/tenant/deleteresultById/${id}`
  );
  return data;
};

// GET /tenant/student-results
export const getStudentResults = async (
  student_id: string,
  exam_type: string,
  academic_year: string
): Promise<GetAllResultsResponse> => {
  const { data } = await api.get(
    `/tenant/student-results?student_id=${student_id}&exam_type=${exam_type}&academic_year=${academic_year}`
  );
  return data;
};