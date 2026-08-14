// src/services/schoolBilling.api.ts
//
// Subscription billing — the school admin paying the PLATFORM (Fyndo) for
// its own subscription. See PAYMENTS_INTEGRATION_GUIDE.md §2. Scoped by the
// school admin's normal bearer token; the backend derives the school from
// `organization_id` in the token, so none of these calls take an id param.
//
// Not to be confused with services/billing.api.ts, which is the
// super-admin's view over every school's billing (manual recording,
// institution list, etc.) against a completely different Razorpay account.
import api from "@/config/axios";
import { getErrorMessage } from "@/utils/getErrorMessage";

export interface PricingTier {
  id: string;
  name: string;
  durationMonths: number;
  basePrice: number;
  discountPercent: number;
  /** basePrice with discountPercent already applied — what a school actually pays with no promo code. */
  price: number;
}

export interface AutopayStatus {
  status: string;
  pricingPlanName?: string;
  razorpaySubscriptionId: string;
}

export interface BillingStatus {
  status: string;
  isActive: boolean;
  isTrial: boolean;
  nextDueDate: string | null;
  daysRemaining: number | null;
  pricingTiers: PricingTier[];
  autopay: AutopayStatus | null;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  pricingPlan: { id: string; name: string; durationMonths: number };
  discountApplied: number;
}

export interface VerifyPaymentResponse {
  nextDueDate: string | null;
  subscriptionStatus: string;
  discountApplied: number;
}

export interface CreateAutopayResponse {
  razorpaySubscriptionId: string;
  keyId: string;
}

export interface VerifyAutopayResponse {
  nextDueDate: string | null;
}

export interface ValidatePromoResponse {
  valid: boolean;
  discountApplied: number;
  amount: number;
}

const unwrap = <T>(data: { status: boolean; message?: string; data: T }): T => {
  if (!data?.status) throw new Error(data?.message ?? "Request failed");
  return data.data;
};

export const schoolBillingApi = {
  getStatus: async (): Promise<BillingStatus> => {
    try {
      const { data } = await api.get("/organization/billing/status");
      return unwrap(data);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Failed to load billing status"));
    }
  },

  // Open — safe to call before the school admin has ever logged in (a pricing page).
  getPricingPlans: async (): Promise<PricingTier[]> => {
    try {
      const { data } = await api.get("/organization/pricing-plans");
      return unwrap(data);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Failed to load pricing plans"));
    }
  },

  createOrder: async (pricingPlanId: string, promoCode?: string): Promise<CreateOrderResponse> => {
    try {
      const { data } = await api.post("/organization/billing/create-order", { pricingPlanId, promoCode });
      return unwrap(data);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Failed to start checkout"));
    }
  },

  verifyPayment: async (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    pricingPlanId: string;
    promoCode?: string;
  }): Promise<VerifyPaymentResponse> => {
    try {
      const { data } = await api.post("/organization/billing/verify-payment", payload);
      return unwrap(data);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Payment verification failed"));
    }
  },

  validatePromo: async (code: string, pricingPlanId: string): Promise<ValidatePromoResponse> => {
    try {
      const { data } = await api.post("/organization/billing/validate-promo", { code, pricingPlanId });
      return unwrap(data);
    } catch (err) {
      throw new Error(getErrorMessage(err, "That promo code isn't valid"));
    }
  },

  createAutopay: async (pricingPlanId: string): Promise<CreateAutopayResponse> => {
    try {
      const { data } = await api.post("/organization/billing/create-autopay", { pricingPlanId });
      return unwrap(data);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Failed to set up autopay"));
    }
  },

  verifyAutopay: async (payload: {
    razorpay_payment_id: string;
    razorpay_subscription_id: string;
    razorpay_signature: string;
  }): Promise<VerifyAutopayResponse> => {
    try {
      const { data } = await api.post("/organization/billing/verify-autopay", payload);
      return unwrap(data);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Autopay verification failed"));
    }
  },

  cancelAutopay: async (): Promise<void> => {
    try {
      await api.post("/organization/billing/cancel-autopay");
    } catch (err) {
      throw new Error(getErrorMessage(err, "Failed to cancel autopay"));
    }
  },
};
