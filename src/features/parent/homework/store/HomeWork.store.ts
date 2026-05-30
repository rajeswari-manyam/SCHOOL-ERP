import { create } from "zustand";
import type { HomeworkTab, Homework } from "../types/homework.types";
import type { StudyMaterial } from "../../../../services/studymaterial.api";

interface HomeworkState {
  tab: HomeworkTab;
  day: number | null;
  setTab: (tab: HomeworkTab) => void;
  setDay: (day: number | null) => void;

  // All Homework tab
  allHomeworks: Homework[];
  allLoading: boolean;
  allError: string | null;
  setAllHomeworks: (data: Homework[]) => void;
  setAllLoading: (v: boolean) => void;
  setAllError: (e: string | null) => void;

  // This Week tab
  weekHomeworks: Homework[];
  weekLoading: boolean;
  weekError: string | null;
  setWeekHomeworks: (data: Homework[]) => void;
  setWeekLoading: (v: boolean) => void;
  setWeekError: (e: string | null) => void;

  // Study Materials tab
  studyMaterials: StudyMaterial[];
  materialsLoading: boolean;
  materialsError: string | null;
  setStudyMaterials: (data: StudyMaterial[]) => void;
  setMaterialsLoading: (v: boolean) => void;
  setMaterialsError: (e: string | null) => void;
}

export const useHomeworkStore = create<HomeworkState>((set) => ({
  tab: "week",
  day: new Date().getDate(),
  setTab: (tab) => set({ tab }),
  setDay: (day) => set({ day }),

  allHomeworks: [],
  allLoading: false,
  allError: null,
  setAllHomeworks: (data) => set({ allHomeworks: data }),
  setAllLoading: (v) => set({ allLoading: v }),
  setAllError: (e) => set({ allError: e }),

  weekHomeworks: [],
  weekLoading: false,
  weekError: null,
  setWeekHomeworks: (data) => set({ weekHomeworks: data }),
  setWeekLoading: (v) => set({ weekLoading: v }),
  setWeekError: (e) => set({ weekError: e }),

  studyMaterials: [],
  materialsLoading: false,
  materialsError: null,
  setStudyMaterials: (data) => set({ studyMaterials: data }),
  setMaterialsLoading: (v) => set({ materialsLoading: v }),
  setMaterialsError: (e) => set({ materialsError: e }),
}));
