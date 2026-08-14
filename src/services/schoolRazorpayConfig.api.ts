// src/services/schoolRazorpayConfig.api.ts
//
// A school's own Razorpay account, used to collect PARENT fee payments (see
// PAYMENTS_INTEGRATION_GUIDE.md §3.0) — separate from the platform's own
// Razorpay account used for subscription billing (schoolBilling.api.ts).
//
// The backend authorizes these two calls by checking the token's
// `organization_id` against the `:id` in the URL, so the frontend must pass
// its own school id explicitly rather than relying on the token alone.
import api from "@/config/axios";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { getAuthToken } from "@/store/authStore";
import { getOrganizationIdFromToken } from "@/utils/jwt";

export interface RazorpayConfigStatus {
  configured: boolean;
  webhookConfigured: boolean;
  razorpayKeyId: string | null;
}

export interface SaveRazorpayConfigPayload {
  razorpayKeyId: string;
  razorpayKeySecret: string;
  /** Optional — can be added later without resending the other two fields. */
  razorpayWebhookSecret?: string;
}

export interface SaveRazorpayConfigResponse {
  razorpayKeyId: string;
  webhookConfigured: boolean;
}

/** The school's own row id, read from the `organization_id` claim baked into its auth token. */
export function getCurrentSchoolId(): string | null {
  return getOrganizationIdFromToken(getAuthToken());
}

const unwrap = <T>(data: { status: boolean; message?: string; data: T }): T => {
  if (!data?.status) throw new Error(data?.message ?? "Request failed");
  return data.data;
};

export const schoolRazorpayConfigApi = {
  getStatus: async (schoolId: string): Promise<RazorpayConfigStatus> => {
    try {
      const { data } = await api.get(`/organization/school/${schoolId}/razorpay-config`);
      return unwrap(data);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Failed to load payment gateway settings"));
    }
  },

  save: async (schoolId: string, payload: SaveRazorpayConfigPayload): Promise<SaveRazorpayConfigResponse> => {
    try {
      const { data } = await api.put(`/organization/school/${schoolId}/razorpay-config`, payload);
      return unwrap(data);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Failed to save payment gateway settings"));
    }
  },
};
