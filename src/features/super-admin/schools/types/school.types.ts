export type Plan = "STARTER" | "GROWTH" | "PRO";
export type SchoolStatus = "ACTIVE" | "TRIAL" | "SUSPENDED" | "EXPIRED";

export interface School {
  id: string;
  name: string;
  email:string;
  city: string;
 
  phone: string;
  address: string;
  state: string;
  plan: Plan;
  status: SchoolStatus;
  students: number;
  subscriptionExpiry: string; // ISO date string
  teacherCount: number;
  subscriptionPlan: Plan;
  studentCount: number;
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

export interface GetAllSchoolsResponse {
  data: School[];
  total: number;
}

export interface SchoolFormValues {
  school_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  board: string;
  website: string;
  address: string;
  whatsappNumber: string;
  school_code: string;
  image: string;
  logo: string;
}