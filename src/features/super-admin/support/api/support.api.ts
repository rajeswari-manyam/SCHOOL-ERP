import axios from "@/config/axios";
import type { TicketFilters, TicketsResponse, SupportTicket, TicketFormValues, TicketStats } from "../types/support.types";

export const supportApi = {
  getTickets: async (filters: Partial<TicketFilters>): Promise<TicketsResponse> => {
    const { data } = await axios.get("/super-admin/support/tickets", { params: filters });
    return data;
  },

  getTicket: async (id: string): Promise<SupportTicket> => {
    const { data } = await axios.get(`/super-admin/support/tickets/${id}`);
    return data;
  },

  getStats: async (): Promise<TicketStats> => {
    const { data } = await axios.get("/super-admin/support/stats");
    return data;
  },

  createTicket: async (payload: TicketFormValues): Promise<SupportTicket> => {
    const { data } = await axios.post("/super-admin/support/tickets", payload);
    return data;
  },

  updateStatus: async (id: string, status: string): Promise<SupportTicket> => {
    const { data } = await axios.patch(`/super-admin/support/tickets/${id}/status`, { status });
    return data;
  },

  assignTicket: async (id: string, assignedTo: string): Promise<SupportTicket> => {
    const { data } = await axios.patch(`/super-admin/support/tickets/${id}/assign`, { assignedTo });
    return data;
  },

  resolveTicket: async (id: string): Promise<SupportTicket> => {
    const { data } = await axios.post(`/super-admin/support/tickets/${id}/resolve`);
    return data;
  },

  deleteTicket: async (id: string): Promise<void> => {
    await axios.delete(`/super-admin/support/tickets/${id}`);
  },
};
