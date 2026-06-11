import { create } from "zustand";
import type { ExamTab } from "../types/exam.types";
import type { ExamTimetableListItem } from "../../../../services/examtimetable.api";
import type { Result } from "../../../../services/results.api";

interface ExamsState {
  tab: ExamTab;
  setTab: (tab: ExamTab) => void;

  // Upcoming exams (from API)
  upcomingExams: ExamTimetableListItem[];

  upcomingLoading: boolean;
  upcomingError: string | null;
  setUpcomingExams: (data: ExamTimetableListItem[]) => void;
  setUpcomingLoading: (v: boolean) => void;
  setUpcomingError: (e: string | null) => void;

  // Results (from API)
  selectedExamType: string;
  setSelectedExamType: (v: string) => void;
  results: Result[];
  resultsLoading: boolean;
  resultsError: string | null;
  setResults: (data: Result[]) => void;
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

  // Default exam_type — user can switch via dropdown
  selectedExamType: "Unit Test 1",
  setSelectedExamType: (v) => set({ selectedExamType: v }),
  results: [],
  resultsLoading: false,
  resultsError: null,
  setResults: (data) => set({ results: data }),
  setResultsLoading: (v) => set({ resultsLoading: v }),
  setResultsError: (e) => set({ resultsError: e }),
}));
