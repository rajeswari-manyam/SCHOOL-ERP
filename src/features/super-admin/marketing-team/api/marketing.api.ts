import axios from "@/config/axios";
import type {
  RepFilters, RepsResponse, MarketingRep,
  RepFormValues, MarketingStats, AttendanceRecord,
} from "../types/marketing.types";

export const marketingApi = {
  getReps: async (filters: Partial<RepFilters>): Promise<RepsResponse> => {
    const { data } = await axios.get("/super-admin/marketing-team/reps", { params: filters });
    return data;
  },

  getRep: async (id: string): Promise<MarketingRep> => {
    const { data } = await axios.get(`/super-admin/marketing-team/reps/${id}`);
    return data;
  },

  getStats: async (): Promise<MarketingStats> => {
    const { data } = await axios.get("/super-admin/marketing-team/stats");
    return data;
  },

  getAttendance: async (month: number, year: number): Promise<AttendanceRecord[]> => {
    const { data } = await axios.get("/super-admin/marketing-team/attendance", { params: { month, year } });
    return data;
  },

  markAttendance: async (repId: string, date: string, status: string): Promise<void> => {
    await axios.post("/super-admin/marketing-team/attendance", { repId, date, status });
  },

  createRep: async (payload: RepFormValues): Promise<MarketingRep> => {
    const { data } = await axios.post("/super-admin/marketing-team/reps", payload);
    return data;
  },

  updateRep: async (id: string, payload: Partial<RepFormValues>): Promise<MarketingRep> => {
    const { data } = await axios.patch(`/super-admin/marketing-team/reps/${id}`, payload);
    return data;
  },

  deleteRep: async (id: string): Promise<void> => {
    await axios.delete(`/super-admin/marketing-team/reps/${id}`);
  },

  approvePayout: async (repId: string): Promise<void> => {
    await axios.post(`/super-admin/marketing-team/payouts/${repId}/approve`);
  },

  approveAllPayouts: async (): Promise<void> => {
    await axios.post("/super-admin/marketing-team/payouts/approve-all");
  },

  exportReport: async (): Promise<Blob> => {
    const { data } = await axios.get("/super-admin/marketing-team/export", { responseType: "blob" });
    return data;
  },
};
