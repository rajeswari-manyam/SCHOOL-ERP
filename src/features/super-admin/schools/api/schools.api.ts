import axios from "@/config/axios";
import type { School, SchoolFilters, SchoolsResponse, SchoolFormValues } from "../types/school.types";

export const schoolsApi = {
  getSchools: async (filters: Partial<SchoolFilters>): Promise<SchoolsResponse> => {
    const { data } = await axios.get("/super-admin/schools", { params: filters });
    return data;
  },

  getSchool: async (id: string): Promise<School> => {
    const { data } = await axios.get(`/super-admin/schools/${id}`);
    return data;
  },

  createSchool: async (payload: SchoolFormValues): Promise<School> => {
    const { data } = await axios.post("/super-admin/schools", payload);
    return data;
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