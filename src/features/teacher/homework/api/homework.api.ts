import api from "@/config/axios";
import type { HomeworkItem, StudyMaterial, AssignHomeworkFormValues, UploadMaterialFormValues } from "../types/homework.types";

export const homeworkApi = {
  getHomework: async (): Promise<HomeworkItem[]> => {
    try {
      const { data } = await api.get<HomeworkItem[]>("/tenant/teacher/homework");
      return data;
    } catch {
      return [];
    }
  },

  assignHomework: async (data: AssignHomeworkFormValues): Promise<HomeworkItem> => {
    try {
      const payload = data.attachment?.length
        ? (() => { const fd = new FormData(); Object.entries(data).forEach(([k, v]) => { if (k !== "attachment") fd.append(k, String(v)); }); Array.from(data.attachment!).forEach(f => fd.append("attachment", f)); return fd; })()
        : data;
      const config = payload instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
      const { data: res } = await api.post<HomeworkItem>("/tenant/teacher/homework", payload, config);
      return res;
    } catch (err: any) {
      console.error("assignHomework failed", { url: "/tenant/teacher/homework", response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to assign homework";
      throw new Error(message);
    }
  },

  updateHomework: async (id: string, data: Partial<AssignHomeworkFormValues>): Promise<HomeworkItem> => {
    try {
      const { data: res } = await api.put<HomeworkItem>(`/tenant/teacher/homework/${id}`, data);
      return res;
    } catch (err: any) {
      console.error("updateHomework failed", { url: `/tenant/teacher/homework/${id}`, response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to update homework";
      throw new Error(message);
    }
  },

  deleteHomework: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tenant/teacher/homework/${id}`);
    } catch (err: any) {
      console.error("deleteHomework failed", { url: `/tenant/teacher/homework/${id}`, response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to delete homework";
      throw new Error(message);
    }
  },

  sendReminder: async (id: string): Promise<void> => {
    try {
      await api.post(`/tenant/teacher/homework/${id}/remind`);
    } catch (err: any) {
      console.error("sendReminder failed", { url: `/tenant/teacher/homework/${id}/remind`, response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to send reminder";
      throw new Error(message);
    }
  },

  getMaterials: async (): Promise<StudyMaterial[]> => {
    try {
      const { data } = await api.get<StudyMaterial[]>("/tenant/teacher/materials");
      return data;
    } catch {
      return [];
    }
  },

  uploadMaterial: async (data: UploadMaterialFormValues): Promise<StudyMaterial> => {
    try {
      const payload = data.file?.length
        ? (() => { const fd = new FormData(); Object.entries(data).forEach(([k, v]) => { if (k !== "file") fd.append(k, String(v)); }); Array.from(data.file!).forEach(f => fd.append("file", f)); return fd; })()
        : data;
      const config = payload instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
      const { data: res } = await api.post<StudyMaterial>("/tenant/teacher/materials", payload, config);
      return res;
    } catch (err: any) {
      console.error("uploadMaterial failed", { url: "/tenant/teacher/materials", response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to upload material";
      throw new Error(message);
    }
  },

  deleteMaterial: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tenant/teacher/materials/${id}`);
    } catch (err: any) {
      console.error("deleteMaterial failed", { url: `/tenant/teacher/materials/${id}`, response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to delete material";
      throw new Error(message);
    }
  },
};
