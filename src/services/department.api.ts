import api from "@/config/axios";
import type {
  Department,
  CreateDepartmentPayload,
  GetAllDepartmentsResponse,
  DepartmentActionResponse,
} from "@/features/school-admin/settings/types/settings.types";

export interface DepartmentStaff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface DepartmentDetail {
  id: string;
  departmentName: string;
  academicYearId: string;
  academicYear?: { id: string; yearName: string };
  staffs: DepartmentStaff[];
  createdAt: string;
  updatedAt: string;
}

export const getDepartmentById = async (id: string): Promise<DepartmentDetail | null> => {
  try {
    const { data } = await api.get(`/tenant/getdepartmentById/${id}`);
    if (data?.status && data?.data) return data.data as DepartmentDetail;
    return null;
  } catch {
    return null;
  }
};

export const fetchDepartments = async (): Promise<Department[]> => {
  try {
    const { data } = await api.get<GetAllDepartmentsResponse>("/tenant/getalldepartments");
    if (data?.status && Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data as unknown as Department[];
    return [];
  } catch {
    return [];
  }
};

export const createDepartment = async (payload: CreateDepartmentPayload): Promise<Department> => {
  try {
    const { data } = await api.post<DepartmentActionResponse>("/tenant/createdepartments", payload);
    if (data?.status && data?.data) return data.data;
    throw new Error(data?.message ?? "Failed to create department");
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err?.message ?? "Failed to create department";
    throw new Error(message);
  }
};

export const updateDepartment = async (id: string, payload: Partial<CreateDepartmentPayload>): Promise<void> => {
  try {
    const { data } = await api.put<DepartmentActionResponse>(`/tenant/updatedepartmentById/${id}`, payload);
    if (!data?.status) throw new Error(data?.message ?? "Failed to update department");
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err?.message ?? "Failed to update department";
    throw new Error(message);
  }
};

export const deleteDepartment = async (id: string): Promise<void> => {
  try {
    const { data } = await api.delete<DepartmentActionResponse>(`/tenant/deletedepartmentById/${id}`);
    if (!data?.status) throw new Error(data?.message ?? "Failed to delete department");
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err?.message ?? "Failed to delete department";
    throw new Error(message);
  }
};
