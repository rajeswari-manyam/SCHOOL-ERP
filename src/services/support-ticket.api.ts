import api from "@/config/axios";
import { getAuthToken } from "@/store/authStore";

export type SupportTicketPriority = "low" | "medium" | "high" | "urgent";

export interface SupportTicketAttachment {
  key: string;
  url: string;
  name: string;
  size: number;
  type: string;
}

export interface SupportTicketRecord {
  id: string;
  subject: string;
  category: string;
  contactNumber: string;
  priority: SupportTicketPriority;
  description: string;
  attachments: SupportTicketAttachment[];
  status: string;
  schoolId: string;
  createdBy: string;
  assignedTo: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  school?: {
    id: string;
    school_name: string;
    email: string;
    phone: string;
    school_code: string;
  };
  createdByName?: string;
}

export interface SupportTicketPayload {
  subject: string;
  category: string;
  contactNumber: string;
  priority: SupportTicketPriority;
  description: string;
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

const buildTicketFormData = (payload: SupportTicketPayload, schoolId: string): FormData => {
  const form = new FormData();
  form.append("subject", payload.subject);
  form.append("category", payload.category);
  form.append("contactNumber", payload.contactNumber);
  form.append("priority", payload.priority);
  form.append("description", payload.description);
  form.append("schoolId", schoolId);
  if (payload.attachment) form.append("attachments", payload.attachment);
  return form;
};

export const supportTicketApi = {
  createTicket: async (payload: SupportTicketPayload): Promise<SupportTicketRecord> => {
    const schoolId = getSchoolIdFromToken();
    if (!schoolId) throw new Error("Unable to determine school ID");
    try {
      const { data } = await api.post("/tenant/supportticket", buildTicketFormData(payload, schoolId));
      return data?.data ?? data;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to raise support ticket";
      throw new Error(message);
    }
  },

  getAllTickets: async (): Promise<SupportTicketRecord[]> => {
    try {
      // _skipLogoutOn401: if the super-admin's session token isn't accepted by
      // this tenant-scoped route, surface it as a normal query error instead of
      // forcing a global logout — a 401 here is a permission mismatch on this
      // one endpoint, not proof the whole session expired.
      const { data } = await api.get("/tenant/getalltickets", { _skipLogoutOn401: true } as object);
      return Array.isArray(data?.data) ? data.data : [];
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to load support tickets";
      throw new Error(message);
    }
  },

  getTicketsBySchool: async (): Promise<SupportTicketRecord[]> => {
    const schoolId = getSchoolIdFromToken();
    if (!schoolId) return [];
    try {
      const { data } = await api.get(`/tenant/getticketsbyschool/${schoolId}`);
      return Array.isArray(data?.data) ? data.data : [];
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to load support tickets";
      throw new Error(message);
    }
  },

  getTicketById: async (id: string): Promise<SupportTicketRecord> => {
    try {
      const { data } = await api.get(`/tenant/getticketById/${id}`);
      return data?.data ?? data;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to load support ticket";
      throw new Error(message);
    }
  },

  updateTicket: async (id: string, payload: SupportTicketPayload): Promise<SupportTicketRecord> => {
    const schoolId = getSchoolIdFromToken();
    if (!schoolId) throw new Error("Unable to determine school ID");
    try {
      const { data } = await api.put(`/tenant/updatesupportticket/${id}`, buildTicketFormData(payload, schoolId));
      return data?.data ?? data;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to update support ticket";
      throw new Error(message);
    }
  },

  deleteTicket: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tenant/deletesupportticket/${id}`);
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to delete support ticket";
      throw new Error(message);
    }
  },
};
