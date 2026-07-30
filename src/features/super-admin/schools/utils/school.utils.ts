import { formatDistanceToNowStrict, addYears } from "date-fns";
import type { Plan, SchoolStatus, RawSchoolApiRecord, School, SchoolDetailRecord, SchoolFormValues, SchoolUpdatePayload } from "../types/school.types";

const PLAN_VALUES: Plan[] = ["STARTER", "GROWTH", "PRO"];

const derivePlan = (raw: RawSchoolApiRecord): Plan => {
  const type = raw.subscription?.type?.toUpperCase();
  return (PLAN_VALUES as string[]).includes(type ?? "") ? (type as Plan) : "STARTER";
};

// Real subscription/billing status is now tracked on the school record —
// locked_at / is_active take priority over subscription_status since they
// reflect the platform's own enforcement, not just the billing state.
const deriveStatus = (raw: RawSchoolApiRecord): SchoolStatus => {
  if (raw.locked_at) return "SUSPENDED";
  if (raw.is_active === false) return "SUSPENDED";
  switch ((raw.subscription_status ?? "").toUpperCase()) {
    case "ACTIVE": return "ACTIVE";
    case "PENDING": return "TRIAL";
    case "EXPIRED": return "EXPIRED";
    case "SUSPENDED": return "SUSPENDED";
    default: return "ACTIVE";
  }
};

export const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

const AVATAR_COLORS = ["indigo", "blue", "green", "amber", "red", "purple"];

const getInitials = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "SC";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const getAvatarColor = (seed: string) => {
  const hash = seed.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

export const mapApiSchoolToSchool = (raw: RawSchoolApiRecord): School => {
  const createdAt = raw.createdAt ? new Date(raw.createdAt) : new Date();
  const subscriptionEnd = raw.next_due_date ?? addYears(createdAt, 1).toISOString();
  const plan = derivePlan(raw);
  return {
    id: raw.id,
    name: raw.school_name,
    email: raw.email,
    city: (raw.city ?? "").trim(),
    phone: raw.phone,
    address: raw.address,
    state: (raw.state ?? "").trim(),
    plan,
    status: deriveStatus(raw),
    students: raw.totalSchoolstrength ?? 0,
    subscriptionExpiry: subscriptionEnd,
    teacherCount: 0,
    subscriptionPlan: plan,
    studentCount: raw.totalSchoolstrength ?? 0,
    subscriptionEnd,
    lastActive: raw.updatedAt ? formatDistanceToNowStrict(new Date(raw.updatedAt), { addSuffix: true }) : "—",
    initials: getInitials(raw.school_name),
    avatarColor: getAvatarColor(raw.school_name || raw.id),
  };
};

export const mapSchoolDetailToFormValues = (raw: SchoolDetailRecord): Partial<SchoolFormValues> => ({
  school_name: raw.school_name ?? "",
  email: raw.email ?? "",
  phone: raw.phone ?? "",
  schoolNumber: raw.schoolNumber ?? "",
  city: (raw.city ?? "").trim(),
  state: (raw.state ?? "").trim(),
  pincode: (raw.pincode ?? "").trim(),
  board: (raw.board ?? "").trim(),
  website: (raw.website ?? "").trim(),
  address: raw.address ?? "",
  whatsappNumber: raw.whatsappNumber ?? "",
  school_code: raw.school_code ?? "",
  PrincipalName: raw.PrincipalName ?? "",
  establishedYear: raw.establishedYear ? String(raw.establishedYear) : "",
  totalSchoolstrength: raw.totalSchoolstrength ? String(raw.totalSchoolstrength) : "",
  subscriptionId: raw.subscriptionId ?? "",
});

// school_code and the photo fields are excluded — the update endpoint takes
// a plain JSON body of editable text fields only.
export const buildSchoolUpdatePayload = (form: SchoolFormValues): SchoolUpdatePayload => ({
  school_name: form.school_name,
  email: form.email,
  phone: form.phone,
  schoolNumber: form.schoolNumber,
  city: form.city,
  state: form.state,
  pincode: form.pincode,
  board: form.board,
  website: form.website,
  address: form.address,
  whatsappNumber: form.whatsappNumber,
  PrincipalName: form.PrincipalName,
  establishedYear: form.establishedYear,
  totalSchoolstrength: form.totalSchoolstrength,
  subscriptionId: form.subscriptionId,
});

export const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800";
    case "suspended": return "bg-red-100 text-red-800";
    case "pending": return "bg-yellow-100 text-yellow-800";
    default: return "bg-gray-100 text-gray-800";
  }
};
