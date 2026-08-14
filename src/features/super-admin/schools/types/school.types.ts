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
  schoolNumber: string;
  city: string;
  state: string;
  pincode: string;
  board: string;
  website: string;
  address: string;
  whatsappNumber: string;
  school_code: string;
  PrincipalName: string;
  establishedYear: string;
  totalSchoolstrength: string;
  subscriptionId: string;
  image: File | null;
  logo: File | null;
  principalPhoto: File | null;
}

export interface SubscriptionSummary {
  id: string;
  name: string;
  type: string;
  annualPrice: number;
  monthlyPrice: number;
  studentLimit: number;
  pilotFee: number;
  featureFlags: Record<string, boolean>;
}

// Raw shape returned by GET /organization/getallschooldetails
export interface RawSchoolApiRecord {
  id: string;
  school_name: string;
  email: string;
  phone: string;
  schoolNumber?: string | null;
  city: string;
  state: string;
  pincode: string;
  board: string;
  address: string;
  whatsappNumber: string;
  image: string | null;
  website: string | null;
  logo: string | null;
  principalphoto?: string | null;
  PrincipalName: string | null;
  establishedYear: number | null;
  totalSchoolstrength: number | null;
  subscriptionId?: string | null;
  subscription?: SubscriptionSummary | null;
  subscription_status?: string | null;
  grace_period_days?: number | null;
  is_active?: boolean;
  last_payment_date?: string | null;
  next_due_date?: string | null;
  locked_at?: string | null;
  locked_reason?: string | null;
  db_name: string;
  school_code: string;
  createdAt: string;
  updatedAt: string;
  // Present on GET /organization/getschooldetails/:id — only ever used to
  // derive a "configured?" badge (see SchoolDetailModal). Never render the
  // encrypted secret values themselves in the UI.
  razorpayKeyId?: string | null;
  razorpayKeySecretEnc?: string | null;
  razorpayWebhookSecretEnc?: string | null;
}

// Raw shape returned by GET /organization/getschooldetails/:id
export type SchoolDetailRecord = RawSchoolApiRecord;

// Body accepted by PUT /organization/updateSchool/:id — plain JSON, school_code/files are immutable here
export type SchoolUpdatePayload = Partial<{
  school_name: string;
  email: string;
  phone: string;
  schoolNumber: string;
  city: string;
  state: string;
  pincode: string;
  board: string;
  website: string;
  address: string;
  whatsappNumber: string;
  PrincipalName: string;
  establishedYear: string;
  totalSchoolstrength: string;
  subscriptionId: string;
}>;