/**
 * src/services/timetable.api.ts
 */

import api from "@/config/axios";

export interface TimetableSlot {
  id: string;
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  period_no: number;
  time_sloat: string;
  day_of_week: string;
  room_no: string;
  academicYearId: string;
  break_start: string;
  break_end: string;
  lunch_start: string;
  lunch_end: string;
  start_time: string;
  end_time: string;
  subjectname: string;
  teachername: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimetablePayload {
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  period_no: number;
  time_sloat: string;
  day_of_week: string;
  room_no: string;
  academicYearId: string;
  break_start: string;
  break_end: string;
  lunch_start: string;
  lunch_end: string;
}

export type CreateTimetablePayload = TimetablePayload;

export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";
export type ExamNotifyStatus = "SENT" | "PENDING" | "FAILED";

export interface ExamEntry {
  id: string;
  subject: string;
  className: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  notifyStatus: ExamNotifyStatus;
}

export interface EditPeriodPayload {
  classId: string;
  day: DayOfWeek;
  periodNo: number;
  subject: string;
  teacherName: string;
  room: string;
  applyToAllWeeks: boolean;
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

export interface GetAllTimetableResponse {
  status: boolean;
  count: number;
  data: TimetableSlot[];
}

export interface GetTimetableByIdResponse {
  status: boolean;
  data: TimetableSlot;
}

export interface CreateUpdateTimetableResponse {
  status: boolean;
  message: string;
  data: TimetableSlot;
}

export interface DeleteTimetableResponse {
  status: boolean;
  message: string;
}

export interface ExamTimetableSlot {
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
  data: ExamTimetableSlot[];
}

/* =========================
   API FUNCTIONS
========================= */

// POST /tenant/createtimetable
export const createTimetable = async (
  payload: TimetablePayload,
): Promise<CreateUpdateTimetableResponse> => {
  const { data } = await api.post<CreateUpdateTimetableResponse>(
    "/tenant/createtimetable",
    payload,
  );
  return data;
};

// GET /tenant/getalltimetable?class_id=<UUID>&section_id=<UUID>
export const getAllTimetable = async (
  class_id: string,
  section_id: string,
  teacher_id?: string,
): Promise<GetAllTimetableResponse> => {
  const params: Record<string, string> = { class_id, section_id };
  if (teacher_id) params.teacher_id = teacher_id;
  const { data } = await api.get<GetAllTimetableResponse>("/tenant/getalltimetable", { params });
  return data;
};

// GET /tenant/gettimetableById/:id
export const getTimetableById = async (
  id: string,
): Promise<GetTimetableByIdResponse> => {
  const { data } = await api.get<GetTimetableByIdResponse>(
    `/tenant/gettimetableById/${id}`,
  );
  return data;
};

// PUT /tenant/updatetimetableById/:id
export const updateTimetableById = async (
  id: string,
  payload: TimetablePayload,
): Promise<CreateUpdateTimetableResponse> => {
  const { data } = await api.put<CreateUpdateTimetableResponse>(
    `/tenant/updatetimetableById/${id}`,
    payload,
  );
  return data;
};

// DELETE /tenant/deletetimetableById/:id
export const deleteTimetableById = async (
  id: string,
): Promise<DeleteTimetableResponse> => {
  const { data } = await api.delete<DeleteTimetableResponse>(
    `/tenant/deletetimetableById/${id}`,
  );
  return data;
};