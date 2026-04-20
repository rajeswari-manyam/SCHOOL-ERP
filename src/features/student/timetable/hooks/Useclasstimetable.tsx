import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { classTimetableApi } from "../api/Classtimetable.api";

// ─── Query key factory ───────────────────────────────────────────────────────────
export const TIMETABLE_KEYS = {
  all: ["timetable"] as const,
  timetable: () => [...TIMETABLE_KEYS.all, "weekly"] as const,
  examinations: () => [...TIMETABLE_KEYS.all, "examinations"] as const,
};

// ─── Weekly timetable ────────────────────────────────────────────────────────────
export const useClassTimetable = () =>
  useQuery({
    queryKey: TIMETABLE_KEYS.timetable(),
    queryFn: classTimetableApi.getTimetable,
    staleTime: 1000 * 60 * 60, // timetable is stable
  });

// ─── Upcoming examinations ───────────────────────────────────────────────────────
export const useUpcomingExaminations = () =>
  useQuery({
    queryKey: TIMETABLE_KEYS.examinations(),
    queryFn: classTimetableApi.getUpcomingExaminations,
    staleTime: 1000 * 60 * 10,
  });

// ─── Add to calendar ─────────────────────────────────────────────────────────────
export const useAddExamsToCalendar = () => {
  const [isAdding, setIsAdding] = useState(false);

  const addAll = async (examIds: string[]) => {
    setIsAdding(true);
    try {
      await classTimetableApi.addExamsToCalendar(examIds);
    } finally {
      setIsAdding(false);
    }
  };

  return { addAll, isAdding };
};