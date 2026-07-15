import api from "@/config/axios";

/** ---------------- Types ---------------- */

export interface Homework {
  id: string;
  class_id: string | null;
  section_id: string | null;
  subject_id: string | null;
  teacher_id: string;
  title: string;
  description: string;
  submission_date: string;
  attachments: string[];
  is_published: boolean;
  academicYearId: string;
  submission_type?: "physical" | "online" | "both";
  createdAt: string;
  updatedAt: string;
  class?: { id: string; class_name?: string; name?: string };
  section?: { id: string; sectionName?: string; name?: string };
  subject?: { id: string; subject_name?: string; name?: string };
  teacher?: { id: string; name: string };
}

export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  count?: number;
  data: T;
}

export interface HomeworkSubmission {
  id: string;
  homework_id: string;
  student_id: string;
  submission_date: string;
  attachments: {
    originalName: string;
    fileName: string;
    filePath: string;
    mimeType: string;
    size: number;
  }[];
  remarks: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentSubmission {
  student_id: string;
  student_name: string;
  roll_number: string;
  status: "submitted" | "not submitted";
  submission_id: string | null;
  submission_date: string | null;
  remarks: string | null;
  file_url: string | null;
  submittedAt: string | null;
}

export interface SubmissionsByHomeworkResponse {
  status: boolean;
  count: number;
  homework: { id: string; title: string };
  data: StudentSubmission[];
}

/** ---------------- APIs ---------------- */

export const createHomework = async (payload: {
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  title: string;
  description: string;
  submission_date: string;
  attachments: string[];
  is_published: boolean;
  academicYearId: string;
  submission_type?: "physical" | "online" | "both";
  files?: File[];
}) => {
  const formData = new FormData();
  formData.append("class_id", payload.class_id);
  formData.append("section_id", payload.section_id);
  formData.append("subject_id", payload.subject_id);
  formData.append("teacher_id", payload.teacher_id);
  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("submission_date", payload.submission_date);
  formData.append("academicYearId", payload.academicYearId);
  formData.append("is_published", String(payload.is_published));
  if (payload.submission_type) formData.append("submission_type", payload.submission_type);
  // The backend takes the uploaded file(s) themselves under "attachments" (multer field)
  // and returns their storage URLs in the response — it does not accept a JSON URL list.
  if (payload.files && payload.files.length > 0) {
    payload.files.forEach((file) => formData.append("attachments", file));
  }
  const res = await api.post<ApiResponse<Homework>>("/tenant/createhomework", formData);
  return res.data;
};

export const getAllHomework = async (params: {
  class_id?: string;
  subject_id?: string;
  teacher_id?: string;
  is_published?: boolean | string;
}) => {
  const res = await api.get<ApiResponse<Homework[]>>("/tenant/getallhomework", { params });
  return res.data;
};

export const getHomeworkById = async (id: string) => {
  const res = await api.get<ApiResponse<Homework>>(`/tenant/gethomeworkById/${id}`);
  return res.data;
};

export const getHomeworkByClass = async (params: {
  class_id: string;
  section_id?: string;
  subject_id?: string;
  date?: string;
}) => {
  const res = await api.get<ApiResponse<Homework[]>>("/tenant/gethomeworkByClass", {
    params: {
      class_id: params.class_id,
      ...(params.section_id && { section_id: params.section_id }),
      ...(params.subject_id && { subject_id: params.subject_id }),
      ...(params.date       && { date: params.date }),
    },
  });
  return res.data;
};

export const getHomeworkThisWeek = async (params: {
  class_id: string;
  section_id?: string;
}) => {
  const res = await api.get<ApiResponse<Homework[]>>("/tenant/homeworkthisweek", {
    params: {
      class_id: params.class_id,
      ...(params.section_id && { section_id: params.section_id }),
    },
  });
  return res.data;
};

export const updateHomeworkById = async (
  id: string,
  payload: Partial<{
    title: string;
    description: string;
    submission_date: string;
    attachments: string[];
    is_published: boolean;
    class_id: string;
    section_id: string;
    subject_id: string;
    submission_type: "physical" | "online" | "both";
  }>
) => {
  // NOTE: sending this as multipart/form-data (to attach a new file, mirroring
  // createHomework) causes the backend to return a 500 — /tenant/updatehomeworkById
  // does not currently support file uploads. Adding/replacing an attachment on
  // an existing homework isn't possible until the backend adds that support.
  const res = await api.put<ApiResponse<Homework>>(`/tenant/updatehomeworkById/${id}`, payload);
  return res.data;
};

export const publishHomework = async (id: string) => {
  const res = await api.put<ApiResponse<Homework>>(`/tenant/homework/${id}/publish`);
  return res.data;
};

export const deleteHomeworkById = async (id: string) => {
  const res = await api.delete<ApiResponse<null>>(`/tenant/deletehomeworkById/${id}`);
  return res.data;
};

/** ---------------- Homework Submission ---------------- */

export const createHomeworkSubmission = async (payload: {
  homework_id: string;
  student_id: string;
  submission_date: string;
  remarks?: string;
  file?: File | null;
}) => {
  const form = new FormData();
  form.append("homework_id", payload.homework_id);
  form.append("student_id", payload.student_id);
  form.append("submission_date", payload.submission_date);
  if (payload.remarks) form.append("remarks", payload.remarks);
  if (payload.file)    form.append("files", payload.file);

  const res = await api.post<ApiResponse<HomeworkSubmission>>(
    "/tenant/createhomeworksubmission",
    form
  );
  return res.data;
};

export const getHomeworkSubmissionById = async (id: string) => {
  const res = await api.get<ApiResponse<HomeworkSubmission>>(
    `/tenant/gethomeworksubmissionById/${id}`
  );
  return res.data;
};

export const getSubmissionsByStudentId = async (studentId: string) => {
  const res = await api.get<ApiResponse<HomeworkSubmission[]>>(
    `/tenant/getsubmissionsbystudentId/${studentId}`
  );
  return res.data;
};

export const getSubmissionsByHomeworkId = async (homeworkId: string) => {
  const res = await api.get<SubmissionsByHomeworkResponse>(
    `/tenant/getsubmissionsbyhomeworkId/${homeworkId}`
  );
  return res.data;
};