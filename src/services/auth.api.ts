// src/services/auth.api.ts  (also used as src/features/auth/api/auth.api.ts)
import api from "@/config/axios";
import type {
  LoginPayload,
  LoginResponse,
  OtpVerifyPayload,
  OtpVerifyResponse,
  LogoutResponse,
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

// ── POST /tenant/logout ─────────────────────────────────────────────────────────
export const logout = async (): Promise<LogoutResponse> => {
  const { data } = await api.post<LogoutResponse>("/tenant/logout");
  return data;
};


export const getUserById = async (userId: string): Promise<GetUserByIdResponse> => {
  const { data } = await api.get<GetUserByIdResponse>(
    `/tenant/getuserById/${userId}`,
    { _skipLogoutOn401: true } as object
  );
  return data;
};
