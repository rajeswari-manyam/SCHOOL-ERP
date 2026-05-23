import { create } from "zustand";
import type { ExamTab } from "../types/exam.types";

interface ExamsState {
  tab: ExamTab;
  selectedResultId: string;
  setTab: (tab: ExamTab) => void;
  setSelectedResultId: (id: string) => void;
}

export const useExamsStore = create<ExamsState>((set) => ({
  tab: "upcoming",
  selectedResultId: "ut1-jan-2025",
  setTab: (tab) => set({ tab }),
  setSelectedResultId: (id) => set({ selectedResultId: id }),
}));