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

/**
 * Get Homework By Class + Section
 *
 * API: GET /tenant/gethomeworkByClass?className=9&section=A
 *
 * Accepts a combined string like "10A" or "9B" and splits it automatically.
 * e.g. "10A" → className=10&section=A
 *      "9"   → className=9  (no section param)
 */
export const getHomeworkByClass = async (rawClass: string) => {
  // Split "10A" → { className: "10", section: "A" }
  const match = (rawClass ?? "").trim().match(/^(\d+)([A-Za-z]*)$/);
  const className = match ? match[1] : rawClass.trim();
  const section   = match ? match[2] : "";

  const params: Record<string, string> = { className };
  if (section) params.section = section;

  const res = await api.get<ApiResponse<Homework[]>>(
    "/tenant/gethomeworkByClass",
    { params }
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