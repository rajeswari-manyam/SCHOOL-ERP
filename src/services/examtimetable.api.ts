import api from "@/config/axios";

/** ================= TYPES ================= */

// Raw DB structure (for CREATE / UPDATE)
export interface ExamTimetablePayload {
  class_id: string;
  subject_id: string;
  section_id: string;
  examnameid: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  room_no: string;
  academicYearId: string;
  teacher_id: string;
}

// GET LIST response structure
export interface ExamTimetableListItem {
  id: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  room_no: string;

  class: {
    id: string;
    class_name: string;
  };

  section: {
    id: string;
    sectionName: string;
  };

  subject: {
    id: string;
    subject_name: string;
  };

  exam: {
    id: string;
    exam_name: string;
  };

  teacher: {
    id: string;
    name: string;
  };
}

// GET BY ID (full DB structure)
export interface ExamTimetableDetail extends ExamTimetablePayload {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/** ================= CREATE ================= */

export const createExamTimetable = async (
  data: Partial<ExamTimetablePayload>
) => {
  const res = await api.post("/tenant/createexams-timetable", data);
  return res.data.data;
};

/** ================= GET ALL ================= */

export const getAllExamTimetables = async (params: {
  class_id?: string;
  subject_id?: string;
  exam_date?: string;
 academicYearId?: string;
  section_id?: string;
}) => {
  const res = await api.get("/tenant/getallexams-timetable", {
    params,
  });
  return res.data.data as ExamTimetableListItem[];
};

/** ================= GET BY ID ================= */

export const getExamTimetableById = async (id: string) => {
  const res = await api.get(`/tenant/getexams-timetableById/${id}`);
  return res.data.data as ExamTimetableDetail;
};

/** ================= UPDATE ================= */

export const updateExamTimetable = async (
  id: string,
  data: {
    exam_name?: string;
    room_no?: string;
  }
) => {
  const res = await api.put(
    `/tenant/updateexams-timetableById/${id}`,
    data
  );
  return res.data.data;
};

/** ================= DELETE ================= */

export const deleteExamTimetable = async (id: string) => {
  const res = await api.delete(
    `/tenant/deleteexams-timetableById/${id}`
  );
  return res.data;
};