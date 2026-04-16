import type {
  ModulePermission,
  UserRole,
  Day,
  RolePermission,
} from "../types/settings.types";

// ─── Currency Formatter ───────────────────────────────────────────────────────

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

// ─── School Profile Options ───────────────────────────────────────────────────

export const BOARD_OPTIONS = [
  "CBSE",
  "ICSE",
  "State Board (Telangana)",
  "State Board (AP)",
  "IB",
  "Cambridge (IGCSE)",
] as const;

export const SCHOOL_TYPE_OPTIONS = [
  "Private Unaided",
  "Private Aided",
  "Government",
  "Government Aided",
  "Central Government (Kendriya Vidyalaya)",
] as const;

// ─── Working Days ─────────────────────────────────────────────────────────────

export const ALL_DAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export type { Day };

// ─── Role Options ─────────────────────────────────────────────────────────────

export const ROLE_OPTIONS: UserRole[] = [
  "Principal",
  "Accountant",
  "Teacher",
  "Admin Clerk",
  "Receptionist",
  "Librarian",
];

// ─── Module Permissions ───────────────────────────────────────────────────────

export const ALL_PERMISSIONS: ModulePermission[] = [
  "viewDashboard",
  "downloadReports",
  "viewAttendance",
  "markAttendance",
  "viewStudents",
  "editStudents",
  "viewFeeRecords",
  "recordPayments",
  "viewStaff",
  "manageStaff",
  "sendBroadcast",
  "manageAdmissions",
];

export const PERMISSION_LABELS: Record<ModulePermission, string> = {
  viewDashboard: "View Dashboard",
  downloadReports: "Download Reports",
  viewAttendance: "View Attendance",
  markAttendance: "Mark Attendance",
  viewStudents: "View Students",
  editStudents: "Edit Students",
  viewFeeRecords: "View Fee Records",
  recordPayments: "Record Payments",
  viewStaff: "View Staff",
  manageStaff: "Manage Staff",
  sendBroadcast: "Send Broadcast",
  manageAdmissions: "Manage Admissions",
};

// ─── Default Role Permissions ─────────────────────────────────────────────────

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, ModulePermission[]> = {
  Principal: [
    "viewDashboard",
    "downloadReports",
    "viewAttendance",
    "markAttendance",
    "viewStudents",
    "editStudents",
    "viewFeeRecords",
    "recordPayments",
    "viewStaff",
    "manageStaff",
    "sendBroadcast",
    "manageAdmissions",
  ],
  Accountant: [
    "viewDashboard",
    "downloadReports",
    "viewFeeRecords",
    "recordPayments",
  ],
  Teacher: [
    "viewDashboard",
    "viewAttendance",
    "markAttendance",
    "viewStudents",
  ],
  "Admin Clerk": [
    "viewDashboard",
    "viewStudents",
    "editStudents",
    "viewFeeRecords",
    "manageAdmissions",
  ],
  Receptionist: [
    "viewDashboard",
    "viewStudents",
    "manageAdmissions",
  ],
  Librarian: [
    "viewDashboard",
    "viewStudents",
  ],
};

// ─── Seed Role Permissions (with user counts) ─────────────────────────────────

export const SEED_ROLE_PERMISSIONS: RolePermission[] = ROLE_OPTIONS.map(role => ({
  role,
  userCount: 0,
  permissions: DEFAULT_ROLE_PERMISSIONS[role],
}));