export interface School {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  status: "active" | "suspended" | "pending";
  subscriptionPlan: "basic" | "premium" | "enterprise";
  subscriptionExpiry: string;
  createdAt: string;
  studentCount: number;
  teacherCount: number;
}

export interface CreateSchoolInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  subscriptionPlan: "basic" | "premium" | "enterprise";
}

export interface UpdateSchoolInput extends Partial<CreateSchoolInput> {
  status?: "active" | "suspended" | "pending";
}

export interface SchoolFilters {
  status?: "active" | "suspended" | "pending";
  search?: string;
}
