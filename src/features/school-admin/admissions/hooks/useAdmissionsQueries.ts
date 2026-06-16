import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { admissionsApi } from '@/services/admissions.api';
import { useUIStore } from '@/store/uiStore';
import type { NewEnquiryFormData, ConfirmAdmissionFormData, PipelineStage } from '../types';

export const ADMISSIONS_KEYS = {
  all: ['admissions'] as const,
  enquiries: (ayId?: string | null) => [...ADMISSIONS_KEYS.all, 'enquiries', ayId] as const,
  interviewList: (ayId?: string | null) => [...ADMISSIONS_KEYS.all, 'interviewList', ayId] as const,
  docsList: (ayId?: string | null) => [...ADMISSIONS_KEYS.all, 'docsList', ayId] as const,
  stats: (ayId?: string | null) => [...ADMISSIONS_KEYS.all, 'stats', ayId] as const,
  /** Per-enquiry document list — scoped so refetch/invalidate is surgical */
  documents: (enquiryId: string) => [...ADMISSIONS_KEYS.all, 'documents', enquiryId] as const,
};

export function useEnquiries() {
  const academicYearId = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: ADMISSIONS_KEYS.enquiries(academicYearId),
    queryFn: () => admissionsApi.getEnquiries(academicYearId),
    enabled: !!academicYearId,
    staleTime: 30_000,
  });
}

export function useInterviewList() {
  const academicYearId = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: ADMISSIONS_KEYS.interviewList(academicYearId),
    queryFn: () => admissionsApi.getInterviewList(academicYearId),
    enabled: !!academicYearId,
    staleTime: 30_000,
  });
}

export function useDocsVerificationList() {
  const academicYearId = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: ADMISSIONS_KEYS.docsList(academicYearId),
    queryFn: () => admissionsApi.getDocsVerificationList(academicYearId),
    enabled: !!academicYearId,
    staleTime: 30_000,
  });
}

export function usePipelineStats() {
  const academicYearId = useUIStore((s) => s.academicYearId);
  return useQuery({
    queryKey: ADMISSIONS_KEYS.stats(academicYearId),
    queryFn: () => admissionsApi.getPipelineStats(academicYearId),
    enabled: !!academicYearId,
    staleTime: 30_000,
  });
}

/** Fetch uploaded document records for a single enquiry */
export function useAdmissionDocuments(
  enquiryId: string,
  opts: { enabled?: boolean; retry?: boolean | number } = {},
) {
  const { enabled = true, retry = 1 } = opts;
  return useQuery({
    queryKey: ADMISSIONS_KEYS.documents(enquiryId),
    queryFn: () => admissionsApi.getAdmissionDocuments(enquiryId),
    staleTime: 60_000,
    enabled: enabled && !!enquiryId,
    retry,
    // Return empty array on error so consumers don't need to null-check
    placeholderData: [],
  });
}

export function useAddEnquiry() {
  const qc = useQueryClient();
  const academicYearId = useUIStore((s) => s.academicYearId);
  return useMutation({
    mutationFn: (data: NewEnquiryFormData) => admissionsApi.addEnquiry(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMISSIONS_KEYS.enquiries(academicYearId) });
      qc.invalidateQueries({ queryKey: ADMISSIONS_KEYS.stats(academicYearId) });
      toast.success('Enquiry added & WhatsApp sent!');
    },
    onError: () => toast.error('Failed to add enquiry'),
  });
}

export function useMoveToStage() {
  const qc = useQueryClient();
  const academicYearId = useUIStore((s) => s.academicYearId);
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: PipelineStage }) => {
      switch (stage) {
        case 'interview': return admissionsApi.shortlistToInterview(id);
        case 'docs_verified': return admissionsApi.shortlistToDocs(id);
        default: return Promise.resolve();
      }
    },
    onSuccess: (_void, { stage }) => {
      qc.invalidateQueries({ queryKey: ADMISSIONS_KEYS.enquiries(academicYearId) });
      qc.invalidateQueries({ queryKey: ADMISSIONS_KEYS.stats(academicYearId) });
      if (stage === 'interview' || stage === 'docs_verified') {
        toast.success(`Moved to ${stage.replace('_', ' ')}`);
      }
    },
    onError: () => toast.error('Failed to update stage'),
  });
}

export function useConfirmAdmission() {
  const qc = useQueryClient();
  const academicYearId = useUIStore((s) => s.academicYearId);
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ConfirmAdmissionFormData }) =>
      admissionsApi.confirmAdmission(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMISSIONS_KEYS.enquiries(academicYearId) });
      qc.invalidateQueries({ queryKey: ADMISSIONS_KEYS.stats(academicYearId) });
      toast.success('Admission confirmed & Welcome WhatsApp sent!');
    },
    onError: () => toast.error('Failed to confirm admission'),
  });
}

export function useDeclineEnquiry() {
  const qc = useQueryClient();
  const academicYearId = useUIStore((s) => s.academicYearId);
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      admissionsApi.declineAdmission(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMISSIONS_KEYS.enquiries(academicYearId) });
      qc.invalidateQueries({ queryKey: ADMISSIONS_KEYS.stats(academicYearId) });
      toast.success('Enquiry declined');
    },
    onError: () => toast.error('Failed to decline enquiry'),
  });
}
