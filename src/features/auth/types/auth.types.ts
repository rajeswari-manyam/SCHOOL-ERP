export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    role: string;
  };
  token: string;
}

export interface LoginEmailPayload {
  email: string;
  password: string;
}

export interface LoginPhonePayload {
  phone: string;
}