import type { ProfileData, StudentProfile } from "../types/profile.types";
import { mockProfileData } from "../store";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const profileApi = {
  getProfile: async (): Promise<ProfileData> => {
    await delay(500);
    return mockProfileData;
  },

  updateProfile: async (updates: Partial<StudentProfile>): Promise<StudentProfile> => {
    await delay(300);
    return { ...mockProfileData.student, ...updates };
  },

  downloadDocument: async (documentId: string): Promise<Blob> => {
    await delay(800);
    return new Blob([`Mock document content for ${documentId}`], { type: "application/pdf" });
  },
};