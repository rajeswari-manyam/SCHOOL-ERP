import api from "@/config/axios";

export interface LeaveAllocation {
  id: string;
  leave_type: string;
  allocated_days: number;
  academicYearId: string;
  school_code: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeaveAllocationPayload {
  academicYearId: string;
  school_code: string;
  allocations: { leave_type: string; allocated_days: number }[];
}

export interface StaffLeaveSummary {
  id: string;
  leave_type: string;
  allocated: number;
  used: number;
  balance: number;
}

export const createLeaveAllocation = async (
  payload: CreateLeaveAllocationPayload
): Promise<{ status: boolean; data: LeaveAllocation[] }> => {
  const { data } = await api.post("/tenant/createleaveallocation", payload);
  return data;
};

export const getAllLeaveAllocations = async (): Promise<LeaveAllocation[]> => {
  try {
    const { data } = await api.get("/tenant/getallleaveallocations");
    if (data?.status && Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data as LeaveAllocation[];
    return [];
  } catch {
    return [];
  }
};

export const getLeaveAllocationById = async (id: string): Promise<LeaveAllocation | null> => {
  try {
    const { data } = await api.get(`/tenant/getleaveallocationById/${id}`);
    if (data?.status && data?.data) return data.data as LeaveAllocation;
    return null;
  } catch {
    return null;
  }
};

export const updateLeaveAllocation = async (
  id: string,
  payload: { leave_type?: string; allocated_days?: number }
): Promise<void> => {
  await api.put(`/tenant/updateleaveallocation/${id}`, payload);
};

export const deleteLeaveAllocation = async (id: string): Promise<void> => {
  await api.delete(`/tenant/deleteleaveallocation/${id}`);
};

export const getLeaveBalance = async (params: {
  staff_id: string;
  academic_year: string;
}): Promise<StaffLeaveSummary[]> => {
  try {
    const { data } = await api.get("/tenant/leavebalance", { params });
    if (data?.status && Array.isArray(data?.balance_list)) return data.balance_list;
    return [];
  } catch {
    return [];
  }
};
