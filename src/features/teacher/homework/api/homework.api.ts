import type { HomeworkItem, StudyMaterial, AssignHomeworkFormValues, UploadMaterialFormValues } from "../types/homework.types";

export const homeworkApi = {
  getHomework: async (): Promise<HomeworkItem[]> => {
    // const res = await axios.get("/api/teacher/homework");
    // return res.data;
    return Promise.resolve([]);
  },

  assignHomework: async (data: AssignHomeworkFormValues): Promise<HomeworkItem> => {
    // const fd = new FormData(); ...
    // const res = await axios.post("/api/teacher/homework", fd);
    // return res.data;
    void data;
    return Promise.resolve({} as HomeworkItem);
  },

  updateHomework: async (id: string, data: Partial<AssignHomeworkFormValues>): Promise<HomeworkItem> => {
    // const res = await axios.patch(`/api/teacher/homework/${id}`, data);
    // return res.data;
    void id; void data;
    return Promise.resolve({} as HomeworkItem);
  },

  deleteHomework: async (id: string): Promise<void> => {
    // await axios.delete(`/api/teacher/homework/${id}`);
    void id;
  },

  sendReminder: async (id: string): Promise<void> => {
    // await axios.post(`/api/teacher/homework/${id}/remind`);
    void id;
  },

  getMaterials: async (): Promise<StudyMaterial[]> => {
    return Promise.resolve([]);
  },

  uploadMaterial: async (data: UploadMaterialFormValues): Promise<StudyMaterial> => {
    void data;
    return Promise.resolve({} as StudyMaterial);
  },

  deleteMaterial: async (id: string): Promise<void> => {
    void id;
  },
};
