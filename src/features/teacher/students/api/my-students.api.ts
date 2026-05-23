import type { Student } from "../types/my-students.types";

// In a real app these would be axios/fetch calls to your backend
export const myStudentsApi = {
  /** Fetch all students for the teacher's class */
  getStudents: async (): Promise<Student[]> => {
    // Placeholder – replace with:
    // const res = await axios.get("/api/teacher/students");
    // return res.data;
    return Promise.resolve([]);
  },

  /** Fetch single student detail (for drawer) */
  getStudent: async (id: string): Promise<Student | null> => {
    // const res = await axios.get(`/api/teacher/students/${id}`);
    // return res.data;
    void id;
    return Promise.resolve(null);
  },

  /** Export class list as CSV/PDF */
  exportClassList: async (format: "csv" | "pdf"): Promise<void> => {
    // await axios.get(`/api/teacher/students/export?format=${format}`, { responseType: "blob" });
    void format;
  },
};
