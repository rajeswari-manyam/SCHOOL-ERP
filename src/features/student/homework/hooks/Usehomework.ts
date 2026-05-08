import { useState } from "react";
import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { homeworkMock, materialsMock } from "../data/homework.mock";
import type { ActiveTab, Homework } from "../types/Homework.types";


// ─── Zustand store for modal/tab UI state ─────────────────────────────────────
interface HomeworkUIState {
  activeTab: ActiveTab;
  submitModalOpen: boolean;
  selectedHomework: Homework | null;
  setActiveTab: (tab: ActiveTab) => void;
  openSubmitModal: (hw: Homework) => void;
  closeSubmitModal: () => void;
}

export const useHomeworkStore = create<HomeworkUIState>((set) => ({
  activeTab: "week",
  submitModalOpen: false,
  selectedHomework: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  openSubmitModal: (hw) => set({ submitModalOpen: true, selectedHomework: hw }),
  closeSubmitModal: () => set({ submitModalOpen: false, selectedHomework: null }),
}));

// ─── TanStack Query fetch ─────────────────────────────────────────────────────
const fetchHomework = async () => {
  await new Promise((r) => setTimeout(r, 200));
  return { homework: homeworkMock, materials: materialsMock };
};

export const useHomework = () => {
  const [homeworkList, setHomeworkList] = useState(homeworkMock);
  const {
    activeTab,
    setActiveTab,
    submitModalOpen,
    selectedHomework,
    openSubmitModal,
    closeSubmitModal,
  } = useHomeworkStore();

  useQuery({
    queryKey: ["homework"],
    queryFn: fetchHomework,
    staleTime: 5 * 60 * 1000,
  });

  const handleSubmit = (id: string) => {
    setHomeworkList((prev) =>
      prev.map((hw) => (hw.id === id ? { ...hw, submitted: true } : hw))
    );
    closeSubmitModal();
    toast.success("Homework submitted successfully!", {
      description: "Your teacher will review it shortly.",
    });
  };

  const thisWeekHomework = homeworkList.filter((hw) => hw.weekDay);

  return {
    activeTab,
    setActiveTab,
    homework: homeworkList,
    thisWeekHomework,
    materials: materialsMock,
    submitModalOpen,
    selectedHomework,
    openSubmitModal,
    closeSubmitModal,
    handleSubmit,
  };
};
