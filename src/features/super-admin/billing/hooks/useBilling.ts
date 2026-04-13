import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { billingApi } from '../api/billing.api';
import type {
  InstitutionFilters,
  RecordPaymentPayload,
  UpdatePlanPayload,
} from '../types/billing.types';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const billingKeys = {
  all: ['billing'] as const,
  overview: () => [...billingKeys.all, 'overview'] as const,
  mrrHistory: (months: number) => [...billingKeys.all, 'mrr-history', months] as const,
  revenueByPlan: () => [...billingKeys.all, 'revenue-by-plan'] as const,
  topInstitutions: (limit: number) => [...billingKeys.all, 'top-institutions', limit] as const,
  institutions: () => [...billingKeys.all, 'institutions'] as const,
  institutionsList: (filters: InstitutionFilters) =>
    [...billingKeys.institutions(), 'list', filters] as const,
  institution: (id: string) => [...billingKeys.institutions(), 'detail', id] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useBillingOverview() {
  return useQuery({
    queryKey: billingKeys.overview(),
    queryFn: billingApi.getOverview,
    staleTime: 60_000,
    refetchInterval: 5 * 60_000, // auto-refresh every 5 min
  });
}

export function useMRRHistory(months = 6) {
  return useQuery({
    queryKey: billingKeys.mrrHistory(months),
    queryFn: () => billingApi.getMRRHistory(months),
    staleTime: 5 * 60_000,
  });
}

export function useRevenueByPlan() {
  return useQuery({
    queryKey: billingKeys.revenueByPlan(),
    queryFn: billingApi.getRevenueByPlan,
    staleTime: 5 * 60_000,
  });
}

export function useTopInstitutions(limit = 5) {
  return useQuery({
    queryKey: billingKeys.topInstitutions(limit),
    queryFn: () => billingApi.getTopInstitutions(limit),
    staleTime: 30_000,
  });
}

export function useInstitutions(filters: InstitutionFilters = {}) {
  return useQuery({
    queryKey: billingKeys.institutionsList(filters),
    queryFn: () => billingApi.listInstitutions(filters),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useInstitution(id: string) {
  return useQuery({
    queryKey: billingKeys.institution(id),
    queryFn: () => billingApi.getInstitution(id),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useBillingMutations() {
  const qc = useQueryClient();

  const invalidateAll = () =>
    qc.invalidateQueries({ queryKey: billingKeys.all });

  const recordPayment = useMutation({
    mutationFn: (payload: RecordPaymentPayload) => billingApi.recordPayment(payload),
    onSuccess: () => invalidateAll(),
  });

  const updatePlan = useMutation({
    mutationFn: (payload: UpdatePlanPayload) => billingApi.updatePlan(payload),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: billingKeys.institutions() });
      qc.setQueryData(billingKeys.institution(updated.id), updated);
    },
  });

  const exportCsv = useMutation({
    mutationFn: (filters: InstitutionFilters) => billingApi.exportInstitutionsCsv(filters),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `institutions-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });

  return { recordPayment, updatePlan, exportCsv };
}