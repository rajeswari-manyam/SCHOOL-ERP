import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { timetableApi } from "../api/timetable.api";
import type { EditPeriodPayload, AddExamPayload } from "../types/timetable.types";

export const TIMETABLE_KEYS = {
  all: ["school-admin", "timetable"] as const,
  detail: (classId: string) =>
    [...TIMETABLE_KEYS.all, "detail", classId] as const,
  exams: (classId: string) =>
    [...TIMETABLE_KEYS.all, "exams", classId] as const,
  teachers: () => [...TIMETABLE_KEYS.all, "teachers"] as const,
  subjects: () => [...TIMETABLE_KEYS.all, "subjects"] as const,
};

export const useTimetable = (classId: string) => {
  return useQuery({
    queryKey: TIMETABLE_KEYS.detail(classId),
    queryFn: () => timetableApi.getTimetable(classId),
    enabled: !!classId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useExamSchedule = (classId: string) => {
  return useQuery({
    queryKey: TIMETABLE_KEYS.exams(classId),
    queryFn: () => timetableApi.getExamSchedule(classId),
    enabled: !!classId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useTeachers = () => {
  return useQuery({
    queryKey: TIMETABLE_KEYS.teachers(),
    queryFn: timetableApi.getTeachers,
    staleTime: 1000 * 60 * 10,
  });
};

export const useSubjects = () => {
  return useQuery({
    queryKey: TIMETABLE_KEYS.subjects(),
    queryFn: timetableApi.getSubjects,
    staleTime: 1000 * 60 * 10,
  });
};

export const useTimetableMutations = (classId: string) => {
  const qc = useQueryClient();

  const invalidateTimetable = () =>
    qc.invalidateQueries({ queryKey: TIMETABLE_KEYS.detail(classId) });

  const invalidateExams = () =>
    qc.invalidateQueries({ queryKey: TIMETABLE_KEYS.exams(classId) });

  const updatePeriod = useMutation({
    mutationFn: (payload: EditPeriodPayload) => timetableApi.updatePeriod(payload),
    onSuccess: invalidateTimetable,
  });

  const addExam = useMutation({
    mutationFn: (payload: AddExamPayload) => timetableApi.addExam(payload),
    onSuccess: invalidateExams,
  });

  const updateExam = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AddExamPayload> }) =>
      timetableApi.updateExam(id, payload),
    onSuccess: invalidateExams,
  });

  const deleteExam = useMutation({
    mutationFn: (id: string) => timetableApi.deleteExam(id),
    onSuccess: invalidateExams,
  });

  const resendNotification = useMutation({
    mutationFn: () => timetableApi.resendNotification(classId),
  });

  return { updatePeriod, addExam, updateExam, deleteExam, resendNotification };
};