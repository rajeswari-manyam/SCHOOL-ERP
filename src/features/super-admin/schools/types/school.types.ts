export type Plan = "STARTER" | "GROWTH" | "PRO";
export type SchoolStatus = "ACTIVE" | "TRIAL" | "SUSPENDED" | "EXPIRED";

export interface School {
  id: string;
  name: string;
  city: string;
  plan: Plan;
  status: SchoolStatus;
  students: number;
  subscriptionEnd: string; // ISO date string
  lastActive: string;      // relative string e.g. "2 hours ago"
  initials: string;
  avatarColor: string;
}

export interface SchoolFilters {
  search: string;
  plan: Plan | "ALL";
  status: SchoolStatus | "ALL";
  city: string;
  page: number;
  pageSize: number;
}

export interface SchoolsResponse {
  data: School[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SchoolFormValues {
  name: string;
  city: string;
  plan: Plan;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  subscriptionEnd: string;
}