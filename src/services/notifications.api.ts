// src/services/notifications.api.ts

import api from "@/config/axios";

/* ================= TYPES ================= */

export interface AppNotification {
  id: string;
  receiver_id: string;
  receiver_type: "PARENT" | "STUDENT" | string;
  title: string;
  message: string;
  type: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | string;
  reference_type: string | null;
  reference_id: string | null;
  school_id: string | null;
  is_read: boolean;
  read_at: string | null;
  created_by: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllNotificationsResponse {
  status: boolean;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: AppNotification[];
}

/* ================= API CALLS ================= */

// GET /tenant/getallnotifications
export const getAllNotifications = async (params?: {
  page?: number;
  limit?: number;
}): Promise<GetAllNotificationsResponse> => {
  const { data } = await api.get<GetAllNotificationsResponse>(
    `/tenant/getallnotifications`,
    { params }
  );
  return data;
};
