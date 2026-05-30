import api from "@/config/axios";

/* =========================
   TYPES  (matches actual API response)
========================= */

export interface TimetableSlot {
  id: string;
  className: string;
  sectionName: string;
  class_id: string | null;
  subject_id: string | null;
  subjectname: string;
  teacher_id: string;
  teachername: string;
  period_no: number;
  time_sloat: string;           // typo in API intentionally kept
  day_of_week: string;          // lowercase: "monday", "tuesday" …
  start_time: string;           // "09:00:00"
  end_time: string;             // "09:45:00"
  room_no: string;
  lunch_start: string;          // "12:30:00"
  lunch_end: string;            // "01:00:00"
  academic_year: string;
  school_code: string;
  createdAt: string;
  updatedAt: string;
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
   GET API FUNCTIONS ONLY
========================= */

// GET /tenant/getalltimetable?className=10&sectionName=A
export const getAllTimetable = async (
  className: string,
  sectionName: string
): Promise<GetAllTimetableResponse> => {
  const { data } = await api.get<GetAllTimetableResponse>(
    `/tenant/getalltimetable?className=${className}&sectionName=${sectionName}`
  );
  return data;
};

// GET /tenant/getTimetableById/:id
export const getTimetableById = async (
  id: string
): Promise<GetTimetableByIdResponse> => {
  const { data } = await api.get<GetTimetableByIdResponse>(
    `/tenant/getTimetableById/${id}`
  );
  return data;
};

// GET /tenant/getAllexams-timetable?classname=10&sectionname=A
export const getAllExamTimetable = async (
  className: string,
  sectionName: string
): Promise<GetAllExamTimetableResponse> => {
  const { data } = await api.get<GetAllExamTimetableResponse>(
    `/tenant/getAllexams-timetable?classname=${className}&sectionname=${sectionName}`
  );
  return data;
};