import api from "@/config/axios";
import type {
  SchoolProfile,
  AcademicYear,
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
} from "../types/settings.types";
import {
  DEFAULT_ROLE_PERMISSIONS,
  ROLE_OPTIONS,
} from "../utils/Settings.utils";

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
  { id: "ay-2024-25", label: "2024-25", yearStartDate: "01 June 2024", yearEndDate: "30 April 2025", active: true },
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

export const fetchSchoolProfile = async (): Promise<SchoolProfile> => {
  try {
    const { data } = await api.get<SchoolProfile>("/tenant/school-profile");
    return data;
  } catch {
    return MOCK_SCHOOL_PROFILE;
  }
};

export const updateSchoolProfile = async (data: Partial<SchoolProfile>): Promise<SchoolProfile> => {
  try {
    const { data: res } = await api.put<SchoolProfile>("/tenant/school-profile", data);
    return res;
  } catch (err: any) {
    console.error("updateSchoolProfile failed", { url: "/tenant/school-profile", payload: data, response: err?.response?.data ?? err?.message });
    const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to update school profile";
    throw new Error(message);
  }
};

// ─── Academic Year ────────────────────────────────────────────────────────────

export const fetchAcademicYears = async (): Promise<AcademicYear[]> => {
  try {
    const { data } = await api.get<AcademicYear[]>("/tenant/academic-years");
    return data;
  } catch {
    return MOCK_ACADEMIC_YEARS;
  }
};

// ─── Classes ─────────────────────────────────────────────────────────────────

export const fetchClasses = async (): Promise<ClassSection[]> => {
  try {
    const { data } = await api.get<ClassSection[]>("/tenant/classes");
    return data;
  } catch {
    return MOCK_CLASSES;
  }
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
  try {
    const { data } = await api.get<WorkingDaysConfig>("/tenant/working-days");
    return data;
  } catch {
    return MOCK_WORKING_DAYS;
  }
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
  try {
    const { data } = await api.get<FeeHead[]>("/tenant/fee-heads");
    return data;
  } catch {
    return MOCK_FEE_HEADS;
  }
};

// ─── Grade Fee Structures ─────────────────────────────────────────────────────

export const fetchGradeFeeStructures = async (): Promise<GradeFeeStructure[]> => {
  try {
    const { data } = await api.get<GradeFeeStructure[]>("/tenant/fee-structures");
    return data;
  } catch {
    return MOCK_GRADE_FEE_STRUCTURES;
  }
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
  try {
    const { data } = await api.get<TransportSlab[]>("/tenant/transport-slabs");
    return data;
  } catch {
    return MOCK_TRANSPORT_SLABS;
  }
};

// ─── Fee Quick Insights ───────────────────────────────────────────────────────

export const fetchFeeQuickInsights = async (): Promise<FeeQuickInsights> => {
  try {
    const { data } = await api.get<FeeQuickInsights>("/tenant/fee-insights");
    return data;
  } catch {
    return MOCK_FEE_INSIGHTS;
  }
};

// ─── User Accounts ────────────────────────────────────────────────────────────

export interface PaginatedUsers {
  users: UserAccount[];
  totalCount: number;
  totalPages: number;
}

export const fetchUsers = async (page = 1, pageSize = 8): Promise<PaginatedUsers> => {
  try {
    const { data } = await api.get<PaginatedUsers>("/tenant/users", { params: { page, pageSize } });
    return data;
  } catch {
    const start = (page - 1) * pageSize;
    return {
      users: MOCK_ALL_USERS.slice(start, start + pageSize),
      totalCount: MOCK_ALL_USERS.length,
      totalPages: Math.ceil(MOCK_ALL_USERS.length / pageSize),
    };
  }
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
  try {
    const { data } = await api.get<RolePermission[]>("/tenant/roles/permissions");
    return data;
  } catch {
    const counts: Record<string, number> = {
      Principal: 1, Accountant: 1, Teacher: 5, "Admin Clerk": 1,
      Receptionist: 0, Librarian: 0,
    };
    return ROLE_OPTIONS.map(role => ({
      role,
      userCount: counts[role] ?? 0,
      permissions: DEFAULT_ROLE_PERMISSIONS[role],
    }));
  }
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
  try {
    const { data } = await api.get<WAConnection>("/tenant/whatsapp/connection");
    return data;
  } catch {
    return {
      connected: true,
      whatsappNumber: "+91 90000 12345",
      accountName: "Hanamkonda Public School",
      dialogId: "WA-HPS-001",
      monthlyUsed: 4200,
      monthlyLimit: 10000,
      resetInDays: 12,
    };
  }
};

export const fetchWATemplates = async (): Promise<WATemplate[]> => {
  try {
    const { data } = await api.get<WATemplate[]>("/tenant/whatsapp/templates");
    return data;
  } catch {
    return [
      { id: "t1", name: "attendance_alert", category: "Utility", status: "APPROVED", lastUsed: "Today, 09:15 AM" },
      { id: "t2", name: "fee_reminder_3day", category: "Utility", status: "APPROVED", lastUsed: "Yesterday" },
      { id: "t3", name: "fee_receipt", category: "Utility", status: "PENDING", lastUsed: null },
    ];
  }
};

export const fetchNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const { data } = await api.get<NotificationSettings>("/tenant/notification-settings");
    return data;
  } catch {
    return {
      attendanceAlerts: true,
      feeReminders: true,
      attendanceReminderToTeachers: true,
      monthlyReportToPrincipal: true,
      broadcastMessaging: true,
      newEnquiryNotification: true,
    };
  }
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
