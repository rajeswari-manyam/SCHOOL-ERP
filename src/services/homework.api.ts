import api from "@/config/axios";

/** ---------------- Types ---------------- */

export interface Homework {
  id: string;
  class_id: string | null;
  className: string;
  sectionName: string;
  subject_id: string | null;
  subjectName: string;
  teacher_id: string;
  title: string;
  description: string;
  submission_date: string;
  attachments: string[];
  is_published: boolean;
  school_code: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  count?: number;
  data: T;
}

/** ---------------- APIs ---------------- */

/** Create Homework */
export const createHomework = async (payload: {
  className: string;
  sectionName: string;
  subjectName: string;
  teacher_id: string;
  title: string;
  description: string;
  submission_date: string;
  attachments: string[];
  is_published: boolean;
  school_code: string;
}) => {
  const res = await api.post<ApiResponse<Homework>>(
    "/tenant/createhomework",
    payload
  );
  return res.data;
};

/** Get All Homework */
export const getAllHomework = async (params: {
  teacher_id?: string;
  is_published?: boolean | string;
}) => {
  const res = await api.get<ApiResponse<Homework[]>>(
    "/tenant/getAllhomework",
    { params }
  );
  return res.data;
};

/** Get Homework By ID */
export const getHomeworkById = async (id: string) => {
  const res = await api.get<ApiResponse<Homework>>(
    `/tenant/gethomeworkById/${id}`
  );
  return res.data;
};

/** Get Homework By Class Name (FIXED) */
export const getHomeworkByClass = async (className: string) => {
  const res = await api.get<ApiResponse<Homework[]>>(
    "/tenant/gethomeworkByClass",
    {
      params: { className }   // ✅ correct query param
    }
  );
  return res.data;
};

/** Update Homework */
export const updateHomeworkById = async (
  id: string,
  payload: Partial<{
    title: string;
    description: string;
    submission_date: string;
    attachments: string[];
    is_published: boolean;
  }>
) => {
  const res = await api.put<ApiResponse<Homework>>(
    `/tenant/updatehomeworkById/${id}`,
    payload
  );
  return res.data;
};

/** Publish Homework */
export const publishHomework = async (id: string) => {
  const res = await api.put<ApiResponse<Homework>>(
    `/tenant/homework/${id}/publish`
  );
  return res.data;
};

/** Delete Homework */
export const deleteHomeworkById = async (id: string) => {
  const res = await api.delete<ApiResponse<null>>(
    `/tenant/deletehomeworkById/${id}`
  );
  return res.data;
};