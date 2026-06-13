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
}) => {
  const res = await api.post<ApiResponse<Homework>>("/tenant/createhomework", payload);
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
  }>
) => {
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