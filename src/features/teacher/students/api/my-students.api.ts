import api from "@/config/axios";
import type { Student } from "../types/my-students.types";

export const myStudentsApi = {
  getStudents: async (): Promise<Student[]> => {
    try {
      const { data } = await api.get<Student[]>("/tenant/teacher/students");
      return data;
    } catch {
      return [];
    }
  },

  getStudent: async (id: string): Promise<Student | null> => {
    try {
      const { data } = await api.get<Student>(`/tenant/teacher/students/${id}`);
      return data;
    } catch {
      return null;
    }
  },

  exportClassList: async (format: "csv" | "pdf"): Promise<void> => {
    try {
      const res = await api.get(`/tenant/teacher/students/export`, { params: { format }, responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `class-list.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("exportClassList failed", { format, response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to export class list";
      throw new Error(message);
    }
  },
};
