import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { homeworkApi, fetchTeacherId } from "../api/homework.api";
import type {
  HomeworkItem,
  StudyMaterial,
  HomeworkState,
  ModalState,
  CreateHomeworkPayload,
  CreateStudyMaterialPayload,
  UpdateHomeworkPayload,
} from "../types/homework.types";

// ── Query key factory ───────────────────────────────────────────────────────

export const HOMEWORK_KEYS = {
  all:          ["homework"] as const,
  teacher:      () => [...HOMEWORK_KEYS.all, "teacherId"] as const,
  list:         (teacherId: string) => [...HOMEWORK_KEYS.all, "list", teacherId] as const,
  materials:    () => [...HOMEWORK_KEYS.all, "materials"] as const,
};

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useHomework = (): HomeworkState => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const phone = user?.phone ?? "";
  const fallbackId = user?.id ?? "";
  const schoolCode = user?.schoolcode ?? "";

  const [tab, setTab] = useState<"active" | "past" | "materials">("active");
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [reminderSent, setReminderSent] = useState<Set<string>>(new Set());

  // ── Resolve real staff UUID from staff list ────────────────────────────
  const { data: teacherId = fallbackId } = useQuery({
    queryKey: HOMEWORK_KEYS.teacher(),
    queryFn: () => fetchTeacherId(phone),
    staleTime: Infinity,
    retry: 1,
    enabled: !!phone,
  });

  const queryEnabled = !!teacherId;

  // ── Fetch homework list ────────────────────────────────────────────────
  const {
    data: homeworkData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: HOMEWORK_KEYS.list(teacherId),
    queryFn: () => homeworkApi.getHomeworkList({ teacher_id: teacherId }),
    staleTime: 1000 * 60 * 3,
    retry: 2,
    enabled: queryEnabled,
  });

  // ── Fetch materials ────────────────────────────────────────────────────
  const { data: materialsData = [] } = useQuery({
    queryKey: HOMEWORK_KEYS.materials(),
    queryFn: homeworkApi.getMaterials,
    staleTime: 1000 * 60 * 5,
    enabled: queryEnabled,
  });

  const data = homeworkData;
  const materials = materialsData;

  const activeHomework = useMemo(
    () => (data ?? []).filter((h) => h.status === "ACTIVE"),
    [data],
  );
  const pastHomework = useMemo(
    () => (data ?? []).filter((h) => h.status === "PAST"),
    [data],
  );

  // ── Mutations ──────────────────────────────────────────────────────────
  const invalidateList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: HOMEWORK_KEYS.list(teacherId) });
  }, [queryClient, teacherId]);

  const { mutateAsync: createHomework, isPending: isCreating } = useMutation({
    mutationFn: (payload: CreateHomeworkPayload) => homeworkApi.createHomework(payload),
    onSuccess: () => {
      invalidateList();
      setModal({ type: "none" });
    },
  });

  const { mutateAsync: updateHomework, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateHomeworkPayload }) =>
      homeworkApi.updateHomework(id, payload),
    onSuccess: () => {
      invalidateList();
      setModal({ type: "none" });
    },
  });

  const { mutateAsync: delHomework, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => homeworkApi.deleteHomework(id),
    onSuccess: () => {
      invalidateList();
      setModal({ type: "none" });
    },
  });

  const { mutateAsync: uploadMaterial } = useMutation({
    mutationFn: (payload: CreateStudyMaterialPayload) => homeworkApi.createStudyMaterial(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HOMEWORK_KEYS.materials() });
      setModal({ type: "none" });
    },
  });

  const { mutateAsync: deleteMaterial } = useMutation({
    mutationFn: (id: string) => homeworkApi.deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HOMEWORK_KEYS.materials() });
      setModal({ type: "none" });
    },
  });

  // ── Reminder (optimistic) ──────────────────────────────────────────────
  const { mutateAsync: sendReminderApi } = useMutation({
    mutationFn: (id: string) => homeworkApi.sendReminder(id),
  });

  const sendReminder = useCallback(async (id: string) => {
    setReminderSent((prev) => new Set([...prev, id]));
    try {
      await sendReminderApi(id);
    } catch {
      setReminderSent((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [sendReminderApi]);

  const deleteHomeworkHandler = useCallback(async (id: string) => {
    await delHomework(id);
  }, [delHomework]);

  const deleteMaterialHandler = useCallback(async (id: string) => {
    await deleteMaterial(id);
  }, [deleteMaterial]);

  return {
    tab, setTab,
    teacherId,
    schoolCode,
    data,
    activeHomework,
    pastHomework,
    materials,
    isLoading,
    isError,
    error,
    refetch,
    modal, setModal,
    reminderSent, sendReminder,
    createHomework,
    updateHomework: (id, payload) => updateHomework({ id, payload }),
    deleteHomework: deleteHomeworkHandler,
    uploadMaterial,
    deleteMaterial: deleteMaterialHandler,
    isCreating,
    isUpdating,
    isDeleting,
  };
};
