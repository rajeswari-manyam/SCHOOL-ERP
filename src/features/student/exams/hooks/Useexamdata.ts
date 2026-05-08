import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import {
  examsMock,
  examResultMock,
  reportMock,
  syllabusMock,
  unitTestSyllabusMock,
  deadlinesMock,
} from "../data/exam.mock";

// ─── Zustand store for tab UI state ──────────────────────────────────────────
type ExamTab = "upcoming" | "results" | "report" | "syllabus";

interface ExamUIState {
  activeTab: ExamTab;
  setActiveTab: (tab: ExamTab) => void;
}

export const useExamStore = create<ExamUIState>((set) => ({
  activeTab: "upcoming",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

// ─── TanStack Query fetch ─────────────────────────────────────────────────────
const fetchExamData = async () => {
  await new Promise((r) => setTimeout(r, 250));
  return {
    exams: examsMock,
    examResult: examResultMock,
    report: reportMock,
    syllabus: syllabusMock,
    unitTestSyllabus: unitTestSyllabusMock,
    deadlines: deadlinesMock,
  };
};

export const useExamData = () => {
  const { activeTab, setActiveTab } = useExamStore();

  const { data } = useQuery({
    queryKey: ["exams"],
    queryFn: fetchExamData,
    staleTime: 5 * 60 * 1000,
  });

  return {
    activeTab,
    setActiveTab,
    exams: data?.exams ?? examsMock,
    examResult: data?.examResult ?? examResultMock,
    report: data?.report ?? reportMock,
    syllabus: data?.syllabus ?? syllabusMock,
    unitTestSyllabus: data?.unitTestSyllabus ?? unitTestSyllabusMock,
    deadlines: data?.deadlines ?? deadlinesMock,
  };
};
