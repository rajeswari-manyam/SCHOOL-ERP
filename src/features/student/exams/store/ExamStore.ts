import { create } from "zustand";
import type { TabId, ChecklistItem } from "../types/Exam.types";

interface ExamStore {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  checklist: ChecklistItem[];
  setChecklist: (items: ChecklistItem[]) => void;
  toggleChecklistItem: (id: string) => void;
  selectedExamId: string;
  setSelectedExamId: (id: string) => void;
}

export const useExamStore = create<ExamStore>((set) => ({
  activeTab: "upcoming",
  setActiveTab: (tab) => set({ activeTab: tab }),
  checklist: [],
  setChecklist: (items) => set({ checklist: items }),
  toggleChecklistItem: (id) =>
    set((state) => ({
      checklist: state.checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    })),
  selectedExamId: "ut1-jan-2025",
  setSelectedExamId: (id) => set({ selectedExamId: id }),
}));