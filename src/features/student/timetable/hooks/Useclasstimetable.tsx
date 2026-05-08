import { useState } from "react";
import { mockTimetable, mockExaminations } from "../data/classtimetable.mock";
import type {
  ClassTimetable,
  UpcomingExaminations,
} from "../types/Classtimetable.types";

export const useClassTimetable = () => ({
  data: mockTimetable as ClassTimetable,
  isLoading: false,
  isError: false,
});

export const useUpcomingExaminations = () => ({
  data: mockExaminations as UpcomingExaminations,
  isLoading: false,
  isError: false,
});

export const useAddExamsToCalendar = () => {
  const [isAdding, setIsAdding] = useState(false);

  const addAll = async (examIds: string[]) => {
    setIsAdding(true);
    try {
      console.log("Added to calendar:", examIds);
    } finally {
      setIsAdding(false);
    }
  };

  return { addAll, isAdding };
};