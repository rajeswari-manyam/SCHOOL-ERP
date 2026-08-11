import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { billingApi } from '@/services/billing.api';
import type {
  InstitutionFilters,
  RecordPaymentPayload,
  UpdatePlanPayload,
  OrganizationBillingPayload,
  CreateSubscriptionPayload,
  UpdateSubscriptionPayload,
  SubscriptionPaymentPayload,
  SubscriptionStatusFilter,
} from '../types/billing.types';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const billingKeys = {
  all: ['billing'] as const,
  revenueOverview: () => [...billingKeys.all, 'revenue-overview'] as const,
  institutions: () => [...billingKeys.all, 'institutions'] as const,
  institutionsList: (filters: InstitutionFilters) =>
    [...billingKeys.institutions(), 'list', filters] as const,
  institution: (id: string) => [...billingKeys.institutions(), 'detail', id] as const,
  organizationSchools: ['billing', 'organization', 'schools'] as const,
  subscriptions: ['billing', 'subscriptions'] as const,
  subscriptionDetail: (id: string) => ['billing', 'subscriptions', id] as const,
  subscriptionPayments: ['billing', 'subscription-payments'] as const,
  subscriptionPaymentsBySchool: (schoolId: string) => ['billing', 'subscription-payments', 'school', schoolId] as const,
  schoolsByStatus: (status: SubscriptionStatusFilter) => ['billing', 'schools-by-status', status] as const,
  schoolSubscriptionDetail: (schoolId: string) => ['billing', 'school-subscription-detail', schoolId] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useRevenueOverview() {
  return useQuery({
    queryKey: billingKeys.revenueOverview(),
    queryFn: billingApi.getRevenueOverview,
    staleTime: 60_000,
    refetchInterval: 5 * 60_000, // auto-refresh every 5 min
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

export function useOrganizationSchools() {
  return useQuery({
    queryKey: billingKeys.organizationSchools,
    queryFn: billingApi.getOrganizationSchools,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
    select: (data) => {
      const schools = Array.isArray(data?.schools) ? data.schools : [];
      console.log("[useOrganizationSchools] selected schools:", schools);
      return schools;
    },
  });
}

// ─── Subscription Queries ──────────────────────────────────────────────────────

export function useAllSubscriptions() {
  return useQuery({
    queryKey: billingKeys.subscriptions,
    queryFn: billingApi.getAllSubscriptions,
    staleTime: 60_000,
  });
}

export function useSubscriptionById(id: string) {
  return useQuery({
    queryKey: billingKeys.subscriptionDetail(id),
    queryFn: () => billingApi.getSubscriptionById(id),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}

// ─── Subscription Payment Queries ───────────────────────────────────────────────

export function useSubscriptionPayments() {
  return useQuery({
    queryKey: billingKeys.subscriptionPayments,
    queryFn: billingApi.getAllSubscriptionPayments,
    staleTime: 30_000,
  });
}

export function useSubscriptionPaymentsBySchool(schoolId: string) {
  return useQuery({
    queryKey: billingKeys.subscriptionPaymentsBySchool(schoolId),
    queryFn: () => billingApi.getSubscriptionPaymentsBySchool(schoolId),
    enabled: Boolean(schoolId),
  });
}

export function useSchoolsBySubscriptionStatus(status: SubscriptionStatusFilter) {
  return useQuery({
    queryKey: billingKeys.schoolsByStatus(status),
    queryFn: () => billingApi.getSchoolsBySubscriptionStatus(status),
    staleTime: 30_000,
  });
}

export function useSchoolSubscriptionDetail(schoolId: string, enabled: boolean) {
  return useQuery({
    queryKey: billingKeys.schoolSubscriptionDetail(schoolId),
    queryFn: () => billingApi.getSchoolSubscriptionDetail(schoolId),
    enabled: enabled && Boolean(schoolId),
    staleTime: 30_000,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useBillingMutations() {
  const qc = useQueryClient();

  const invalidateAll = () =>
    qc.invalidateQueries({ queryKey: billingKeys.all, refetchType: "all" });

  const recordPayment = useMutation({
    mutationFn: (payload: RecordPaymentPayload) => billingApi.recordPayment(payload),
    onSuccess: (data) => {
      console.log("[useBilling] recordPayment success:", data);
      invalidateAll();
    },
    onError: (error) => {
      console.error("[useBilling] recordPayment error:", error);
    },
  });

  const recordOrganizationBilling = useMutation({
    mutationFn: (payload: OrganizationBillingPayload) =>
      billingApi.recordOrganizationBilling(payload),
    onSuccess: (data) => {
      console.log("[useBilling] recordOrganizationBilling success:", data);
      invalidateAll();
    },
    onError: (error) => {
      console.error("[useBilling] recordOrganizationBilling error:", error);
    },
  });

  const updatePlan = useMutation({
    mutationFn: (payload: UpdatePlanPayload) => billingApi.updatePlan(payload),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: billingKeys.institutions(), refetchType: "all" });
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

  const createSubscription = useMutation({
    mutationFn: (payload: CreateSubscriptionPayload) =>
      billingApi.createSubscription(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: billingKeys.subscriptions, refetchType: "all" });
    },
  });

  const updateSubscription = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSubscriptionPayload }) =>
      billingApi.updateSubscription(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: billingKeys.subscriptions, refetchType: "all" });
    },
  });

  const deleteSubscription = useMutation({
    mutationFn: (id: string) => billingApi.deleteSubscription(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: billingKeys.subscriptions, refetchType: "all" });
    },
  });

  const invalidateSubscriptionPayments = () =>
    qc.invalidateQueries({ queryKey: billingKeys.subscriptionPayments, refetchType: "all" });

  const recordSubscriptionPayment = useMutation({
    mutationFn: (payload: SubscriptionPaymentPayload) => billingApi.recordSubscriptionPayment(payload),
    onSuccess: invalidateSubscriptionPayments,
  });

  const updateSubscriptionPayment = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<SubscriptionPaymentPayload> }) =>
      billingApi.updateSubscriptionPayment(id, payload),
    onSuccess: invalidateSubscriptionPayments,
  });

  const deleteSubscriptionPayment = useMutation({
    mutationFn: (id: string) => billingApi.deleteSubscriptionPayment(id),
    onSuccess: invalidateSubscriptionPayments,
  });

  const downloadPaymentReceipt = useMutation({
    mutationFn: async (paymentId: string) => {
      const blob = await billingApi.downloadSubscriptionPaymentReceipt(paymentId);
      const url = URL.createObjectURL(blob);
      if (blob.type.includes('html')) {
        // Receipt is a printable HTML page — open it rather than saving a raw .html file
        window.open(url, '_blank');
      } else {
        const ext = blob.type.includes('pdf') ? 'pdf'
          : blob.type.includes('csv') ? 'csv'
          : blob.type.includes('sheet') || blob.type.includes('excel') ? 'xlsx'
          : 'pdf';
        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt_${paymentId}.${ext}`;
        a.click();
      }
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to download receipt");
    },
  });

  return {
    recordPayment, recordOrganizationBilling, updatePlan, exportCsv,
    createSubscription, updateSubscription, deleteSubscription,
    recordSubscriptionPayment, updateSubscriptionPayment, deleteSubscriptionPayment,
    downloadPaymentReceipt,
  };
}