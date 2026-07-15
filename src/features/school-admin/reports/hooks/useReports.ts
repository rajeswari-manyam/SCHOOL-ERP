import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsApi } from "@/services/reports.api";
import type {
  CreateReportPayload,
} from "../types/reports.types";


export const REPORTS_KEYS = {
  all: ["school-admin", "reports"] as const,
  list: () => [...REPORTS_KEYS.all, "list"] as const,
  recentlyGenerated: () => [...REPORTS_KEYS.all, "recentlyGenerated"] as const,
};

export const useReports = () =>
  useQuery({
    queryKey: REPORTS_KEYS.list(),
    queryFn: () => reportsApi.getAllRaw(),
    staleTime: 1000 * 60 * 2,
  });

export const useRecentlyGeneratedReports = () =>
  useQuery({
    queryKey: REPORTS_KEYS.recentlyGenerated(),
    queryFn: () => reportsApi.getRecentlyGenerated(),
    staleTime: 1000 * 60 * 2,
  });

export const useGenerateReport = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReportPayload) => reportsApi.generate(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: REPORTS_KEYS.all });
      qc.invalidateQueries({ queryKey: REPORTS_KEYS.recentlyGenerated() });
    },
  });
};

export const useDeleteReport = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reportsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: REPORTS_KEYS.all });
      qc.invalidateQueries({ queryKey: REPORTS_KEYS.recentlyGenerated() });
    },
  });
};

export const useUpdateReport = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateReportPayload> }) =>
      reportsApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: REPORTS_KEYS.all });
      qc.invalidateQueries({ queryKey: REPORTS_KEYS.recentlyGenerated() });
    },
  });
};
