import type { AuthResponse, LoginEmailPayload, LoginPhonePayload } from "../types/auth.types";

const MOCK_USER: AuthResponse = {
  user: { id: "1", name: "Test User", role: "parent" },
  token: "mock-token-abc123",
};

export const verifyOtpMock = async (otp: string): Promise<AuthResponse> => {
  await new Promise((r) => setTimeout(r, 800));
  if (otp !== "123456") throw new Error("Invalid OTP");
  return MOCK_USER;
};

export const loginWithEmail = async (_data: LoginEmailPayload): Promise<AuthResponse> => {
  await new Promise((r) => setTimeout(r, 800));
  return MOCK_USER;
};

export const loginWithPhone = async (_data: LoginPhonePayload): Promise<AuthResponse> => {
  await new Promise((r) => setTimeout(r, 800));
  return MOCK_USER;
};