
import api from "@/config/axios";
import { getErrorMessage } from "@/utils/getErrorMessage";

export type FeePaymentLinkStatus = "PENDING" | "PAID" | "EXPIRED" | "CANCELLED";

export interface CreatePaymentLinkPayload {
  student_id: string;
  /** Exactly one of these three must be given. */
  feeHeadMappingId?: string;
  transportfeeId?: string;
  feeConcessionId?: string;
  /** Defaults to the full remaining balance when omitted. */
  amount?: number;
  academicYearId?: string;
  /** Overrides the default 72-hour expiry for this one link. */
  expiresInHours?: number;
}

export interface CreatePaymentLinkResponse {
  id: string;
  token: string;
  url: string;
  amount: number;
  feeName: string;
  expiresAt: string;
}

export interface FeePaymentLinkRecord {
  id: string;
  token: string;
  studentId: string;
  studentName: string;
  feeName: string;
  feeType: string;
  amount: number;
  currency: string;
  status: FeePaymentLinkStatus;
  expiresAt: string;
  razorpayPaymentId: string | null;
  createdAt: string;
}

const unwrap = <T>(data: { status: boolean; message?: string; data: T }): T => {
  if (!data?.status) throw new Error(data?.message ?? "Request failed");
  return data.data;
};

export const feePaymentLinkApi = {
  create: async (payload: CreatePaymentLinkPayload): Promise<CreatePaymentLinkResponse> => {
    try {
      const { data } = await api.post("/tenant/createpaymentlink", payload);
      return unwrap(data);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Failed to create payment link"));
    }
  },

  getByStudent: async (studentId: string): Promise<FeePaymentLinkRecord[]> => {
    try {
      const { data } = await api.get(`/tenant/getpaymentlinksbystudent/${studentId}`);
      return unwrap(data) ?? [];
    } catch (err) {
      throw new Error(getErrorMessage(err, "Failed to load payment link history"));
    }
  },

  cancel: async (id: string): Promise<void> => {
    try {
      await api.put(`/tenant/cancelpaymentlink/${id}`);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Failed to cancel payment link"));
    }
  },
};
