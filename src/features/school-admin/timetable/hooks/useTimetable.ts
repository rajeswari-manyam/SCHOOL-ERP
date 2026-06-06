import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { timetableApi } from "../api/timetable.api";
import type { EditPeriodPayload, ExamEntry, DayOfWeek, CreateTimetablePayload, CreateExamTimetablePayload } from "../types/timetable.types";

// ─── Query key factory ──────────────────────────────────────────────────────────
export const TIMETABLE_KEYS = {
  all:          ["timetable"] as const,
  page:         (className: string, sectionName: string, academicYear: string) =>
    [...TIMETABLE_KEYS.all, "page", className, sectionName, academicYear] as const,
  classTt:      (classId: string) => [...TIMETABLE_KEYS.all, "class", classId] as const,
  exam:         () => [...TIMETABLE_KEYS.all, "exam"] as const,
  subjects:     () => [...TIMETABLE_KEYS.all, "subjects"] as const,
  teachers:     () => [...TIMETABLE_KEYS.all, "teachers"] as const,
};

// ─── Full page ──────────────────────────────────────────────────────────────────
export const useTimetablePage = (className: string, sectionName: string, academicYear: string) =>
  useQuery({
    queryKey: TIMETABLE_KEYS.page(className, sectionName, academicYear),
    queryFn: () => timetableApi.getTimetablePage({ className, sectionName, academicYear }),
    staleTime: 1000 * 60 * 5,
    enabled: !!className && !!sectionName,
  });

// ─── Class timetable ────────────────────────────────────────────────────────────
export const useClassTimetable = (classId: string) =>
  useQuery({
    queryKey: TIMETABLE_KEYS.classTt(classId),
    queryFn: () => timetableApi.getClassTimetable(),
    staleTime: 1000 * 60 * 5,
  });

// ─── Exam timetable ─────────────────────────────────────────────────────────────
export const useExamTimetable = () =>
  useQuery({
    queryKey: TIMETABLE_KEYS.exam(),
    queryFn: () => timetableApi.getExamTimetable(),
    staleTime: 1000 * 60 * 5,
  });

// ─── Subject options ────────────────────────────────────────────────────────────
export const useSubjectOptions = () =>
  useQuery({
    queryKey: TIMETABLE_KEYS.subjects(),
    queryFn: timetableApi.getSubjectOptions,
    staleTime: Infinity,
  });

// ─── Teacher options ────────────────────────────────────────────────────────────
export const useTeacherOptions = () =>
  useQuery({
    queryKey: TIMETABLE_KEYS.teachers(),
    queryFn: timetableApi.getTeacherOptions,
    staleTime: Infinity,
  });

// ─── Save period ────────────────────────────────────────────────────────────────
export const useSavePeriod = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: EditPeriodPayload) => timetableApi.savePeriod(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TIMETABLE_KEYS.all });
      toast.success("Period updated successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

// ─── Create timetable period ────────────────────────────────────────────────────
export const useCreateTimetable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTimetablePayload) => timetableApi.createTimetable(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TIMETABLE_KEYS.all });
      toast.success("Timetable period created successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

// ─── Create exam timetable entry ────────────────────────────────────────────────
export const useCreateExamTimetable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExamTimetablePayload) => timetableApi.createExamTimetable(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TIMETABLE_KEYS.exam() });
      toast.success("Exam timetable created successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

// ─── Add / delete exam ──────────────────────────────────────────────────────────
export const useAddExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entry: Omit<ExamEntry, "id" | "notifyStatus">) =>
      timetableApi.addExam(entry),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TIMETABLE_KEYS.exam() });
      toast.success("Exam added successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useDeleteExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (examId: string) => timetableApi.deleteExam(examId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TIMETABLE_KEYS.exam() });
      toast.success("Exam deleted successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

// ─── Edit period modal state ────────────────────────────────────────────────────
export interface EditPeriodState {
  open: boolean;
  classId: string;
  day: DayOfWeek | null;
  periodNo: number | null;
  subject: string;
  teacherName: string;
  room: string;
  applyToAllWeeks: boolean;
}

export const useEditPeriodState = () => {
  const initial: EditPeriodState = {
    open: false,
    classId: "class-10",
    day: null,
    periodNo: null,
    subject: "",
    teacherName: "",
    room: "Room 10A (default class room)",
    applyToAllWeeks: false,
  };

  const [state, setState] = useState<EditPeriodState>(initial);

  const openModal = useCallback(
    (classId: string, day: DayOfWeek, periodNo: number, subject: string, teacherName: string) =>
      setState((s) => ({ ...s, open: true, classId, day, periodNo, subject, teacherName })),
    []
  );

  const closeModal = useCallback(() => setState(initial), []);

  const setField = useCallback(
    <K extends keyof EditPeriodState>(key: K, value: EditPeriodState[K]) =>
      setState((s) => ({ ...s, [key]: value })),
    []
  );

  return { state, openModal, closeModal, setField };
};