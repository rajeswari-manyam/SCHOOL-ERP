import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  type ExamPayload,
} from "@/services/exam.api";

// ── Query keys ───────────────────────────────────────────────────────────────
export const EXAM_KEYS = {
  all:    ["exams"] as const,
  detail: (id: string) => ["exams", id] as const,
};

// ── Hooks ─────────────────────────────────────────────────────────────────────

/** List all exams — returns [] on 404/error so the page never crashes */
export const useExams = () =>
  useQuery({
    queryKey: EXAM_KEYS.all,
    queryFn: async () => {
      try {
        return await getAllExams();
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

/** Single exam by ID */
export const useExamById = (id: string) =>
  useQuery({
    queryKey: EXAM_KEYS.detail(id),
    queryFn: () => getExamById(id),
    enabled: !!id,
  });

/** Create exam */
export const useCreateExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ExamPayload) => createExam(data),
    onSuccess: () => {
      // refetchType: "all" forces an immediate refetch even if these queries
      // are currently inactive (e.g. user navigated away), so the cache is
      // already fresh by the time they come back — otherwise
      // refetchOnMount:false would leave the stale cached data showing.
      qc.invalidateQueries({ queryKey: EXAM_KEYS.all, refetchType: "all" });
      // Also invalidate useTimetable exam-names cache so the dropdown refreshes
      qc.invalidateQueries({ queryKey: ["timetable", "exam-names"], refetchType: "all" });
      toast.success("Exam created successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

/** Update exam */
export const useUpdateExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExamPayload> }) =>
      updateExam(id, data),
    onSuccess: () => {
      // refetchType: "all" — force refresh even if inactive right now, so the
      // cache is already current when the user navigates back to the list.
      qc.invalidateQueries({ queryKey: EXAM_KEYS.all, refetchType: "all" });
      qc.invalidateQueries({ queryKey: ["timetable", "exam-names"], refetchType: "all" });
      toast.success("Exam updated successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

/** Delete exam */
export const useDeleteExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteExam(id),
    onSuccess: () => {
      // refetchType: "all" — force refresh even if inactive right now, so the
      // cache is already current when the user navigates back to the list.
      qc.invalidateQueries({ queryKey: EXAM_KEYS.all, refetchType: "all" });
      qc.invalidateQueries({ queryKey: ["timetable", "exam-names"], refetchType: "all" });
      toast.success("Exam deleted successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};