import axios from 'axios';
import type {
  BillingOverview,
  MRRHistoryResponse,
  RevenueByPlanResponse,
  TopInstitutionsResponse,
  InstitutionsListResponse,
  InstitutionFilters,
  RecordPaymentPayload,
  UpdatePlanPayload,
  Institution,
} from '../types/billing.types';

const BASE = '/api/super-admin/billing';

export const billingApi = {
  // ── Overview KPIs ──────────────────────────────────────────────────────────

  getOverview: async (): Promise<BillingOverview> => {
    const { data } = await axios.get<BillingOverview>(`${BASE}/overview`);
    return data;
  },

  // ── Revenue Charts ─────────────────────────────────────────────────────────

  getMRRHistory: async (months = 6): Promise<MRRHistoryResponse> => {
    const { data } = await axios.get<MRRHistoryResponse>(`${BASE}/mrr-history`, {
      params: { months },
    });
    return data;
  },

  getRevenueByPlan: async (): Promise<RevenueByPlanResponse> => {
    const { data } = await axios.get<RevenueByPlanResponse>(`${BASE}/revenue-by-plan`);
    return data;
  },

  // ── Top Institutions ───────────────────────────────────────────────────────

  getTopInstitutions: async (limit = 5): Promise<TopInstitutionsResponse> => {
    const { data } = await axios.get<TopInstitutionsResponse>(`${BASE}/top-institutions`, {
      params: { limit },
    });
    return data;
  },

  // ── Institutions List (full) ───────────────────────────────────────────────

  listInstitutions: async (
    filters: InstitutionFilters = {}
  ): Promise<InstitutionsListResponse> => {
    const { data } = await axios.get<InstitutionsListResponse>(
      `${BASE}/institutions`,
      { params: filters }
    );
    return data;
  },

  getInstitution: async (id: string): Promise<Institution> => {
    const { data } = await axios.get<Institution>(`${BASE}/institutions/${id}`);
    return data;
  },

  // ── Payment Actions ────────────────────────────────────────────────────────

  recordPayment: async (payload: RecordPaymentPayload): Promise<Institution> => {
    const { data } = await axios.post<Institution>(`${BASE}/payments`, payload);
    return data;
  },

  updatePlan: async (payload: UpdatePlanPayload): Promise<Institution> => {
    const { data } = await axios.patch<Institution>(
      `${BASE}/institutions/${payload.institutionId}/plan`,
      { plan: payload.plan }
    );
    return data;
  },

  // ── Export ─────────────────────────────────────────────────────────────────

  exportInstitutionsCsv: async (filters: InstitutionFilters = {}): Promise<Blob> => {
    const { data } = await axios.get(`${BASE}/institutions/export`, {
      params: filters,
      responseType: 'blob',
    });
    return data;
  },
};