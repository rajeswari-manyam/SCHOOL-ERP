export type PlanType = 'Pro' | 'Growth' | 'Starter';
export type PaymentStatus = 'Active' | 'Overdue' | 'Pending' | 'Expiring' | 'Suspended';
export type TabKey = 'revenue' | 'subscriptions' | 'plan-config';

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

// ─── API Shapes ───────────────────────────────────────────────────────────────

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

export interface OrganizationBillingPayload {
  School: string;
  Amount: number;
  PaymentDate: string;
  PaymentMode: string;
  Description: string;
}

export interface OrganizationBillingResponse {
  success: boolean;
  message: string;
}

export interface UpdatePlanPayload {
  institutionId: string;
  plan: PlanType;
}

// ─── Organization Schools ─────────────────────────────────────────────────────

export interface OrganizationSchool {
  school_name: string;
  school_code: string;
}

export interface OrganizationSchoolsResponse {
  schools: OrganizationSchool[];
}

// ─── Subscription Plans ────────────────────────────────────────────────────────

export interface SubscriptionFeatures {
  attendance: boolean;
  feeManagement: boolean;
  reports: boolean;
  broadcast: boolean;
  admission: boolean;
  parentApp: boolean;
  onlinePayment: boolean;
}

export type SubscriptionBillingCycle = "MONTHLY" | "ANNUAL";

export interface Subscription {
  id: string;
  name: string;
  type: string;
  billingCycle: SubscriptionBillingCycle;
  annualPrice: number;
  monthlyPrice: number;
  studentLimit: number;
  pilotFee: number;
  featureFlags: SubscriptionFeatures;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionApiResponse {
  status: boolean;
  message: string;
  data: Subscription | Subscription[];
}

export interface CreateSubscriptionPayload {
  name: string;
  type: string;
  billingCycle: SubscriptionBillingCycle;
  annualPrice: number;
  monthlyPrice: number;
  studentLimit: number;
  pilotFee: number;
  featureFlags: SubscriptionFeatures;
}

export type UpdateSubscriptionPayload = CreateSubscriptionPayload;

// ─── Subscription Payments ─────────────────────────────────────────────────────

export type SubscriptionPaymentMode = "RAZORPAY" | "BANK_TRANSFER" | "CASH" | "CHEQUE" | "UPI";

export interface SubscriptionPaymentPayload {
  amount: number;
  schoolId: string;
  paymentMode: SubscriptionPaymentMode;
  paymentDate: string; // YYYY-MM-DD
  razorpayPaymentId?: string;
  description?: string;
  renewed: boolean;
}

export interface SubscriptionPaymentRecord {
  id: string;
  amount: number;
  schoolId: string;
  paymentDate: string;
  paymentMode: SubscriptionPaymentMode;
  razorpayPaymentId?: string | null;
  description?: string | null;
  renewed: boolean;
  createdAt: string;
  updatedAt: string;
  school?: {
    id: string;
    school_name: string;
    city?: string;
  };
}

// ─── Schools by Subscription Status ────────────────────────────────────────────

export type SubscriptionStatusFilter = "TRIAL" | "PENDING" | "PAID" | "DUE" | "OVERDUE" | "SUSPENDED" | "CANCELLED";

export interface SchoolSubscriptionStatus {
  schoolId: string;
  schoolName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  subscriptionStatus: SubscriptionStatusFilter;
  planName: string;
  billingCycle: SubscriptionBillingCycle;
  lastPaymentDate: string | null;
  nextDueDate: string | null;
  isActive: boolean;
  lockedAt: string | null;
  lockedReason: string | null;
}

export interface SchoolSubscriptionDetail {
  id: string;
  school_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  subscriptionId: string;
  subscription_status: SubscriptionStatusFilter;
  is_active: boolean;
  last_payment_date: string | null;
  next_due_date: string | null;
  grace_period_days: number | null;
  locked_at: string | null;
  locked_reason: string | null;
  createdAt: string;
  subscription: Subscription;
  lastPayment: {
    amount: number;
    paymentDate: string;
    paymentMode: SubscriptionPaymentMode;
    billingCycle: SubscriptionBillingCycle;
    planName: string;
  } | null;
}

// ─── Revenue Overview ───────────────────────────────────────────────────────────

export interface RevenueOverviewKPI {
  totalMrr: number;
  arr: number;
  pendingRenewals: number;
  overduePayments: { count: number; totalAmount: number };
}

export interface MRRGrowthPoint {
  month: string; // e.g. "2026-07"
  revenue: number;
  paymentCount: number;
}

export interface RevenueByPlanItem {
  planName: string;
  schoolCount: number;
  paymentCount: number;
  totalRevenue: number;
}

export interface TopSchoolRevenue {
  schoolId: string;
  schoolName: string;
  email: string;
  schoolCode: string;
  status: SubscriptionStatusFilter;
  totalRevenue: number;
  paymentCount: number;
  lastPaymentDate: string | null;
}

export interface RevenueOverviewResponse {
  kpiCards: RevenueOverviewKPI;
  mrrGrowth: MRRGrowthPoint[];
  revenueByPlan: RevenueByPlanItem[];
  topSchools: TopSchoolRevenue[];
}