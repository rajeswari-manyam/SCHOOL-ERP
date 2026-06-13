import { create } from "zustand";
import type { HomeworkTab, Homework } from "../types/homework.types";
import type { StudyMaterial } from "../../../../services/studymaterial.api";

interface HomeworkState {
  tab: HomeworkTab;

  // Homeworks tab
  allHomeworks: Homework[];
  allLoading: boolean;
  allError: string | null;
  setAllHomeworks: (data: Homework[]) => void;
  setAllLoading: (v: boolean) => void;
  setAllError: (e: string | null) => void;

  // Study Materials tab
  studyMaterials: StudyMaterial[];
  materialsLoading: boolean;
  materialsError: string | null;
  setStudyMaterials: (data: StudyMaterial[]) => void;
  setMaterialsLoading: (v: boolean) => void;
  setMaterialsError: (e: string | null) => void;

  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  setTab: (tab: HomeworkTab) => void;
}

export const useHomeworkStore = create<HomeworkState>((set) => ({
  tab: "homeworks",

  allHomeworks: [],
  allLoading: false,
  allError: null,
  setAllHomeworks: (data) => set({ allHomeworks: data }),
  setAllLoading: (v) => set({ allLoading: v }),
  setAllError: (e) => set({ allError: e }),

  studyMaterials: [],
  materialsLoading: false,
  materialsError: null,
  setStudyMaterials: (data) => set({ studyMaterials: data }),
  setMaterialsLoading: (v) => set({ materialsLoading: v }),
  setMaterialsError: (e) => set({ materialsError: e }),

  selectedDate: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
  setTab: (tab) => set({ tab }),
}));