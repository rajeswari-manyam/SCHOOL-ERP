// src/services/publicFeePayment.api.ts
//
// Parent side of fee payments (PAYMENTS_INTEGRATION_GUIDE.md §3.2) — no
// login, the token embedded in the link URL is the only credential. These
// calls are made from a public page a parent may open while logged out (or
// never logged in at all) elsewhere in the app, so every request is flagged
// `_skipLogoutOn401`: if the backend ever 401s here, the axios interceptor
// must NOT blow away an unrelated logged-in session in another tab and
// bounce this page to /login — there's no login concept on this page at all.
import api from "@/config/axios";
import { getErrorMessage } from "@/utils/getErrorMessage";

export type PublicFeePaymentStatus = "PENDING" | "PAID" | "EXPIRED" | "CANCELLED";

export interface PublicFeePaymentLink {
  status: PublicFeePaymentStatus;
  schoolName: string;
  studentName: string;
  feeName: string;
  amount: number;
  currency: string;
  expiresAt: string;
}

export interface PublicCreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface PublicVerifyPaymentResponse {
  receiptNo?: string;
  amount?: number;
  alreadyProcessed?: boolean;
}

const unwrap = <T>(data: { status: boolean; message?: string; data: T }): T => {
  if (!data?.status) throw new Error(data?.message ?? "Request failed");
  return data.data;
};

export const publicFeePaymentApi = {
  getLink: async (token: string): Promise<PublicFeePaymentLink> => {
    try {
      const { data } = await api.get(`/public/fee-payment/${token}`, { _skipLogoutOn401: true } as object);
      return unwrap(data);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Couldn't load this payment link"));
    }
  },

  createOrder: async (token: string): Promise<PublicCreateOrderResponse> => {
    try {
      const { data } = await api.post(`/public/fee-payment/${token}/create-order`, undefined, { _skipLogoutOn401: true } as object);
      return unwrap(data);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Couldn't start the payment"));
    }
  },

  verify: async (
    token: string,
    payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }
  ): Promise<PublicVerifyPaymentResponse> => {
    try {
      const { data } = await api.post(`/public/fee-payment/${token}/verify`, payload, { _skipLogoutOn401: true } as object);
      return unwrap(data);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Couldn't confirm the payment"));
    }
  },
};
