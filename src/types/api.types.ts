// src/types/api.types.ts

export type Role = "super_admin" | "school_admin" | "teacher" | "accountant" | "parent" | "student";

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: "success" | "error";
}