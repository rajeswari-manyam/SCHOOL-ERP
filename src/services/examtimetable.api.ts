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
  syllabus?: string;
}

// GET LIST response structure
export interface ExamTimetableListItem {
  id: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  room_no: string;
  syllabus?: string;

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

/** ================= CREATE (single) ================= */

// The backend can respond 200 OK with { status: false, message: "..." }
// on a conflict (e.g. duplicate date/time) instead of an HTTP error status.
// Normalize that into a real rejected promise so callers can just try/catch.
export const createExamTimetable = async (
  data: Partial<ExamTimetablePayload>
) => {
  const res = await api.post("/tenant/createexams-timetable", data);

  if (res.data?.status === false) {
    const error: any = new Error(
      res.data?.message || "Failed to save exam timetable."
    );
    error.response = { data: res.data };
    throw error;
  }

  return res.data.data;
};

/** ================= CREATE (bulk) ================= */

export interface BulkExamTimetablePayload {
  examsTimetables: (ExamTimetablePayload & { schoolWorkingDayId?: string })[];
}

export interface BulkExamTimetableResponse {
  status: boolean;
  message: string;
  inserted: number;
  failed: number;
  skipped: number;
  errors: { row: number; exam_date: string; day: string; message: string }[];
  data: ExamTimetableDetail[];
}

export const bulkCreateExamTimetable = async (
  payload: BulkExamTimetablePayload
): Promise<BulkExamTimetableResponse> => {
  const res = await api.post("/tenant/exams-timetable/bulk", payload);
  const data = res.data as BulkExamTimetableResponse;

  // Bulk endpoint returns 200 OK even when every row failed (status:false)
  // or when some rows failed (failed > 0, e.g. "Time slot conflicts with an
  // existing exam..."). Either case needs to surface to the caller as a
  // rejection — axios won't throw on its own since the HTTP status is fine.
  if (data?.status === false || (data?.failed ?? 0) > 0) {
    const firstMessage = data?.errors?.[0]?.message;
    const error: any = new Error(
      firstMessage || data?.message || "Failed to save exam timetable."
    );
    error.response = { data };
    throw error;
  }

  return data;
};

/** ================= GET ALL ================= */

export const getAllExamTimetables = async (params: {
  class_id?: string;
  subject_id?: string;
  exam_date?: string;
  academicYearId?: string;
  section_id?: string;
  examnameid?: string;
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
  data: ExamTimetablePayload
) => {
  const res = await api.put(
    `/tenant/updateexams-timetableById/${id}`,
    data
  );

  if (res.data?.status === false) {
    const error: any = new Error(
      res.data?.message || "Failed to update exam timetable."
    );
    error.response = { data: res.data };
    throw error;
  }

  return res.data.data;
};

/** ================= DELETE ================= */

export const deleteExamTimetable = async (id: string) => {
  const res = await api.delete(
    `/tenant/deleteexams-timetableById/${id}`
  );
  return res.data;
};

/** ================= GET BY TEACHER ID ================= */

export interface ExamTimetableByTeacherResponse {
  status: boolean;
  count: number;
  data: ExamTimetableByTeacherItem[];
}

export interface ExamTimetableByTeacherItem {
  id: string;
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
  syllabus?: string;
  createdAt: string;
  updatedAt: string;
  /** Optional populated nested objects */
  class?: { id: string; name: string };
  subject?: { id: string; name: string };
  section?: { id: string; name: string };
  exam?: { id: string; name: string };
  teacher?: { id: string; name: string };
}

export const getExamTimetableByTeacherId = async (
  teacherId: string,
): Promise<ExamTimetableByTeacherResponse> => {
  const { data } = await api.get<ExamTimetableByTeacherResponse>(
    `/tenant/examtimetableByTeacherId/${teacherId}`,
  );
  return data;
};

/** ================= TODAY'S EXAM TIMETABLE (by date) ================= */

export interface TodayExamItem {
  id: string;
  section_id: string;
  section_name: string;
  subject_id: string;
  subject_name: string;
  exam_id: string;
  exam_name: string;
  teacher_id: string;
  teacher_name: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  room_no: string;
  syllabus?: string;
}

export interface TodayExamClass {
  class_id: string;
  class_name: string;
  total_exams: number;
  exams: TodayExamItem[];
}

export interface TodayExamTimetableResponse {
  status: boolean;
  message: string;
  exam_date: string;
  total_classes: number;
  total_exams: number;
  data: TodayExamClass[];
}

export const getTodayExamTimetable = async (date: string): Promise<TodayExamTimetableResponse> => {
  const res = await api.get("/tenant/todayexamtimetable", { params: { date } });
  return res.data;
};

/** ================= UPCOMING EXAMS (for parent/student portals) ================= */

export interface UpcomingExamItem {
  id: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  room_no: string | null;
  syllabus?: string | null;
  class: { id: string; class_name: string } | null;
  section: { id: string; sectionName: string } | null;
  subject: { id: string; subject_name: string } | null;
  exam: { id: string; exam_name: string } | null;
  teacher: { id: string; name: string } | null;
}

export interface UpcomingExamsResponse {
  status: boolean;
  message: string;
  count: number;
  data: UpcomingExamItem[];
}

export const getUpcomingExams = async (params: {
  class_id: string;
  section_id?: string;
  date?: string;
}): Promise<UpcomingExamsResponse> => {
  const res = await api.get("/tenant/upcomingexams", { params });
  return res.data;
};

/** ================= AVAILABLE TEACHERS FOR EXAM SLOT ================= */

export interface AvailableTeacherForExam {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
}

export interface AssignedTeacherForExam extends AvailableTeacherForExam {
  room_no: string;
}

export interface AvailableTeachersForExamResponse {
  status: boolean;
  exam_date: string;
  start_time: string;
  end_time: string;
  total: number;
  available_count: number;
  assigned_count: number;
  available_teachers: AvailableTeacherForExam[];
  assigned_teachers: AssignedTeacherForExam[];
}

export const getAvailableTeachersForExam = async (params: {
  exam_date: string;
  start_time: string;
  end_time: string;
}): Promise<AvailableTeachersForExamResponse> => {
  const res = await api.get("/tenant/availableteachersforexam", { params });
  return res.data;
};