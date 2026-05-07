import { useState } from "react";
import { homeworkMock, materialsMock } from "../data/homework.mock";
import type { ActiveTab, Homework } from "../types/homework.types";

export const useHomework = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("week");
  const [homework, setHomework] = useState(homeworkMock);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);

  const openSubmitModal = (hw: Homework) => {
    setSelectedHomework(hw);
    setSubmitModalOpen(true);
  };

  const closeSubmitModal = () => {
    setSubmitModalOpen(false);
    setSelectedHomework(null);
  };

  const handleSubmit = (id: string) => {
    setHomework((prev) =>
      prev.map((hw) => (hw.id === id ? { ...hw, submitted: true } : hw))
    );
    closeSubmitModal();
  };

  // This week = only Mon-Fri assignments (first 3 shown in daily view)
  const thisWeekHomework = homework.filter((hw) => hw.weekDay);

  return {
    activeTab,
    setActiveTab,
    homework,
    thisWeekHomework,
    materials: materialsMock,
    submitModalOpen,
    selectedHomework,
    openSubmitModal,
    closeSubmitModal,
    handleSubmit,
  };
};