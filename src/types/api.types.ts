// src/types/api.types.ts

export type Role = "superadmin" | "schooladmin" | "teacher" | "accountant" | "parent" | "student";

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: "success" | "error";
}