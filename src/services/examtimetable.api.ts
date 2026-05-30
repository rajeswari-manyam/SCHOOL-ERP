import api from "@/config/axios";

/* =========================
   TYPES
========================= */

export interface ExamTimetable {
  id: string;
  subjectname: string;
  classname: string;
  sectionname: string;
  exam_name: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  room_no: string;
  academic_year: string;
  school_code: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllExamTimetableResponse {
  status: boolean;
  count: number;
  data: ExamTimetable[];
}

export interface GetExamTimetableByIdResponse {
  status: boolean;
  data: ExamTimetable;
}

export interface CreateExamTimetablePayload {
  subjectname: string;
  classname: string;
  sectionname: string;
  exam_name: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  room_no: string;
  academic_year: string;
  school_code: string;
}

export interface UpdateExamTimetablePayload {
  exam_name?: string;
  room_no?: string;
}

/* =========================
   API FUNCTIONS
========================= */

// GET /tenant/getAllexams-timetable
export const getAllExamTimetable = async (
  classname: string,
  sectionname: string
): Promise<GetAllExamTimetableResponse> => {
  const { data } = await api.get<GetAllExamTimetableResponse>(
    `/tenant/getAllexams-timetable?classname=${classname}&sectionname=${sectionname}`
  );
  return data;
};

// GET /tenant/getexams-timetableById/:id
export const getExamTimetableById = async (
  id: string
): Promise<GetExamTimetableByIdResponse> => {
  const { data } = await api.get<GetExamTimetableByIdResponse>(
    `/tenant/getexams-timetableById/${id}`
  );
  return data;
};

// POST /tenant/createexams-timetable
export const createExamTimetable = async (
  payload: CreateExamTimetablePayload
): Promise<{ status: boolean; data: ExamTimetable }> => {
  const { data } = await api.post(
    "/tenant/createexams-timetable",
    payload
  );
  return data;
};

// PUT /tenant/updateexams-timetableById/:id
export const updateExamTimetable = async (
  id: string,
  payload: UpdateExamTimetablePayload
): Promise<{ status: boolean; data: ExamTimetable }> => {
  const { data } = await api.put(
    `/tenant/updateexams-timetableById/${id}`,
    payload
  );
  return data;
};

// DELETE /tenant/deleteexams-timetableById/:id
export const deleteExamTimetable = async (
  id: string
): Promise<{ status: boolean; message: string }> => {
  const { data } = await api.delete(
    `/tenant/deleteexams-timetableById/${id}`
  );
  return data;
};