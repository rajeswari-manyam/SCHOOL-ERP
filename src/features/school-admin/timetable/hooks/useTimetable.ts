import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { timetableApi } from "../api/timetable.api";
import type { EditPeriodPayload, ExamEntry, DayOfWeek } from "../types/timetable.types";

// ─── Query key factory ──────────────────────────────────────────────────────────
export const TIMETABLE_KEYS = {
  all:          ["timetable"] as const,
  page:         (classId: string) => [...TIMETABLE_KEYS.all, "page", classId] as const,
  classTt:      (classId: string) => [...TIMETABLE_KEYS.all, "class", classId] as const,
  exam:         () => [...TIMETABLE_KEYS.all, "exam"] as const,
  subjects:     () => [...TIMETABLE_KEYS.all, "subjects"] as const,
  teachers:     () => [...TIMETABLE_KEYS.all, "teachers"] as const,
};

// ─── Full page ──────────────────────────────────────────────────────────────────
export const useTimetablePage = (classId = "class-10") =>
  useQuery({
    queryKey: TIMETABLE_KEYS.page(classId),
    queryFn: () => timetableApi.getTimetablePage(classId),
    staleTime: 1000 * 60 * 5,
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
    queryFn: timetableApi.getExamTimetable,
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
    onSuccess: () => qc.invalidateQueries({ queryKey: TIMETABLE_KEYS.all }),
  });
};

// ─── Add / delete exam ──────────────────────────────────────────────────────────
export const useAddExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entry: Omit<ExamEntry, "id" | "notifyStatus">) =>
      timetableApi.addExam(entry),
    onSuccess: () => qc.invalidateQueries({ queryKey: TIMETABLE_KEYS.exam() }),
  });
};

export const useDeleteExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (examId: string) => timetableApi.deleteExam(examId),
    onSuccess: () => qc.invalidateQueries({ queryKey: TIMETABLE_KEYS.exam() }),
  });
};

// ─── Notify parents toggle ──────────────────────────────────────────────────────
export const useToggleNotifyParents = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (enabled: boolean) => timetableApi.toggleNotifyParents(enabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: TIMETABLE_KEYS.exam() }),
  });
};

// ─── Resend notification ────────────────────────────────────────────────────────
export const useResendNotification = () =>
  useMutation({
    mutationFn: () => timetableApi.resendNotification(),
  });

// ─── Print timetable ────────────────────────────────────────────────────────────
export const usePrintTimetable = () => {
  const [loading, setLoading] = useState(false);

  const print = useCallback(async (classId: string) => {
    setLoading(true);
    try {
      const blob = await timetableApi.printTimetable(classId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `timetable-${classId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }, []);

  return { print, loading };
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