import api from "@/config/axios";
import { getAuthToken } from "@/store/authStore";

export interface SchoolAnnouncementAttachment {
  key: string;
  url: string;
  name: string;
  size: number;
  type: string;
}

export interface SchoolAnnouncementRecord {
  id: string;
  title: string;
  message: string;
  category: string;
  publishDate: string;
  audience: string;
  attachments: SchoolAnnouncementAttachment[];
  status: string;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  school?: {
    id: string;
    school_name: string;
    email: string;
    school_code: string;
  };
  createdByName?: string;
}

export interface SchoolAnnouncementPayload {
  title: string;
  message: string;
  category: string;
  publishDate: string;
  audience: string;
  attachment?: File | null;
}

const getSchoolIdFromToken = (): string | null => {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(b64));
    return payload.school_id ?? payload.organization_id ?? null;
  } catch {
    return null;
  }
};

export const schoolAnnouncementApi = {
  createAnnouncement: async (payload: SchoolAnnouncementPayload): Promise<SchoolAnnouncementRecord> => {
    const schoolId = getSchoolIdFromToken();
    if (!schoolId) throw new Error("Unable to determine school ID");
    try {
      const form = new FormData();
      form.append("title", payload.title);
      form.append("message", payload.message);
      form.append("category", payload.category);
      form.append("publishDate", payload.publishDate);
      form.append("audience", payload.audience);
      form.append("schoolId", schoolId);
      if (payload.attachment) form.append("attachments", payload.attachment);
      const { data } = await api.post("/tenant/createannouncement", form);
      return data?.data ?? data;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to create announcement";
      throw new Error(message);
    }
  },

  getAllAnnouncements: async (audience?: string): Promise<SchoolAnnouncementRecord[]> => {
    try {
      const { data } = await api.get("/tenant/getallannouncements", {
        params: audience ? { audience } : undefined,
      });
      return Array.isArray(data?.data) ? data.data : [];
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to load announcements";
      throw new Error(message);
    }
  },

  getAnnouncementById: async (id: string): Promise<SchoolAnnouncementRecord> => {
    try {
      const { data } = await api.get(`/tenant/getannouncementById/${id}`);
      return data?.data ?? data;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to load announcement";
      throw new Error(message);
    }
  },

  updateAnnouncement: async (
    id: string,
    payload: Partial<Pick<SchoolAnnouncementPayload, "title" | "message" | "category" | "publishDate" | "audience">>
  ): Promise<SchoolAnnouncementRecord> => {
    try {
      const { data } = await api.put(`/tenant/updateannouncement/${id}`, payload);
      return data?.data ?? data;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to update announcement";
      throw new Error(message);
    }
  },

  deleteAnnouncement: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tenant/deleteannouncement/${id}`);
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to delete announcement";
      throw new Error(message);
    }
  },
};
