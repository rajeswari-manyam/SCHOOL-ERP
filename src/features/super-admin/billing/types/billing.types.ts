export type PlanType = 'Pro' | 'Growth' | 'Starter';
export type PaymentStatus = 'Active' | 'Overdue' | 'Pending' | 'Expiring' | 'Suspended';
export type TabKey = 'revenue' | 'subscriptions' | 'invoices' | 'plan-config';

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface Institution {
  id: string;
  name: string;
  city: string;
  state: string;
  plan: PlanType;
  status: PaymentStatus;
  mrr: number;
  totalStudents: number;
  adminEmail: string;
  adminName: string;
  subscriptionStart: string; // ISO date
  subscriptionEnd: string;   // ISO date
  lastPaymentDate: string;   // ISO date
  outstandingAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MRRDataPoint {
  month: string;      // e.g. "Nov"
  isoMonth: string;   // e.g. "2024-11"
  mrr: number;
}

export interface PlanRevenue {
  plan: PlanType;
  amount: number;
  percentage: number;
  institutionCount: number;
}

// ─── API Shapes ───────────────────────────────────────────────────────────────

export interface BillingOverview {
  totalMRR: number;
  mrrGrowthPercent: number;
  arr: number;
  pendingRenewals: number;
  overduePayments: number;
}

export interface MRRHistoryResponse {
  data: MRRDataPoint[];
  periodStart: string;
  periodEnd: string;
}

export interface RevenueByPlanResponse {
  totalMRR: number;
  breakdown: PlanRevenue[];
}

export interface TopInstitutionsResponse {
  data: TopInstitution[];
}

export interface TopInstitution {
  id: string;
  name: string;
  plan: PlanType;
  monthlyValue: number;
  mrrPercent: number;
}

export interface InstitutionsListResponse {
  data: Institution[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Filter / Param Shapes ────────────────────────────────────────────────────

export interface InstitutionFilters {
  search?: string;
  plan?: PlanType | '';
  status?: PaymentStatus | '';
  sortBy?: 'mrr' | 'name' | 'subscriptionEnd' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface RecordPaymentPayload {
  institutionId: string;
  amount: number;
  paymentDate: string;
  notes?: string;
}

export interface UpdatePlanPayload {
  institutionId: string;
  plan: PlanType;
}