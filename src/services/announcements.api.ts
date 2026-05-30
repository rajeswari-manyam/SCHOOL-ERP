// src/features/announcements/api/announcements.api.ts

import api from "@/config/axios";

/* ================= TYPES ================= */

export interface Announcement {
  id: string;
  organization_id: string;
  user_id: string;
  title: string;
  message: string;
  visible_until: string;
  visibility_scope: {
    type: string; // e.g. "All"
  };
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateAnnouncementPayload {
  title: string;
  message: string;
  visible_until: string;
  visibility_scope: {
    type: string; // "All" | "Class" | etc (based on backend)
  };
}

export interface CreateAnnouncementResponse {
  success: boolean;
  message: string;
  data: Announcement;
}

export interface GetAnnouncementsResponse {
  success: boolean;
  message: string;
  count: number;
  data: Announcement[];
}

/* ================= API CALLS ================= */

// POST /tenant/createannouncements
export const createAnnouncement = async (
  payload: CreateAnnouncementPayload
): Promise<CreateAnnouncementResponse> => {
  const { data } = await api.post<CreateAnnouncementResponse>(
    `/tenant/createannouncements`,
    payload
  );
  return data;
};

// GET /tenant/getAnnouncementsByType
export const getAnnouncementsByType = async (
  type: string
): Promise<GetAnnouncementsResponse> => {
  const { data } = await api.get<GetAnnouncementsResponse>(
    `/tenant/getAnnouncementsByType`,
    {
      params: { type },
    }
  );
  return data;
};