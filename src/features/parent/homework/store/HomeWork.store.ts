import { create } from "zustand";
import type { HomeworkTab } from "../types/homework.types";

interface HomeworkState {
  tab: HomeworkTab;
  day: number | null;
  setTab: (tab: HomeworkTab) => void;
  setDay: (day: number | null) => void;
}

export const useHomeworkStore = create<HomeworkState>((set) => ({
  tab: "week",
  day: 7,
  setTab: (tab) => set({ tab }),
  setDay: (day) => set({ day }),
}));