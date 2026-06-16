import api from "@/config/axios";

export interface WorkingDayRecord {
  id: string;
  selected_days: string[];
  start_time: string;
  end_time: string;
  no_of_periods: number;
  duration_of_period: number;
  academicYearId: string;
  createdAt?: string;
  updatedAt?: string;
}

export type WorkingDayPayload = Omit<WorkingDayRecord, "id" | "createdAt" | "updatedAt">;

export const fetchAllWorkingDays = async (): Promise<WorkingDayRecord[]> => {
  try {
    const { data } = await api.get("/tenant/getallschoolworkingdays");
    if (data?.status && Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  } catch {
    return [];
  }
};

export const fetchWorkingDayById = async (id: string): Promise<WorkingDayRecord | null> => {
  try {
    const { data } = await api.get(`/tenant/getschoolworkingdayById/${id}`);
    if (data?.status && data?.data) return data.data;
    return null;
  } catch {
    return null;
  }
};

export const createWorkingDay = async (payload: WorkingDayPayload): Promise<WorkingDayRecord> => {
  try {
    const { data } = await api.post("/tenant/createschoolworkingday", payload);
    if (data?.status && data?.data) return data.data;
    throw new Error(data?.message ?? "Failed to create working day");
  } catch (err: any) {
    throw new Error(err?.response?.data?.message ?? err?.message ?? "Failed to create working day");
  }
};

export const updateWorkingDay = async (id: string, payload: Partial<WorkingDayPayload>): Promise<WorkingDayRecord> => {
  try {
    const { data } = await api.put(`/tenant/updateschoolworkingday/${id}`, payload);
    if (data?.status && data?.data) return data.data;
    throw new Error(data?.message ?? "Failed to update working day");
  } catch (err: any) {
    throw new Error(err?.response?.data?.message ?? err?.message ?? "Failed to update working day");
  }
};

export const deleteWorkingDay = async (id: string): Promise<void> => {
  try {
    const { data } = await api.delete(`/tenant/deleteschoolworkingday/${id}`);
    if (data?.status === false) throw new Error(data?.message ?? "Failed to delete working day");
  } catch (err: any) {
    throw new Error(err?.response?.data?.message ?? err?.message ?? "Failed to delete working day");
  }
};
