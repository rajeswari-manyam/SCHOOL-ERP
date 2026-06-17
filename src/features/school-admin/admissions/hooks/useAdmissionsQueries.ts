import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { admissionsApi } from '@/services/admissions.api';
import { useUIStore } from '@/store/uiStore';
import type { NewEnquiryFormData, ConfirmAdmissionFormData, PipelineStage } from '../types';

// ─── Query keys ───────────────────────────────────────────────────────────────

export const ADMISSIONS_KEYS = {
  all:        ['admissions'] as const,
  enquiries:  (ay?: string | null) => [...ADMISSIONS_KEYS.all, 'enquiries',  ay] as const,
  interviews: (ay?: string | null) => [...ADMISSIONS_KEYS.all, 'interviews', ay] as const,
  docsList:   (ay?: string | null) => [...ADMISSIONS_KEYS.all, 'docsList',   ay] as const,
  confirmed:  (ay?: string | null) => [...ADMISSIONS_KEYS.all, 'confirmed',  ay] as const,
  declined:   (ay?: string | null) => [...ADMISSIONS_KEYS.all, 'declined',   ay] as const,
  stats:      (ay?: string | null) => [...ADMISSIONS_KEYS.all, 'stats',      ay] as const,
  documents:  (enquiryId: string)  => [...ADMISSIONS_KEYS.all, 'documents',  enquiryId] as const,
};

/** Invalidate all pipeline lists + stats at once */
function invalidateAll(qc: ReturnType<typeof useQueryClient>, ay?: string | null) {
  const keys = [
    ADMISSIONS_KEYS.enquiries(ay),
    ADMISSIONS_KEYS.interviews(ay),
    ADMISSIONS_KEYS.docsList(ay),
    ADMISSIONS_KEYS.confirmed(ay),
    ADMISSIONS_KEYS.declined(ay),
    ADMISSIONS_KEYS.stats(ay),
  ];
  keys.forEach((k) => qc.invalidateQueries({ queryKey: k }));
}

// ─── Stage list hooks ─────────────────────────────────────────────────────────

export function useEnquiries() {
  const ay = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: ADMISSIONS_KEYS.enquiries(ay),
    queryFn:  () => admissionsApi.getEnquiries(ay),
    enabled:  !!ay,
    staleTime: 30_000,
  });
}

export function useInterviewList() {
  const ay = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: ADMISSIONS_KEYS.interviews(ay),
    queryFn:  () => admissionsApi.getInterviewList(ay),
    enabled:  !!ay,
    staleTime: 30_000,
  });
}

export function useDocsVerificationList() {
  const ay = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: ADMISSIONS_KEYS.docsList(ay),
    queryFn:  () => admissionsApi.getDocsVerificationList(ay),
    enabled:  !!ay,
    staleTime: 30_000,
  });
}

export function useConfirmedAdmissions() {
  const ay = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: ADMISSIONS_KEYS.confirmed(ay),
    queryFn:  () => admissionsApi.getConfirmedAdmissions(ay),
    enabled:  !!ay,
    staleTime: 30_000,
  });
}

export function useDeclinedAdmissions() {
  const ay = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: ADMISSIONS_KEYS.declined(ay),
    queryFn:  () => admissionsApi.getDeclinedAdmissions(ay),
    enabled:  !!ay,
    staleTime: 30_000,
  });
}

export function usePipelineStats() {
  const ay = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: ADMISSIONS_KEYS.stats(ay),
    queryFn:  () => admissionsApi.getPipelineStats(ay),
    enabled:  !!ay,
    staleTime: 30_000,
  });
}

// ─── Per-enquiry document hook ────────────────────────────────────────────────

export function useAdmissionDocuments(
  enquiryId: string,
  opts: { enabled?: boolean; retry?: boolean | number } = {},
) {
  const { enabled = true, retry = 1 } = opts;
  return useQuery({
    queryKey: ADMISSIONS_KEYS.documents(enquiryId),
    queryFn:  () => admissionsApi.getAdmissionDocuments(enquiryId),
    staleTime: 60_000,
    enabled:  enabled && !!enquiryId,
    retry,
    placeholderData: [],
  });
}

// ─── Mutation hooks ───────────────────────────────────────────────────────────

export function useAddEnquiry() {
  const qc = useQueryClient();
  const ay  = useUIStore((s) => s.academicYearId);
  return useMutation({
    mutationFn: (data: NewEnquiryFormData) => admissionsApi.addEnquiry(data),
    onSuccess: () => {
      invalidateAll(qc, ay);
      toast.success('Enquiry added successfully');
    },
    onError: () => toast.error('Failed to add enquiry'),
  });
}

export function useMoveToStage() {
  const qc = useQueryClient();
  const ay  = useUIStore((s) => s.academicYearId);
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: PipelineStage }) => {
      if (stage === 'interview')    return admissionsApi.shortlistToInterview(id);
      if (stage === 'docs_verified') return admissionsApi.shortlistToDocs(id);
      return Promise.resolve();
    },
    onSuccess: (_v, { stage }) => {
      invalidateAll(qc, ay);
      if (stage === 'interview')    toast.success('Moved to Interview stage');
      if (stage === 'docs_verified') toast.success('Moved to Docs Verification stage');
    },
    onError: () => toast.error('Failed to update stage'),
  });
}

export function useConfirmAdmission() {
  const qc = useQueryClient();
  const ay  = useUIStore((s) => s.academicYearId);
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ConfirmAdmissionFormData }) =>
      admissionsApi.confirmAdmission(id, data),
    onSuccess: () => {
      invalidateAll(qc, ay);
      toast.success('Admission confirmed successfully');
    },
    onError: () => toast.error('Failed to confirm admission'),
  });
}

export function useDirectConfirmAdmission() {
  const qc = useQueryClient();
  const ay  = useUIStore((s) => s.academicYearId);
  return useMutation({
    mutationFn: (id: string) => admissionsApi.confirmAdmissionDirect(id),
    onSuccess: () => {
      invalidateAll(qc, ay);
      toast.success('Admission confirmed successfully');
    },
    onError: () => toast.error('Failed to confirm admission'),
  });
}

export function useDirectDeclineAdmission() {
  const qc = useQueryClient();
  const ay  = useUIStore((s) => s.academicYearId);
  return useMutation({
    mutationFn: (id: string) => admissionsApi.declineAdmissionDirect(id),
    onSuccess: () => {
      invalidateAll(qc, ay);
      toast.success('Admission declined');
    },
    onError: () => toast.error('Failed to decline admission'),
  });
}

export function useDeclineEnquiry() {
  const qc = useQueryClient();
  const ay  = useUIStore((s) => s.academicYearId);
  return useMutation({
    mutationFn: ({ id }: { id: string; reason?: string }) =>
      admissionsApi.declineAdmissionDirect(id),

    onSuccess: () => {
      invalidateAll(qc, ay);
      toast.success('Enquiry declined');
    },
    onError: () => toast.error('Failed to decline enquiry'),
  });
}
