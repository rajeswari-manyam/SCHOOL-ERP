import axios from "@/config/axios";
import type { School, SchoolFilters, SchoolsResponse, GetAllSchoolsResponse, SchoolFormValues, RawSchoolApiRecord, SchoolDetailRecord, SchoolUpdatePayload } from "@/features/super-admin/schools/types/school.types";
import { mapApiSchoolToSchool } from "@/features/super-admin/schools/utils/school.utils";

const fetchAllSchools = async (): Promise<School[]> => {
  const { data } = await axios.get("/organization/getallschooldetails");
  const rawSchools: RawSchoolApiRecord[] = Array.isArray(data?.schools) ? data.schools : [];
  return rawSchools.map(mapApiSchoolToSchool);
};

const buildRegisterFormData = (payload: SchoolFormValues): FormData => {
  const form = new FormData();
  form.append("school_name", payload.school_name);
  form.append("email", payload.email);
  form.append("phone", payload.phone);
  form.append("schoolNumber", payload.schoolNumber);
  form.append("city", payload.city);
  form.append("state", payload.state);
  form.append("pincode", payload.pincode);
  form.append("board", payload.board);
  form.append("address", payload.address);
  form.append("whatsappNumber", payload.whatsappNumber);
  form.append("school_code", payload.school_code);
  form.append("PrincipalName", payload.PrincipalName);
  form.append("subscriptionId", payload.subscriptionId);
  if (payload.website) form.append("website", payload.website);
  if (payload.establishedYear) form.append("establishedYear", payload.establishedYear);
  if (payload.totalSchoolstrength) form.append("totalSchoolstrength", payload.totalSchoolstrength);
  if (payload.image) form.append("image", payload.image);
  if (payload.logo) form.append("logo", payload.logo);
  if (payload.principalPhoto) form.append("principalphoto", payload.principalPhoto);
  return form;
};

export const schoolsApi = {
  getAllSchools: async (search?: string): Promise<GetAllSchoolsResponse> => {
    const all = await fetchAllSchools();
    const filtered = search
      ? all.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase()))
      : all;
    return { data: filtered, total: filtered.length };
  },

  getSchools: async (filters: Partial<SchoolFilters>): Promise<SchoolsResponse> => {
    const all = await fetchAllSchools();
    const search = (filters.search ?? "").toLowerCase().trim();
    const filtered = all.filter((s) => {
      const matchesSearch = !search || s.name.toLowerCase().includes(search) || s.city.toLowerCase().includes(search);
      const matchesPlan = !filters.plan || filters.plan === "ALL" || s.plan === filters.plan;
      const matchesStatus = !filters.status || filters.status === "ALL" || s.status === filters.status;
      const matchesCity = !filters.city || s.city === filters.city;
      return matchesSearch && matchesPlan && matchesStatus && matchesCity;
    });

    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 8;
    const start = (page - 1) * pageSize;

    return {
      data: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    };
  },

  getSchoolDetail: async (id: string): Promise<SchoolDetailRecord> => {
    const { data } = await axios.get(`/organization/getschooldetails/${id}`);
    return data?.school ?? data?.data ?? data;
  },

  getSchool: async (id: string): Promise<School> => {
    const raw = await schoolsApi.getSchoolDetail(id);
    return mapApiSchoolToSchool(raw);
  },

  registerOrganization: async (payload: SchoolFormValues): Promise<School> => {
    try {
      const { data } = await axios.post("/organization/register", buildRegisterFormData(payload));
      const raw: RawSchoolApiRecord | undefined = data?.school ?? data?.data;
      return raw ? mapApiSchoolToSchool(raw) : mapApiSchoolToSchool(data);
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to register school";
      throw new Error(message);
    }
  },

  createSchool: async (payload: SchoolFormValues): Promise<School> => {
    return schoolsApi.registerOrganization(payload);
  },

  updateSchool: async (id: string, payload: SchoolUpdatePayload): Promise<School> => {
    try {
      const { data } = await axios.put(`/organization/updateSchool/${id}`, payload);
      const raw: RawSchoolApiRecord | undefined = data?.school ?? data?.data;
      return mapApiSchoolToSchool(raw ?? data);
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to update school";
      throw new Error(message);
    }
  },

  suspendSchool: async (id: string): Promise<void> => {
    await axios.post(`/super-admin/schools/${id}/suspend`);
  },

  reactivateSchool: async (id: string): Promise<void> => {
    await axios.post(`/super-admin/schools/${id}/reactivate`);
  },

  deleteSchool: async (id: string): Promise<void> => {
    try {
      await axios.delete(`/organization/deleteSchool/${id}`);
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to delete school";
      throw new Error(message);
    }
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
