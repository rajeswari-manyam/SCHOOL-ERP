import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { admissionsApi } from '../api/admissionsApi';
import type { NewEnquiryFormData, ConfirmAdmissionFormData, PipelineStage } from '../types';

export const ADMISSIONS_KEYS = {
  all: ['admissions'] as const,
  enquiries: () => [...ADMISSIONS_KEYS.all, 'enquiries'] as const,
  interviewList: () => [...ADMISSIONS_KEYS.all, 'interviewList'] as const,
  docsList: () => [...ADMISSIONS_KEYS.all, 'docsList'] as const,
  stats: () => [...ADMISSIONS_KEYS.all, 'stats'] as const,
};

export function useEnquiries() {
  return useQuery({
    queryKey: ADMISSIONS_KEYS.enquiries(),
    queryFn: () => admissionsApi.getEnquiries(),
    staleTime: 30_000,
  });
}

export function useInterviewList() {
  return useQuery({
    queryKey: ADMISSIONS_KEYS.interviewList(),
    queryFn: () => admissionsApi.getInterviewList(),
    staleTime: 30_000,
  });
}

export function useDocsVerificationList() {
  return useQuery({
    queryKey: ADMISSIONS_KEYS.docsList(),
    queryFn: () => admissionsApi.getDocsVerificationList(),
    staleTime: 30_000,
  });
}

export function usePipelineStats() {
  return useQuery({
    queryKey: ADMISSIONS_KEYS.stats(),
    queryFn: () => admissionsApi.getPipelineStats(),
    staleTime: 30_000,
  });
}

export function useAddEnquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: NewEnquiryFormData) => admissionsApi.addEnquiry(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMISSIONS_KEYS.enquiries() });
      qc.invalidateQueries({ queryKey: ADMISSIONS_KEYS.stats() });
      toast.success('Enquiry added & WhatsApp sent!');
    },
    onError: () => toast.error('Failed to add enquiry'),
  });
}

export function useMoveToStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: PipelineStage }) => {
      switch (stage) {
        case 'interview': return admissionsApi.shortlistToInterview(id);
        case 'docs_verified': return admissionsApi.shortlistToDocs(id);
        default: return Promise.resolve();
      }
    },
    onSuccess: (_voidResult, { stage }) => {
      qc.invalidateQueries({ queryKey: ADMISSIONS_KEYS.enquiries() });
      qc.invalidateQueries({ queryKey: ADMISSIONS_KEYS.stats() });
      if (stage === 'interview' || stage === 'docs_verified') {
        toast.success(`Moved to ${stage.replace('_', ' ')}`);
      }
    },
    onError: () => toast.error('Failed to update stage'),
  });
}

export function useConfirmAdmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ConfirmAdmissionFormData }) =>
      admissionsApi.confirmAdmission(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMISSIONS_KEYS.enquiries() });
      qc.invalidateQueries({ queryKey: ADMISSIONS_KEYS.stats() });
      toast.success('Admission confirmed & Welcome WhatsApp sent!');
    },
    onError: () => toast.error('Failed to confirm admission'),
  });
}

export function useDeclineEnquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      admissionsApi.declineAdmission(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMISSIONS_KEYS.enquiries() });
      qc.invalidateQueries({ queryKey: ADMISSIONS_KEYS.stats() });
      toast.success('Enquiry declined');
    },
    onError: () => toast.error('Failed to decline enquiry'),
  });
}
