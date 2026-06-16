import api from '@/config/axios';
import type {
  BillingOverview,
  MRRHistoryResponse,
  RevenueByPlanResponse,
  TopInstitutionsResponse,
  InstitutionsListResponse,
  InstitutionFilters,
  RecordPaymentPayload,
  UpdatePlanPayload,
  OrganizationBillingPayload,
  OrganizationBillingResponse,
  OrganizationSchoolsResponse,
  Institution,
} from '@/features/super-admin/billing/types/billing.types';

const BASE = '/api/super-admin/billing';

export const billingApi = {
  // ── Overview KPIs ──────────────────────────────────────────────────────────

  getOverview: async (): Promise<BillingOverview> => {
    const { data } = await api.get<BillingOverview>(`${BASE}/overview`);
    return data;
  },

  getMRRHistory: async (months = 6): Promise<MRRHistoryResponse> => {
    const { data } = await api.get<MRRHistoryResponse>(`${BASE}/mrr-history`, {
      params: { months },
    });
    return data;
  },

  getRevenueByPlan: async (): Promise<RevenueByPlanResponse> => {
    const { data } = await api.get<RevenueByPlanResponse>(`${BASE}/revenue-by-plan`);
    return data;
  },

  getTopInstitutions: async (limit = 5): Promise<TopInstitutionsResponse> => {
    const { data } = await api.get<TopInstitutionsResponse>(`${BASE}/top-institutions`, {
      params: { limit },
    });
    return data;
  },

  listInstitutions: async (filters: InstitutionFilters = {}): Promise<InstitutionsListResponse> => {
    const { data } = await api.get<InstitutionsListResponse>(
      `${BASE}/institutions`,
      { params: filters }
    );
    return data;
  },

  getInstitution: async (id: string): Promise<Institution> => {
    const { data } = await api.get<Institution>(`${BASE}/institutions/${id}`);
    return data;
  },

  // ── Organization / Schools ──────────────────────────────────────────────

  getOrganizationSchools: async (): Promise<OrganizationSchoolsResponse> => {
    const { data } = await api.get<OrganizationSchoolsResponse>(
      "/organization/getallschools"
    );
    console.log("[billingApi] getOrganizationSchools response:", data);
    return data;
  },

  // ── Payment Actions ──
  recordPayment: async (payload: RecordPaymentPayload): Promise<Institution> => {
    const { data } = await api.post<Institution>(`${BASE}/payments`, payload);
    return data;
  },

  recordOrganizationBilling: async (
    payload: OrganizationBillingPayload
  ): Promise<OrganizationBillingResponse> => {
    const { data } = await api.post<OrganizationBillingResponse>(
      "/organization/billing",
      payload
    );
    return data;
  },

  updatePlan: async (payload: UpdatePlanPayload): Promise<Institution> => {
    const { data } = await api.patch<Institution>(
      `${BASE}/institutions/${payload.institutionId}/plan`,
      { plan: payload.plan }
    );
    return data;
  },

  // ── Export ──
  exportInstitutionsCsv: async (filters: InstitutionFilters = {}): Promise<Blob> => {
    const { data } = await api.get(`${BASE}/institutions/export`, {
      params: filters,
      responseType: 'blob',
    });
    return data;
  },
};
