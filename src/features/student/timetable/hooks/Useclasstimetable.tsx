import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { mockTimetable, mockExaminations } from "../data/classtimetable.mock";
import type {
  ClassTimetable,
  UpcomingExaminations,
} from "../types/Classtimetable.types";

// ─── Zustand store for calendar state ─────────────────────────────────────────
interface TimetableUIState {
  addedExamIds: string[];
  addExam: (id: string) => void;
  addAllExams: (ids: string[]) => void;
}

export const useTimetableStore = create<TimetableUIState>((set) => ({
  addedExamIds: [],
  addExam: (id) =>
    set((s) => ({
      addedExamIds: s.addedExamIds.includes(id)
        ? s.addedExamIds
        : [...s.addedExamIds, id],
    })),
  addAllExams: (ids) =>
    set((s) => ({
      addedExamIds: [...new Set([...s.addedExamIds, ...ids])],
    })),
}));

// ─── TanStack Query hooks ─────────────────────────────────────────────────────
const fetchTimetable = async (): Promise<ClassTimetable> => {
  await new Promise((r) => setTimeout(r, 300));
  return mockTimetable;
};

const fetchExaminations = async (): Promise<UpcomingExaminations> => {
  await new Promise((r) => setTimeout(r, 200));
  return mockExaminations;
};

export const useClassTimetable = () =>
  useQuery({
    queryKey: ["timetable"],
    queryFn: fetchTimetable,
    staleTime: 10 * 60 * 1000,
  });

export const useUpcomingExaminations = () =>
  useQuery({
    queryKey: ["examinations"],
    queryFn: fetchExaminations,
    staleTime: 10 * 60 * 1000,
  });

export const useAddExamsToCalendar = () => {
  const { addAllExams } = useTimetableStore();

  const addAll = async (examIds: string[]) => {
    await new Promise((r) => setTimeout(r, 400));
    addAllExams(examIds);
    toast.success("Exams added to calendar!", {
      description: `${examIds.length} exam(s) saved to your schedule.`,
    });
  };

  return { addAll };
};
