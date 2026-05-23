// src/features/auth/api/auth.api.ts
import api from "@/config/axios";
import type {
  LoginPayload,
  LoginResponse,
  OtpVerifyPayload,
  OtpVerifyResponse,
} from "../types/auth.types";

// POST /tenant/userlogin
export const sendOtp = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/tenant/userlogin", payload);
  return data;
};

// POST /tenant/otpverify
export const verifyOtp = async (payload: OtpVerifyPayload): Promise<OtpVerifyResponse> => {
  const { data } = await api.post<OtpVerifyResponse>("/tenant/otpverify", payload);
  return data;
};
