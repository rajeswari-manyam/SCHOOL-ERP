import api from "@/config/axios";
import { getAuthToken } from "@/store/authStore";
import type {
  SchoolProfile,
  AcademicYear,
  CreateAcademicYearPayload,
  ClassSection,
  WorkingDaysConfig,
  FeeHead,
  GradeFeeStructure,
  TransportSlab,
  FeeQuickInsights,
  UserAccount,
  RolePermission,
  WAConnection,
  WATemplate,
  NotificationSettings,
  ModulePermission,
  AddUserFormData,
  CreateClassPayload,
  CreateClassResponse,
} from "@/features/school-admin/settings/types/settings.types";
import {
  DEFAULT_ROLE_PERMISSIONS,
  ROLE_OPTIONS,
} from "@/features/school-admin/settings/utils/Settings.utils";

const MOCK_SCHOOL_PROFILE: SchoolProfile = {
  id: "school-001",
  schoolName: "Hanamkonda Public School",
  board: "CBSE",
  principalName: "Ramesh Kumar",
  establishedYear: 2008,
  phone: "+91 98765 43210",
  totalStudentCapacity: 500,
  email: "principal@hps.edu.in",
  schoolType: "Private Unaided",
  address: "Plot 45, Hanamkonda Urban, Warangal — 506001",
  logoUrl: undefined,
};

const MOCK_ACADEMIC_YEARS: AcademicYear[] = [
  { id: "ay-2025-26", yearName: "2025-2026", startDate: "2025-06-01", endDate: "2026-05-31", active: true },
];

const MOCK_CLASSES: ClassSection[] = [
  { id: "cls-6", className: "Class 6", sections: ["A", "B"], classTeacher: "Priya Reddy", totalStudents: 78, status: "ACTIVE" },
  { id: "cls-7", className: "Class 7", sections: ["A", "B"], classTeacher: "Kiran Kumar", totalStudents: 82, status: "ACTIVE" },
  { id: "cls-8", className: "Class 8", sections: ["A", "B"], classTeacher: "Suresh Varma", totalStudents: 75, status: "ACTIVE" },
];

const MOCK_WORKING_DAYS: WorkingDaysConfig = {
  activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  startTime: "8:30 AM",
  endTime: "3:30 PM",
  periodDuration: 45,
  numberOfPeriods: 7,
};

const MOCK_FEE_HEADS: FeeHead[] = [
  { id: "fh-1", feeName: "Tuition Fee", code: "TF001", mandatory: true, taxable: false, status: "Active" },
  { id: "fh-2", feeName: "Examination Fee", code: "EF001", mandatory: true, taxable: false, status: "Active" },
  { id: "fh-3", feeName: "Transport Fee", code: "TRP001", mandatory: false, taxable: false, status: "Active" },
  { id: "fh-4", feeName: "Activity Fee", code: "ACT001", mandatory: false, taxable: false, status: "Active" },
  { id: "fh-5", feeName: "Library Fee", code: "LIB001", mandatory: false, taxable: false, status: "Active" },
];

const makeGrade = (grade: string, tuition: number, exam: number, transport: number, activity: number): GradeFeeStructure => ({
  grade,
  components: [
    { id: `${grade}-t`, name: "Tuition", amount: tuition, frequency: "Monthly (10 Inst.)", dueDay: "5th", totalAnnual: tuition * 10 },
    { id: `${grade}-e`, name: "Exam", amount: exam, frequency: "Quarterly (4 Inst.)", dueDay: "1st", totalAnnual: exam * 4 },
    { id: `${grade}-tr`, name: "Transport", amount: transport, frequency: "Monthly (10 Inst.)", dueDay: "5th", totalAnnual: transport * 10 },
    { id: `${grade}-a`, name: "Activity", amount: activity, frequency: "Half-Yearly (2 Inst.)", dueDay: "1 June, 1 Dec", totalAnnual: activity * 2 },
  ],
  totalAnnualFees: tuition * 10 + exam * 4 + transport * 10 + activity * 2,
});

const MOCK_GRADE_FEE_STRUCTURES: GradeFeeStructure[] = [
  makeGrade("Grade 6", 6500, 1500, 1200, 1000),
  makeGrade("Grade 7", 7000, 1500, 1200, 1000),
  makeGrade("Grade 8", 7500, 1800, 1500, 1000),
  makeGrade("Grade 9", 8000, 2000, 1500, 1200),
  makeGrade("Grade 10", 8500, 2000, 1500, 1200),
];

const MOCK_TRANSPORT_SLABS: TransportSlab[] = [
  { id: "ts-a", slabName: "Slab A", rangeFrom: 0, rangeTo: 3, rateMonthly: 800, rateAnnual: 8000, studentCount: 24 },
  { id: "ts-b", slabName: "Slab B", rangeFrom: 3, rangeTo: 7, rateMonthly: 1200, rateAnnual: 12000, studentCount: 38 },
  { id: "ts-c", slabName: "Slab C", rangeFrom: 7, rangeTo: null, rateMonthly: 1500, rateAnnual: 15000, studentCount: 27 },
];

const MOCK_FEE_INSIGHTS: FeeQuickInsights = {
  projAnnualRevenue: "₹1.84 Cr",
  activeGrades: 12,
  collectedPercent: 78,
  pendingAmount: "₹42L",
};

const MOCK_ALL_USERS: UserAccount[] = [
  { id: "u1", fullName: "Ramesh Kumar", role: "Principal", mobileNumber: "+91 98765 43210", lastLogin: "Today 8:30 AM", status: "ACTIVE", permissions: DEFAULT_ROLE_PERMISSIONS["Principal"] },
  { id: "u2", fullName: "Ramu T", role: "Accountant", mobileNumber: "+91 87654 32109", lastLogin: "Yesterday", status: "ACTIVE", permissions: DEFAULT_ROLE_PERMISSIONS["Accountant"] },
  { id: "u3", fullName: "Priya Reddy", role: "Teacher", mobileNumber: "+91 76543 21098", lastLogin: "Today 9:00 AM", status: "ACTIVE", permissions: DEFAULT_ROLE_PERMISSIONS["Teacher"] },
  { id: "u4", fullName: "Kiran Kumar", role: "Teacher", mobileNumber: "+91 65432 10987", lastLogin: "2 hours ago", status: "ACTIVE", permissions: DEFAULT_ROLE_PERMISSIONS["Teacher"] },
  { id: "u5", fullName: "Anita V", role: "Admin Clerk", mobileNumber: "+91 54321 09876", lastLogin: "Today 8:45 AM", status: "ACTIVE", permissions: DEFAULT_ROLE_PERMISSIONS["Admin Clerk"] },
  { id: "u6", fullName: "Deepa S", role: "Teacher", mobileNumber: "+91 43210 98765", lastLogin: "Yesterday", status: "ACTIVE", permissions: DEFAULT_ROLE_PERMISSIONS["Teacher"] },
  { id: "u7", fullName: "Venkat R", role: "Teacher", mobileNumber: "+91 32109 87654", lastLogin: "Today 7:50 AM", status: "ACTIVE", permissions: DEFAULT_ROLE_PERMISSIONS["Teacher"] },
  { id: "u8", fullName: "Padma K", role: "Teacher", mobileNumber: "+91 21098 76543", lastLogin: "Today 8:10 AM", status: "ACTIVE", permissions: DEFAULT_ROLE_PERMISSIONS["Teacher"] },
];

// ─── School Profile ───────────────────────────────────────────────────────────

const getSchoolIdFromToken = (): string | null => {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(b64));
    return payload.school_id ?? payload.organization_id ?? null;
  } catch {
    return null;
  }
};

const mapApiToSchoolProfile = (school: Record<string, unknown>): SchoolProfile => ({
  id: String(school.id ?? ""),
  schoolName: String(school.school_name ?? school.name ?? ""),
  board: String(school.board ?? ""),
  principalName: String(school.PrincipalName ?? school.principal_name ?? ""),
  establishedYear: Number(school.establishedYear ?? school.established_year ?? 0),
  phone: String(school.phone ?? ""),
  totalStudentCapacity: Number(school.totalSchoolstrength ?? school.total_strength ?? 0),
  email: String(school.email ?? ""),
  schoolType: String(school.school_type ?? ""),
  address: String(school.address ?? ""),
  logoUrl: (school.logo ?? undefined) as string | undefined,
  adminImageUrl: (school.image ?? undefined) as string | undefined,
});

export const fetchSchoolProfile = async (): Promise<SchoolProfile> => {
  const schoolId = getSchoolIdFromToken();
  if (!schoolId) return MOCK_SCHOOL_PROFILE;
  try {
    const { data } = await api.get(`/organization/getschooldetails/${schoolId}`);
    const school = data?.school ?? data?.data ?? data;
    return mapApiToSchoolProfile(school as Record<string, unknown>);
  } catch {
    return MOCK_SCHOOL_PROFILE;
  }
};

export interface SchoolProfileFiles {
  /** New school logo — sent as the `logo` field. */
  logo?: File | null;
  /** New admin/principal photo — sent as the `image` field. */
  adminImage?: File | null;
}

export const updateSchoolProfile = async (
  profile: Partial<SchoolProfile>,
  files?: SchoolProfileFiles,
): Promise<SchoolProfile> => {
  const schoolId = getSchoolIdFromToken();
  if (!schoolId) throw new Error("Unable to determine school ID");

  const payload: Record<string, unknown> = {};
  if (profile.schoolName !== undefined) payload.school_name = profile.schoolName;
  if (profile.board !== undefined) payload.board = profile.board;
  if (profile.principalName !== undefined) payload.PrincipalName = profile.principalName;
  if (profile.establishedYear !== undefined) payload.establishedYear = profile.establishedYear;
  if (profile.phone !== undefined) payload.phone = profile.phone;
  if (profile.totalStudentCapacity !== undefined) payload.totalSchoolstrength = profile.totalStudentCapacity;
  if (profile.email !== undefined) payload.email = profile.email;
  if (profile.address !== undefined) payload.address = profile.address;
  // logoUrl / adminImageUrl are display-only fields derived from the server's
  // `logo` / `image` — never write them back as-is (they may be local
  // preview data URLs). Real new files are uploaded separately below.

  const logoFile = files?.logo;
  const adminImageFile = files?.adminImage;
  const hasFiles = logoFile instanceof File || adminImageFile instanceof File;

  const body: Record<string, unknown> | FormData = hasFiles
    ? Object.entries(payload).reduce((fd, [key, value]) => {
        if (value === undefined || value === null || value === "") return fd;
        fd.append(key, String(value));
        return fd;
      }, new FormData())
    : payload;
  if (hasFiles) {
    if (logoFile instanceof File) (body as FormData).append("logo", logoFile);
    if (adminImageFile instanceof File) (body as FormData).append("image", adminImageFile);
  }

  try {
    const { data } = await api.put(
      `/organization/updateSchool/${schoolId}`,
      body,
      hasFiles ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
    );
    const school = data?.school ?? data?.data ?? data;
    return mapApiToSchoolProfile(school as Record<string, unknown>);
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err?.message ?? "Failed to update school profile";
    throw new Error(message);
  }
};

// ─── Academic Year ────────────────────────────────────────────────────────────

export const fetchAcademicYears = async (): Promise<AcademicYear[]> => {
  try {
    const { data } = await api.get<{ status: boolean; data: AcademicYear[] }>("/tenant/getallacademicyears");
    if (data?.status && Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return MOCK_ACADEMIC_YEARS;
  } catch {
    return MOCK_ACADEMIC_YEARS;
  }
};

export const createAcademicYear = async (payload: CreateAcademicYearPayload): Promise<AcademicYear> => {
  try {
    const { data } = await api.post<{ status: boolean; data: AcademicYear; message?: string }>("/tenant/academic-years", payload);
    if (data?.status && data?.data) return data.data;
    if (data && !data.status) {
      throw new Error(data?.message || "Server returned unsuccessful status");
    }
  } catch (err: any) {
    const serverMsg = err?.response?.data?.message;
    const msg = serverMsg || err?.message || "Failed to create academic year";
    console.error("createAcademicYear failed", { url: "/tenant/academic-years", payload, error: msg });
    throw new Error(msg);
  }
  throw new Error("Unexpected error: no data returned from server");
};

export const updateAcademicYear = async (
  id: string,
  payload: { startDate?: string; endDate?: string; yearName?: string }
): Promise<void> => {
  const { data } = await api.put(`/tenant/updateAcademicYear/${id}`, payload);
  if (!data?.status) throw new Error(data?.message ?? "Failed to update academic year");
};

export const deleteAcademicYear = async (id: string): Promise<void> => {
  const { data } = await api.delete(`/tenant/deleteacademicyear/${id}`);
  if (!data?.status) throw new Error(data?.message ?? "Failed to delete academic year");
};

// ─── Classes ─────────────────────────────────────────────────────────────────

export const fetchClasses = async (): Promise<ClassSection[]> => {
  return MOCK_CLASSES;
};

export const addClass = async (payload: CreateClassPayload): Promise<ClassSection> => {
  try {
    const { data: res } = await api.post<CreateClassResponse>("/tenant/class", payload);
    console.log("addClass success", { url: "/tenant/class", payload, response: res });
    return {
      id: res.data?.id ?? `cls-${Date.now()}`,
      className: payload.class_name,
      sections: [payload.section],
      classTeacher: payload.class_teacher,
      totalStudents: payload.capacity,
      status: "ACTIVE",
    };
  } catch (err: any) {
    console.error("addClass failed", { url: "/tenant/class", payload, response: err?.response?.data ?? err?.message });
    const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to add class";
    throw new Error(message);
  }
};

// ─── Working Days ─────────────────────────────────────────────────────────────

export const fetchWorkingDays = async (): Promise<WorkingDaysConfig> => {
  return MOCK_WORKING_DAYS;
};

export const updateWorkingDays = async (data: Partial<WorkingDaysConfig>): Promise<WorkingDaysConfig> => {
  try {
    const { data: res } = await api.put<WorkingDaysConfig>("/tenant/working-days", data);
    return res;
  } catch (err: any) {
    console.error("updateWorkingDays failed", { url: "/tenant/working-days", payload: data, response: err?.response?.data ?? err?.message });
    const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to update working days";
    throw new Error(message);
  }
};

// ─── Fee Heads ────────────────────────────────────────────────────────────────

export const fetchFeeHeads = async (): Promise<FeeHead[]> => {
  return MOCK_FEE_HEADS;
};

// ─── Grade Fee Structures ─────────────────────────────────────────────────────

export const fetchGradeFeeStructures = async (): Promise<GradeFeeStructure[]> => {
  return MOCK_GRADE_FEE_STRUCTURES;
};

export const saveFeeStructure = async (): Promise<void> => {
  try {
    await api.put("/tenant/fee-structures");
  } catch (err: any) {
    console.error("saveFeeStructure failed", { url: "/tenant/fee-structures", response: err?.response?.data ?? err?.message });
    const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to save fee structure";
    throw new Error(message);
  }
};

// ─── Transport Slabs ──────────────────────────────────────────────────────────

export const fetchTransportSlabs = async (): Promise<TransportSlab[]> => {
  return MOCK_TRANSPORT_SLABS;
};

// ─── Fee Quick Insights ───────────────────────────────────────────────────────

export const fetchFeeQuickInsights = async (): Promise<FeeQuickInsights> => {
  return MOCK_FEE_INSIGHTS;
};

// ─── User Accounts ────────────────────────────────────────────────────────────

export interface PaginatedUsers {
  users: UserAccount[];
  totalCount: number;
  totalPages: number;
}

const mapApiRole = (role: string): UserAccount["role"] => {
  const r = (role ?? "").toLowerCase();
  if (r === "admin") return "Admin";
  if (r === "principal") return "Principal";
  if (r === "accountant") return "Accountant";
  if (r === "teacher") return "Teacher";
  if (r === "admin clerk" || r === "admin_clerk") return "Admin Clerk";
  if (r === "receptionist") return "Receptionist";
  if (r === "librarian") return "Librarian";
  return "Teacher";
};

export const fetchUsers = async (page = 1, pageSize = 8): Promise<PaginatedUsers> => {
  try {
    const { data } = await api.get("/tenant/staffloginstatus", {
      params: { page, limit: pageSize },
    });
    if (data?.status && Array.isArray(data?.data)) {
      const users: UserAccount[] = (data.data as Record<string, unknown>[]).map((item) => ({
        id: String(item.staff_id ?? ""),
        fullName: String(item.staff_name ?? ""),
        role: mapApiRole(String(item.role ?? "")),
        mobileNumber: String(item.mobile_number ?? ""),
        lastLogin: item.last_login ? String(item.last_login) : "Never",
        status: String(item.status ?? "").toLowerCase() === "active" ? "ACTIVE" : "INACTIVE",
        permissions: [],
      }));
      return {
        users,
        totalCount: Number(data.total_records ?? users.length),
        totalPages: Number(data.total_pages ?? 1),
      };
    }
  } catch {
    // fall through to mock
  }
  const start = (page - 1) * pageSize;
  return {
    users: MOCK_ALL_USERS.slice(start, start + pageSize),
    totalCount: MOCK_ALL_USERS.length,
    totalPages: Math.ceil(MOCK_ALL_USERS.length / pageSize),
  };
};

export const addUser = async (data: AddUserFormData): Promise<UserAccount> => {
  try {
    const { data: res } = await api.post<UserAccount>("/tenant/users", data);
    return res;
  } catch (err: any) {
    console.error("addUser failed", { url: "/tenant/users", payload: data, response: err?.response?.data ?? err?.message });
    const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to add user";
    throw new Error(message);
  }
};

export const deactivateUser = async (id: string): Promise<void> => {
  try {
    await api.put(`/tenant/users/${id}/deactivate`);
  } catch (err: any) {
    console.error("deactivateUser failed", { url: `/tenant/users/${id}/deactivate`, response: err?.response?.data ?? err?.message });
    const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to deactivate user";
    throw new Error(message);
  }
};

export const updateUser = async (id: string, data: Partial<UserAccount>): Promise<void> => {
  try {
    await api.put(`/tenant/users/${id}`, data);
  } catch (err: any) {
    console.error("updateUser failed", { url: `/tenant/users/${id}`, payload: data, response: err?.response?.data ?? err?.message });
    const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to update user";
    throw new Error(message);
  }
};

// ─── Role Permissions ─────────────────────────────────────────────────────────

export const fetchRolePermissions = async (): Promise<RolePermission[]> => {
  const counts: Record<string, number> = {
    Admin: 1, Principal: 1, Accountant: 1, Teacher: 5, "Admin Clerk": 1,
    Receptionist: 0, Librarian: 0,
  };
  return ROLE_OPTIONS.map(role => ({
    role,
    userCount: counts[role] ?? 0,
    permissions: DEFAULT_ROLE_PERMISSIONS[role],
  }));
};

export const saveRolePermissions = async (role: string, permissions: ModulePermission[]): Promise<void> => {
  try {
    await api.put("/tenant/roles/permissions", { role, permissions });
  } catch (err: any) {
    console.error("saveRolePermissions failed", { url: "/tenant/roles/permissions", role, response: err?.response?.data ?? err?.message });
    const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to save role permissions";
    throw new Error(message);
  }
};

// ─── WhatsApp Connection ──────────────────────────────────────────────────────

export const fetchWAConnection = async (): Promise<WAConnection> => {
  return {
    connected: true,
    whatsappNumber: "+91 90000 12345",
    accountName: "Hanamkonda Public School",
    dialogId: "WA-HPS-001",
    monthlyUsed: 4200,
    monthlyLimit: 10000,
    resetInDays: 12,
  };
};

export const fetchWATemplates = async (): Promise<WATemplate[]> => {
  return [
    { id: "t1", name: "attendance_alert", category: "Utility", status: "APPROVED", lastUsed: "Today, 09:15 AM" },
    { id: "t2", name: "fee_reminder_3day", category: "Utility", status: "APPROVED", lastUsed: "Yesterday" },
    { id: "t3", name: "fee_receipt", category: "Utility", status: "PENDING", lastUsed: null },
  ];
};

export const fetchNotificationSettings = async (): Promise<NotificationSettings> => {
  return {
    attendanceAlerts: true,
    feeReminders: true,
    attendanceReminderToTeachers: true,
    monthlyReportToPrincipal: true,
    broadcastMessaging: true,
    newEnquiryNotification: true,
  };
};

export const updateNotificationSettings = async (settings: NotificationSettings): Promise<void> => {
  try {
    await api.put("/tenant/notification-settings", settings);
  } catch (err: any) {
    console.error("updateNotificationSettings failed", { url: "/tenant/notification-settings", payload: settings, response: err?.response?.data ?? err?.message });
    const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to update notification settings";
    throw new Error(message);
  }
};

