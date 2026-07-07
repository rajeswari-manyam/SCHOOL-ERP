import { create } from "zustand";
import type { ExamTab } from "../types/exam.types";
import type { UpcomingExamItem } from "../../../../services/examtimetable.api";
import type { Mark } from "../../../../services/marks.api";

interface ExamsState {
  tab: ExamTab;
  setTab: (tab: ExamTab) => void;

  // Upcoming exams (from API)
  upcomingExams: UpcomingExamItem[];

  upcomingLoading: boolean;
  upcomingError: string | null;
  setUpcomingExams: (data: UpcomingExamItem[]) => void;
  setUpcomingLoading: (v: boolean) => void;
  setUpcomingError: (e: string | null) => void;

  // Results (from marks API)
  results: Mark[];
  resultsLoading: boolean;
  resultsError: string | null;
  setResults: (data: Mark[]) => void;
  setResultsLoading: (v: boolean) => void;
  setResultsError: (e: string | null) => void;
}

export const useExamsStore = create<ExamsState>((set) => ({
  tab: "upcoming",
  setTab: (tab) => set({ tab }),

  upcomingExams: [],
  upcomingLoading: false,
  upcomingError: null,
  setUpcomingExams: (data) => set({ upcomingExams: data }),
  setUpcomingLoading: (v) => set({ upcomingLoading: v }),
  setUpcomingError: (e) => set({ upcomingError: e }),

  results: [],
  resultsLoading: false,
  resultsError: null,
  setResults: (data) => set({ results: data }),
  setResultsLoading: (v) => set({ resultsLoading: v }),
  setResultsError: (e) => set({ resultsError: e }),
}));
