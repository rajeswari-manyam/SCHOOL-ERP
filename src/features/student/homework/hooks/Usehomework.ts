import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { homeworkApi } from "../api/Homework.api";
import type {
  HomeworkPageState,
  Assignment,
} from "../types/Homework.types";

// ─── Query key factory ──────────────────────────────────────────────────────────
export const HOMEWORK_KEYS = {
  all: ["homework"] as const,
  list: ()       => [...HOMEWORK_KEYS.all, "list"] as const,
  allList: ()    => [...HOMEWORK_KEYS.all, "all"] as const,
  materials: ()  => [...HOMEWORK_KEYS.all, "materials"] as const,
  materialSearch: (q: string) => [...HOMEWORK_KEYS.materials(), q] as const,
};

// ─── Homework week / this-week view ────────────────────────────────────────────
export const useHomework = () =>
  useQuery({
    queryKey: HOMEWORK_KEYS.list(),
    queryFn: homeworkApi.getHomework,
    staleTime: 1000 * 60 * 5,
  });

// ─── All homework (for "All Homework" tab) ─────────────────────────────────────
export const useAllAssignments = (status?: string) =>
  useQuery({
    queryKey: [...HOMEWORK_KEYS.allList(), status ?? "all"],
    queryFn: () => homeworkApi.getAllAssignments(status),
    staleTime: 1000 * 60 * 5,
  });

// ─── Study materials ────────────────────────────────────────────────────────────
export const useStudyMaterials = (query = "") =>
  useQuery({
    queryKey: HOMEWORK_KEYS.materialSearch(query),
    queryFn: () => homeworkApi.getStudyMaterials(query || undefined),
    staleTime: 1000 * 60 * 10,
  });

// ─── Submit assignment ──────────────────────────────────────────────────────────
export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => homeworkApi.submitAssignment(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HOMEWORK_KEYS.all });
    },
  });
};

// ─── Download material ──────────────────────────────────────────────────────────
export const useDownloadMaterial = () => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const download = useCallback(async (materialId: string, fileName: string) => {
    setLoadingId(materialId);
    try {
      const blob = await homeworkApi.downloadMaterial(materialId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoadingId(null);
    }
  }, []);

  return { download, loadingId };
};

// ─── Page-level UI state ────────────────────────────────────────────────────────
export const useHomeworkPageState = () => {
  const [state, setState] = useState<HomeworkPageState>({
    activeTab: "THIS_WEEK",
    selectedDate: "2025-04-07",
    pendingCount: 0,
    submittingId: null,
    submitModalOpen: false,
    selectedAssignment: null,
  });

  const setActiveTab = useCallback(
    (tab: HomeworkPageState["activeTab"]) =>
      setState((s) => ({ ...s, activeTab: tab })),
    []
  );

  const setSelectedDate = useCallback(
    (dateIso: string) => setState((s) => ({ ...s, selectedDate: dateIso })),
    []
  );

  const openSubmitModal = useCallback(
    (assignment: Assignment) =>
      setState((s) => ({
        ...s,
        submitModalOpen: true,
        selectedAssignment: assignment,
      })),
    []
  );

  const closeSubmitModal = useCallback(
    () =>
      setState((s) => ({
        ...s,
        submitModalOpen: false,
        selectedAssignment: null,
        submittingId: null,
      })),
    []
  );

  return {
    state,
    setActiveTab,
    setSelectedDate,
    openSubmitModal,
    closeSubmitModal,
  };
};