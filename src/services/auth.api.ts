// src/services/auth.api.ts  (also used as src/features/auth/api/auth.api.ts)
import api from "@/config/axios";
import type {
  LoginPayload,
  LoginResponse,
  OtpVerifyPayload,
  OtpVerifyResponse,
  GetUserByIdResponse,
} from "@/features/auth/types/auth.types";

// ── POST /tenant/userlogin ─────────────────────────────────────────────────────
export const sendOtp = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/tenant/userlogin", payload);
  return data;
};

// ── POST /tenant/otpverify ────────────────────────────────────────────────────
export const verifyOtp = async (
  payload: OtpVerifyPayload
): Promise<OtpVerifyResponse> => {
  const { data } = await api.post<OtpVerifyResponse>("/tenant/otpverify", payload);
  return data;
};

// ── GET /tenant/getuserById/:userId ───────────────────────────────────────────
// Called right after OTP verification for every user type (parent, teacher,
// student, admin, accountant).  The Axios instance automatically attaches the
// Bearer token via its request interceptor, so no extra header is needed here.
export const getUserById = async (userId: string): Promise<GetUserByIdResponse> => {
  const { data } = await api.get<GetUserByIdResponse>(
    `/tenant/getuserById/${userId}`
  );
  return data;
};
