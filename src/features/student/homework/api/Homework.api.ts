import {
  mockHomeworkResponse,
  mockStudyMaterialsResponse,
} from "../store/Mockdata";
import type {
  HomeworkResponse,
  StudyMaterialsResponse,
 
  SubmitResult,
  Assignment,
} from "../types/Homework.types";

// Simulated network delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const homeworkApi = {
  /** Full homework page payload — week view + assignment list */
  getHomework: async (): Promise<HomeworkResponse> => {
    await delay(500);
    return mockHomeworkResponse;
  },

  /** All assignments (optionally filtered by status) */
  getAllAssignments: async (status?: string): Promise<Assignment[]> => {
    await delay(400);
    const all = mockHomeworkResponse.assignments;
    if (!status) return all;
    return all.filter((a) => a.status === status);
  },

  /** Study materials for the class */
  getStudyMaterials: async (query?: string): Promise<StudyMaterialsResponse> => {
    await delay(400);
    if (!query) return mockStudyMaterialsResponse;
    const filtered = mockStudyMaterialsResponse.materials.filter((m) =>
      m.title.toLowerCase().includes(query.toLowerCase())
    );
    return { materials: filtered, total: filtered.length };
  },

  /** Submit an assignment (file upload or text response) */
  submitAssignment: async (): Promise<SubmitResult> => {
    await delay(1200);
    return {
      success: true,
      submittedAt: new Date().toISOString(),
      message: "Assignment submitted successfully. Your teacher will be notified.",
    };
  },

  /** Download a study material as blob */
  downloadMaterial: async (materialId: string): Promise<Blob> => {
    await delay(800);
    return new Blob([`Study material ${materialId}`], { type: "application/octet-stream" });
  },
};