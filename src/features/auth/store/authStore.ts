import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;


  schoolcode?: string;

  class_id?: string;
  section_id?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  userType: string | null;

  login: (token: string, user: User, userType: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  userType: null,

  login: (token, user, userType) =>
    set({
      token,
      user,
      userType,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      userType: null,
    }),
}));