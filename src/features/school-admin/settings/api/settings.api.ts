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
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Update the school settings
 * @param {UpdateSchoolSettingsInput} input - The school settings to update
 * @returns {Promise<SchoolSettings>} - The updated school settings
 */
/*******  c0e52eb2-572f-4076-a9df-a21aa732aefe  *******/  WAConnection,
  WATemplate,
  NotificationSettings,
  ModulePermission,
  AddUserFormData,
} from "../types/settings.types";
import {
  DEFAULT_ROLE_PERMISSIONS,
  ROLE_OPTIONS,
} from "../utils/Settings.utils";

// ─── Simulate network delay ───────────────────────────────────────────────────

const delay = (ms = 400) => new Promise(res => setTimeout(res, ms));

// ─── School Profile ───────────────────────────────────────────────────────────

export const fetchSchoolProfile = async (): Promise<SchoolProfile> => {
  await delay();
  return {
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
};

export const updateSchoolProfile = async (data: Partial<SchoolProfile>): Promise<SchoolProfile> => {
  await delay(600);
  return { ...(await fetchSchoolProfile()), ...data };
};

// ─── Academic Year ────────────────────────────────────────────────────────────

export const fetchAcademicYears = async (): Promise<AcademicYear[]> => {
  await delay();
  return [
    {
      id: "ay-2024-25",
      label: "2024-25",
      yearStartDate: "01 June 2024",
      yearEndDate: "30 April 2025",
      active: true,
    },
  ];
};

// ─── Classes ─────────────────────────────────────────────────────────────────

export const fetchClasses = async (): Promise<ClassSection[]> => {
  await delay();
  return [
    { id: "cls-6", className: "Class 6", sections: ["A", "B"], classTeacher: "Priya Reddy", totalStudents: 78, status: "ACTIVE" },
    { id: "cls-7", className: "Class 7", sections: ["A", "B"], classTeacher: "Kiran Kumar", totalStudents: 82, status: "ACTIVE" },
    { id: "cls-8", className: "Class 8", sections: ["A", "B"], classTeacher: "Suresh Varma", totalStudents: 75, status: "ACTIVE" },
  ];
};

export const addClass = async (data: Omit<ClassSection, "id">): Promise<ClassSection> => {
  await delay(500);
  return { ...data, id: `cls-${Date.now()}` };
};

// ─── Working Days ─────────────────────────────────────────────────────────────

export const fetchWorkingDays = async (): Promise<WorkingDaysConfig> => {
  await delay();
  return {
    activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    startTime: "8:30 AM",
    endTime: "3:30 PM",
    periodDuration: 45,
    numberOfPeriods: 7,
  };
};

export const updateWorkingDays = async (data: Partial<WorkingDaysConfig>): Promise<WorkingDaysConfig> => {
  await delay(500);
  return { ...(await fetchWorkingDays()), ...data };
};

// ─── Fee Heads ────────────────────────────────────────────────────────────────

export const fetchFeeHeads = async (): Promise<FeeHead[]> => {
  await delay();
  return [
    { id: "fh-1", feeName: "Tuition Fee", code: "TF001", mandatory: true, taxable: false, status: "Active" },
    { id: "fh-2", feeName: "Examination Fee", code: "EF001", mandatory: true, taxable: false, status: "Active" },
    { id: "fh-3", feeName: "Transport Fee", code: "TRP001", mandatory: false, taxable: false, status: "Active" },
    { id: "fh-4", feeName: "Activity Fee", code: "ACT001", mandatory: false, taxable: false, status: "Active" },
    { id: "fh-5", feeName: "Library Fee", code: "LIB001", mandatory: false, taxable: false, status: "Active" },
  ];
};

// ─── Grade Fee Structures ─────────────────────────────────────────────────────

export const fetchGradeFeeStructures = async (): Promise<GradeFeeStructure[]> => {
  await delay();
  const makeGrade = (
    grade: string,
    tuition: number,
    exam: number,
    transport: number,
    activity: number
  ): GradeFeeStructure => ({
    grade,
    components: [
      { id: `${grade}-t`, name: "Tuition", amount: tuition, frequency: "Monthly (10 Inst.)", dueDay: "5th", totalAnnual: tuition * 10 },
      { id: `${grade}-e`, name: "Exam", amount: exam, frequency: "Quarterly (4 Inst.)", dueDay: "1st", totalAnnual: exam * 4 },
      { id: `${grade}-tr`, name: "Transport", amount: transport, frequency: "Monthly (10 Inst.)", dueDay: "5th", totalAnnual: transport * 10 },
      { id: `${grade}-a`, name: "Activity", amount: activity, frequency: "Half-Yearly (2 Inst.)", dueDay: "1 June, 1 Dec", totalAnnual: activity * 2 },
    ],
    totalAnnualFees: tuition * 10 + exam * 4 + transport * 10 + activity * 2,
  });

  return [
    makeGrade("Grade 6", 6500, 1500, 1200, 1000),
    makeGrade("Grade 7", 7000, 1500, 1200, 1000),
    makeGrade("Grade 8", 7500, 1800, 1500, 1000),
    makeGrade("Grade 9", 8000, 2000, 1500, 1200),
    makeGrade("Grade 10", 8500, 2000, 1500, 1200),
  ];
};

export const saveFeeStructure = async (): Promise<void> => {
  await delay(700);
};

// ─── Transport Slabs ──────────────────────────────────────────────────────────

export const fetchTransportSlabs = async (): Promise<TransportSlab[]> => {
  await delay();
  return [
    { id: "ts-a", slabName: "Slab A", rangeFrom: 0, rangeTo: 3, rateMonthly: 800, rateAnnual: 8000, studentCount: 24 },
    { id: "ts-b", slabName: "Slab B", rangeFrom: 3, rangeTo: 7, rateMonthly: 1200, rateAnnual: 12000, studentCount: 38 },
    { id: "ts-c", slabName: "Slab C", rangeFrom: 7, rangeTo: null, rateMonthly: 1500, rateAnnual: 15000, studentCount: 27 },
  ];
};

// ─── Fee Quick Insights ───────────────────────────────────────────────────────

export const fetchFeeQuickInsights = async (): Promise<FeeQuickInsights> => {
  await delay();
  return {
    projAnnualRevenue: "₹1.84 Cr",
    activeGrades: 12,
    collectedPercent: 78,
    pendingAmount: "₹42L",
  };
};

// ─── User Accounts ────────────────────────────────────────────────────────────

export interface PaginatedUsers {
  users: UserAccount[];
  totalCount: number;
  totalPages: number;
}

export const fetchUsers = async (page = 1, pageSize = 8): Promise<PaginatedUsers> => {
  await delay();
  const allUsers: UserAccount[] = [
    { id: "u1", fullName: "Ramesh Kumar", role: "Principal", mobileNumber: "+91 98765 43210", lastLogin: "Today 8:30 AM", status: "ACTIVE", permissions: DEFAULT_ROLE_PERMISSIONS["Principal"] },
    { id: "u2", fullName: "Ramu T", role: "Accountant", mobileNumber: "+91 87654 32109", lastLogin: "Yesterday", status: "ACTIVE", permissions: DEFAULT_ROLE_PERMISSIONS["Accountant"] },
    { id: "u3", fullName: "Priya Reddy", role: "Teacher", mobileNumber: "+91 76543 21098", lastLogin: "Today 9:00 AM", status: "ACTIVE", permissions: DEFAULT_ROLE_PERMISSIONS["Teacher"] },
    { id: "u4", fullName: "Kiran Kumar", role: "Teacher", mobileNumber: "+91 65432 10987", lastLogin: "2 hours ago", status: "ACTIVE", permissions: DEFAULT_ROLE_PERMISSIONS["Teacher"] },
    { id: "u5", fullName: "Anita V", role: "Admin Clerk", mobileNumber: "+91 54321 09876", lastLogin: "Today 8:45 AM", status: "ACTIVE", permissions: DEFAULT_ROLE_PERMISSIONS["Admin Clerk"] },
    { id: "u6", fullName: "Deepa S", role: "Teacher", mobileNumber: "+91 43210 98765", lastLogin: "Yesterday", status: "ACTIVE", permissions: DEFAULT_ROLE_PERMISSIONS["Teacher"] },
    { id: "u7", fullName: "Venkat R", role: "Teacher", mobileNumber: "+91 32109 87654", lastLogin: "Today 7:50 AM", status: "ACTIVE", permissions: DEFAULT_ROLE_PERMISSIONS["Teacher"] },
    { id: "u8", fullName: "Padma K", role: "Teacher", mobileNumber: "+91 21098 76543", lastLogin: "Today 8:10 AM", status: "ACTIVE", permissions: DEFAULT_ROLE_PERMISSIONS["Teacher"] },
  ];

  const start = (page - 1) * pageSize;
  return {
    users: allUsers.slice(start, start + pageSize),
    totalCount: allUsers.length,
    totalPages: Math.ceil(allUsers.length / pageSize),
  };
};

export const addUser = async (data: AddUserFormData): Promise<UserAccount> => {
  await delay(600);
  return {
    id: `u-${Date.now()}`,
    fullName: data.fullName,
    role: data.role as UserAccount["role"],
    mobileNumber: `+91 ${data.mobileNumber}`,
    lastLogin: "Never",
    status: "ACTIVE",
    permissions: data.permissions,
  };
};

export const deactivateUser = async (id: string): Promise<void> => {
  await delay(500);
  console.log("Deactivated user:", id);
};

export const updateUser = async (id: string, data: Partial<UserAccount>): Promise<void> => {
  await delay(500);
  console.log("Updated user:", id, data);
};

// ─── Role Permissions ─────────────────────────────────────────────────────────

export const fetchRolePermissions = async (): Promise<RolePermission[]> => {
  await delay();
  const counts: Record<string, number> = {
    Principal: 1, Accountant: 1, Teacher: 5, "Admin Clerk": 1,
    Receptionist: 0, Librarian: 0,
  };
  return ROLE_OPTIONS.map(role => ({
    role,
    userCount: counts[role] ?? 0,
    permissions: DEFAULT_ROLE_PERMISSIONS[role],
  }));
};

export const saveRolePermissions = async (
  role: string,
  permissions: ModulePermission[]
): Promise<void> => {
  await delay(600);
  console.log("Saved permissions for", role, permissions);
};

// ─── WhatsApp Connection ──────────────────────────────────────────────────────

export const fetchWAConnection = async (): Promise<WAConnection> => {
  await delay();
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
  await delay();
  return [
    { id: "t1", name: "attendance_alert", category: "Utility", status: "APPROVED", lastUsed: "Today, 09:15 AM" },
    { id: "t2", name: "fee_reminder_3day", category: "Utility", status: "APPROVED", lastUsed: "Yesterday" },
    { id: "t3", name: "fee_receipt", category: "Utility", status: "PENDING", lastUsed: null },
  ];
};

export const fetchNotificationSettings = async (): Promise<NotificationSettings> => {
  await delay();
  return {
    attendanceAlerts: true,
    feeReminders: true,
    attendanceReminderToTeachers: true,
    monthlyReportToPrincipal: true,
    broadcastMessaging: true,
    newEnquiryNotification: true,
  };
};

export const updateNotificationSettings = async (
  settings: NotificationSettings
): Promise<void> => {
  await delay(400);
  console.log("Updated notification settings:", settings);
};