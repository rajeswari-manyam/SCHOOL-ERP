import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { marketingApi } from "../api/marketing.api";
import type { RepFilters, RepFormValues } from "../types/marketing.types";

export const MARKETING_KEYS = {
  all:        ["super-admin", "marketing-team"] as const,
  stats:      () => [...MARKETING_KEYS.all, "stats"] as const,
  reps:       (f: Partial<RepFilters>) => [...MARKETING_KEYS.all, "reps", f] as const,
  attendance: (m: number, y: number) => [...MARKETING_KEYS.all, "attendance", m, y] as const,
};

export const useMarketingStats = () =>
  useQuery({ queryKey: MARKETING_KEYS.stats(), queryFn: marketingApi.getStats, staleTime: 60_000 });

export const useReps = (filters: Partial<RepFilters>) =>
  useQuery({
    queryKey: MARKETING_KEYS.reps(filters),
    queryFn: () => marketingApi.getReps(filters),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });

export const useAttendance = (month: number, year: number) =>
  useQuery({
    queryKey: MARKETING_KEYS.attendance(month, year),
    queryFn: () => marketingApi.getAttendance(month, year),
    staleTime: 30_000,
  });

export const useMarketingMutations = () => {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: MARKETING_KEYS.all });

  return {
    createRep:       useMutation({ mutationFn: (p: RepFormValues) => marketingApi.createRep(p), onSuccess: inv }),
    updateRep:       useMutation({ mutationFn: ({ id, p }: { id: string; p: Partial<RepFormValues> }) => marketingApi.updateRep(id, p), onSuccess: inv }),
    deleteRep:       useMutation({ mutationFn: (id: string) => marketingApi.deleteRep(id), onSuccess: inv }),
    markAttendance:  useMutation({ mutationFn: ({ repId, date, status }: { repId: string; date: string; status: string }) => marketingApi.markAttendance(repId, date, status), onSuccess: inv }),
    approvePayout:   useMutation({ mutationFn: (id: string) => marketingApi.approvePayout(id), onSuccess: inv }),
    approveAll:      useMutation({ mutationFn: () => marketingApi.approveAllPayouts(), onSuccess: inv }),
    exportReport:    useMutation({ mutationFn: () => marketingApi.exportReport(), onSuccess: async (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "marketing-report.xlsx"; a.click();
      URL.revokeObjectURL(url);
    }}),
  };
};
