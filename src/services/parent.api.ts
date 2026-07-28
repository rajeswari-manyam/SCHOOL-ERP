import api from "@/config/axios";

/* ================= TYPES ================= */

export interface Parent {
  id: string;
  father_name: string;
  mother_name: string;
  father_occupation: string;
  mother_occupation: string;
  father_email: string;
  mother_email: string;
  father_phone: string;
  mother_phone: string;
  father_image: string;
  mother_image: string;
  address: string;
  school_id: string;
  students: { id: string; first_name: string; last_name: string | null }[];
  status: string;
  createdAt: string;
  updatedAt: string;
}



/* ================= API ================= */

export const getAllParents = async (params?: { status?: string; school_id?: string; relation?: string }): Promise<Parent[]> => {
  const { data } = await api.get("/tenant/getallparents", { params });
  return data.data ?? [];
};

export const getParentById = async (parentId: string): Promise<Parent> => {
  const { data } = await api.get(`/tenant/getparentById/${parentId}`);
  return data.data;
};

export interface ParentChild {
  id: string;
  name: string;
}

export interface GetParentChildrenResponse {
  status: boolean;
  data: ParentChild[];
}

export const getParentChildren = async (
  parentId: string,
  schoolCode: string
): Promise<GetParentChildrenResponse> => {
  const { data } = await api.get<GetParentChildrenResponse>(
    `/tenant/parent/${parentId}/students`,
    { params: { school_code: schoolCode } }
  );
  return data;
};

/* ===== Merged from school-parents.api.ts ===== */

export interface CreateParentPayload {
  father_name?: string;
  father_occupation?: string;
  father_email?: string;
  father_phone?: string;
  mother_name?: string;
  mother_occupation?: string;
  mother_email?: string;
  mother_phone?: string;
  students: string[];
  address: string;
  /** Not required by the backend (it's derived from the auth token) — omit rather than send a mismatched value. */
  school_id?: string;
  father_image?: File | null;
  mother_image?: File | null;
}

export const parentsApi = {
  createParent: async (payload: CreateParentPayload) => {
    const body = Object.entries(payload).reduce((fd, [key, value]) => {
      if (value === undefined || value === null || value === "") return fd;
      if (Array.isArray(value)) {
        value.forEach((v) => fd.append(key, String(v)));
      } else {
        fd.append(key, value instanceof File ? value : String(value));
      }
      return fd;
    }, new FormData());

    try {
      const { data } = await api.post("/tenant/createparents", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        (Array.isArray(err?.response?.data?.errors) ? err.response.data.errors.map((e: any) => e.message ?? e).join(", ") : undefined) ??
        err?.message ??
        "Failed to create parent";
      throw new Error(message);
    }
  },
};
