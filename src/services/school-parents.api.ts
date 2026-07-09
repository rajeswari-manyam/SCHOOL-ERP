import api from "@/config/axios";

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
