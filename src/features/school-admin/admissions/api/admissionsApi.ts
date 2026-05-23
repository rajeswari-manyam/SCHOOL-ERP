import api from '@/config/axios';
import type {
  Enquiry,
  PipelineStage,
  NewEnquiryFormData,
  ConfirmAdmissionFormData,
  PipelineStats,
} from '../types';

export const admissionsApi = {
  async getEnquiries(): Promise<Enquiry[]> {
    const { data } = await api.get<Enquiry[]>('/tenant/admissions/enquiries');
    return data;
  },

  async getEnquiryById(id: string): Promise<Enquiry | null> {
    try {
      const { data } = await api.get<Enquiry>(`/tenant/admissions/enquiries/${id}`);
      return data;
    } catch {
      return null;
    }
  },

  async getPipelineStats(): Promise<PipelineStats> {
    const { data } = await api.get<PipelineStats>('/tenant/admissions/stats');
    return data;
  },

  async addEnquiry(input: NewEnquiryFormData): Promise<Enquiry> {
    try {
      const { data } = await api.post<Enquiry>('/tenant/createadmissions', input);
      console.log('createEnquiry success', {
        url: '/tenant/createadmissions',
        payload: input,
        response: data,
      });
      return data;
    } catch (err: any) {
      console.error('createEnquiry failed', {
        url: '/tenant/createadmissions',
        payload: input,
        response: err?.response?.data ?? err?.message,
      });
      const message =
        err?.response?.data?.message ??
        JSON.stringify(err?.response?.data) ??
        err?.message ??
        'Failed to create enquiry';
      throw new Error(message);
    }
  },

  async moveToStage(id: string, stage: PipelineStage): Promise<Enquiry> {
    try {
      const { data } = await api.patch<Enquiry>(`/tenant/admissions/enquiries/${id}/move`, { stage });
      console.log('moveToStage success', { id, stage, response: data });
      return data;
    } catch (err: any) {
      console.error('moveToStage failed', {
        id,
        stage,
        response: err?.response?.data ?? err?.message,
      });
      const message =
        err?.response?.data?.message ??
        JSON.stringify(err?.response?.data) ??
        err?.message ??
        'Failed to move enquiry';
      throw new Error(message);
    }
  },

  async confirmAdmission(id: string, input: ConfirmAdmissionFormData): Promise<Enquiry> {
    try {
      const { data } = await api.post<Enquiry>(`/tenant/admissions/enquiries/${id}/confirm`, input);
      console.log('confirmAdmission success', { id, payload: input, response: data });
      return data;
    } catch (err: any) {
      console.error('confirmAdmission failed', {
        id,
        payload: input,
        response: err?.response?.data ?? err?.message,
      });
      const message =
        err?.response?.data?.message ??
        JSON.stringify(err?.response?.data) ??
        err?.message ??
        'Failed to confirm admission';
      throw new Error(message);
    }
  },

  async declineEnquiry(id: string, reason: string): Promise<Enquiry> {
    try {
      const { data } = await api.post<Enquiry>(`/tenant/admissions/enquiries/${id}/decline`, { reason });
      console.log('declineEnquiry success', { id, reason, response: data });
      return data;
    } catch (err: any) {
      console.error('declineEnquiry failed', {
        id,
        reason,
        response: err?.response?.data ?? err?.message,
      });
      const message =
        err?.response?.data?.message ??
        JSON.stringify(err?.response?.data) ??
        err?.message ??
        'Failed to decline enquiry';
      throw new Error(message);
    }
  },
};
