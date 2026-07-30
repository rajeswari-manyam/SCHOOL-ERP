import api from '@/config/axios';
import type {
  RevenueOverviewResponse,
  InstitutionsListResponse,
  InstitutionFilters,
  RecordPaymentPayload,
  UpdatePlanPayload,
  OrganizationBillingPayload,
  OrganizationBillingResponse,
  OrganizationSchoolsResponse,
  Institution,
  SubscriptionApiResponse,
  CreateSubscriptionPayload,
  UpdateSubscriptionPayload,
  SubscriptionPaymentPayload,
  SubscriptionPaymentRecord,
  SubscriptionStatusFilter,
  SchoolSubscriptionStatus,
  SchoolSubscriptionDetail,
} from '@/features/super-admin/billing/types/billing.types';

const BASE = '/api/super-admin/billing';

export const billingApi = {
  // ── Overview KPIs ──────────────────────────────────────────────────────────

  getRevenueOverview: async (): Promise<RevenueOverviewResponse> => {
    try {
      const { data } = await api.get('/organization/revenue-overview');
      return data?.data ?? data;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to load revenue overview";
      throw new Error(message);
    }
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

  // ── Subscription Plans ───────────────────────────────────────────────────────

  getAllSubscriptions: async (): Promise<SubscriptionApiResponse> => {
    const { data } = await api.get<SubscriptionApiResponse>(
      '/organization/getallsubscriptions'
    );
    return data;
  },

  getSubscriptionById: async (id: string): Promise<SubscriptionApiResponse> => {
    const { data } = await api.get<SubscriptionApiResponse>(
      `/organization/getsubscriptionById/${id}`
    );
    return data;
  },

  createSubscription: async (
    payload: CreateSubscriptionPayload
  ): Promise<SubscriptionApiResponse> => {
    const { data } = await api.post<SubscriptionApiResponse>(
      '/organization/subscription',
      payload
    );
    return data;
  },

  updateSubscription: async (
    id: string,
    payload: UpdateSubscriptionPayload
  ): Promise<SubscriptionApiResponse> => {
    const { data } = await api.put<SubscriptionApiResponse>(
      `/organization/updatesubscriptionById/${id}`,
      payload
    );
    return data;
  },

  deleteSubscription: async (id: string): Promise<void> => {
    await api.delete(`/organization/deletesubscriptionById/${id}`);
  },

  // ── Subscription Payments ───────────────────────────────────────────────────

  recordSubscriptionPayment: async (payload: SubscriptionPaymentPayload): Promise<SubscriptionPaymentRecord> => {
    try {
      const { data } = await api.post('/organization/subscription-payment', payload);
      return data?.data ?? data;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to record payment";
      throw new Error(message);
    }
  },

  getAllSubscriptionPayments: async (): Promise<SubscriptionPaymentRecord[]> => {
    const { data } = await api.get('/organization/getallsubscriptionpayments');
    return Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  },

  getSubscriptionPaymentById: async (id: string): Promise<SubscriptionPaymentRecord> => {
    const { data } = await api.get(`/organization/getsubscriptionpaymentById/${id}`);
    return data?.data ?? data;
  },

  updateSubscriptionPayment: async (id: string, payload: Partial<SubscriptionPaymentPayload>): Promise<SubscriptionPaymentRecord> => {
    try {
      const { data } = await api.put(`/organization/updatesubscriptionpaymentById/${id}`, payload);
      return data?.data ?? data;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to update payment";
      throw new Error(message);
    }
  },

  getSubscriptionPaymentsBySchool: async (schoolId: string): Promise<SubscriptionPaymentRecord[]> => {
    const { data } = await api.get(`/organization/getsubscriptionpaymentsBySchool/${schoolId}`);
    return Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  },

  deleteSubscriptionPayment: async (id: string): Promise<void> => {
    try {
      await api.delete(`/organization/deletesubscriptionpaymentById/${id}`);
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to delete payment";
      throw new Error(message);
    }
  },

  // ── Schools by Subscription Status ──────────────────────────────────────────

  getSchoolsBySubscriptionStatus: async (status: SubscriptionStatusFilter): Promise<SchoolSubscriptionStatus[]> => {
    try {
      const { data } = await api.get(`/organization/subscription-status/${status}`);
      return Array.isArray(data?.data) ? data.data : [];
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to load schools";
      throw new Error(message);
    }
  },

  getSchoolSubscriptionDetail: async (schoolId: string): Promise<SchoolSubscriptionDetail> => {
    try {
      const { data } = await api.get(`/organization/school-subscription-detail/${schoolId}`);
      return data?.data ?? data;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to load subscription detail";
      throw new Error(message);
    }
  },

  downloadSubscriptionPaymentReceipt: async (paymentId: string): Promise<Blob> => {
    try {
      const { data } = await api.get(`/organization/subscriptionpaymentsdownload/${paymentId}`, {
        responseType: 'blob',
      });
      return data;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to download receipt";
      throw new Error(message);
    }
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
