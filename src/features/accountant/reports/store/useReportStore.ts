import { create } from "zustand";

interface ReportsStore {
  academicYear: string;
  setAcademicYear: (year: string) => void;
}

export const useReportsStore = create<ReportsStore>((set) => ({
  academicYear: "2024-25",
  setAcademicYear: (year) => set({ academicYear: year }),
}));