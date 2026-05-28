import api from "@/config/axios";
import type {
  ExamSelector,
  StudentMarkEntry,
  SubmittedExam,
  PublishedResult,
} from "../types/exam-marks.types";

export const examMarksApi = {
  loadStudents: async (selector: ExamSelector): Promise<StudentMarkEntry[]> => {
    try {
      const { data } = await api.get<StudentMarkEntry[]>("/tenant/teacher/exams/students", { params: selector });
      return data;
    } catch {
      return [];
    }
  },

  saveDraft: async (selector: ExamSelector, entries: StudentMarkEntry[]): Promise<void> => {
    try {
      await api.post("/tenant/teacher/exams/draft", { selector, entries });
    } catch (err: any) {
      console.error("saveDraft failed", { url: "/tenant/teacher/exams/draft", selector, response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to save draft";
      throw new Error(message);
    }
  },

  submitMarks: async (selector: ExamSelector, entries: StudentMarkEntry[]): Promise<void> => {
    try {
      await api.post("/tenant/teacher/exams/submit", { selector, entries });
    } catch (err: any) {
      console.error("submitMarks failed", { url: "/tenant/teacher/exams/submit", selector, response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to submit marks";
      throw new Error(message);
    }
  },

  getSubmittedExams: async (): Promise<SubmittedExam[]> => {
    try {
      const { data } = await api.get<SubmittedExam[]>("/tenant/teacher/exams/submitted");
      return data;
    } catch {
      return [];
    }
  },

  getPublishedResults: async (): Promise<PublishedResult[]> => {
    try {
      const { data } = await api.get<PublishedResult[]>("/tenant/teacher/exams/published");
      return data;
    } catch {
      return [];
    }
  },

  downloadReport: async (resultId: string): Promise<void> => {
    try {
      const res = await api.get(`/tenant/teacher/exams/published/${resultId}/pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `result-${resultId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("downloadReport failed", { resultId, response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to download report";
      throw new Error(message);
    }
  },
};
