import axios from "@/config/axios";
import type { TeacherDashboardData } from "../types/teacher-dashboard.types";

export const teacherDashboardApi = {
  getDashboard: async (): Promise<TeacherDashboardData> => {
    const { data } = await axios.get("/teacher/dashboard");
    return data;
  },

  markAttendanceViaWeb: async (payload: {
    classId: string;
    date: string;
    records: { studentId: string; status: "PRESENT" | "ABSENT" | "HALF_DAY" }[];
  }): Promise<void> => {
    await axios.post("/teacher/attendance/mark", payload);
  },

  markAttendanceViaWA: async (): Promise<{ sent: boolean }> => {
    const { data } = await axios.post("/teacher/attendance/mark-via-wa");
    return data;
  },

  assignHomework: async (payload: {
    classId: string;
    subject: string;
    title: string;
    description: string;
    dueDate: string;
  }): Promise<void> => {
    await axios.post("/teacher/homework", payload);
  },

  uploadMaterial: async (formData: FormData): Promise<void> => {
    await axios.post("/teacher/materials", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  applyLeave: async (payload: {
    fromDate: string;
    toDate: string;
    reason: string;
    type: string;
  }): Promise<void> => {
    await axios.post("/teacher/leave/apply", payload);
  },
};
