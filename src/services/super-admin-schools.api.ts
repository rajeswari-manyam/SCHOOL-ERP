import axios from "@/config/axios";
import type { School, SchoolFilters, SchoolsResponse, GetAllSchoolsResponse, SchoolFormValues } from "@/features/super-admin/schools/types/school.types";

export const schoolsApi = {
  getAllSchools: async (search?: string): Promise<GetAllSchoolsResponse> => {
    const { data } = await axios.get("/getallschools", {
      params: search ? { search } : undefined,
    });
    if (Array.isArray(data?.data)) return data;
    if (Array.isArray(data)) return { data, total: data.length };
    throw new Error("Invalid response format from /getallschools");
  },

  getSchools: async (filters: Partial<SchoolFilters>): Promise<SchoolsResponse> => {
    const { data } = await axios.get("/super-admin/schools", { params: filters });
    return data;
  },

  getSchool: async (id: string): Promise<School> => {
    const { data } = await axios.get(`/super-admin/schools/${id}`);
    return data;
  },

  registerOrganization: async (payload: SchoolFormValues): Promise<School> => {
    const { data } = await axios.post("/organization/register", payload);
    return data;
  },

  createSchool: async (payload: SchoolFormValues): Promise<School> => {
    return schoolsApi.registerOrganization(payload);
  },

  updateSchool: async (id: string, payload: Partial<SchoolFormValues>): Promise<School> => {
    const { data } = await axios.patch(`/super-admin/schools/${id}`, payload);
    return data;
  },

  suspendSchool: async (id: string): Promise<void> => {
    await axios.post(`/super-admin/schools/${id}/suspend`);
  },

  reactivateSchool: async (id: string): Promise<void> => {
    await axios.post(`/super-admin/schools/${id}/reactivate`);
  },

  deleteSchool: async (id: string): Promise<void> => {
    await axios.delete(`/super-admin/schools/${id}`);
  },

  importCsv: async (file: File): Promise<{ imported: number; errors: number }> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await axios.post("/super-admin/schools/import", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};
