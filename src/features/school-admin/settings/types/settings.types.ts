// ─── School Profile ───────────────────────────────────────────────────────────

export interface SchoolProfile {
  id: string;
  schoolName: string;
  board: string;
  principalName: string;
  establishedYear: number;
  phone: string;
  totalStudentCapacity: number;
  email: string;
  schoolType: string;
  address: string;
  logoUrl?: string;
}

/** Legacy shape used by SchoolSettingsForm */
export interface SchoolSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  academicYear: string;
  logoUrl?: string;
}

export type UpdateSchoolSettingsInput = SchoolSettings;

// ─── Academic Year ────────────────────────────────────────────────────────────

export interface AcademicYear {
  id: string;
  label: string;
  yearStartDate: string; // "01 June 2024"
  yearEndDate: string;   // "30 April 2025"
  active: boolean;
}

// ─── Classes & Sections ───────────────────────────────────────────────────────

export interface ClassSection {
  id: string;
  className: string;       // e.g. "Class 6"
  sections: string[];      // e.g. ["A", "B"]
  classTeacher: string;
  totalStudents: number;
  status: "ACTIVE" | "INACTIVE";
}

// ─── Working Days ─────────────────────────────────────────────────────────────

export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface WorkingDaysConfig {
  activeDays: Day[];
  startTime: string;     // "8:30 AM"
  endTime: string;       // "3:30 PM"
  periodDuration: number; // minutes
  numberOfPeriods: number;
}

// ─── Fee Configuration ────────────────────────────────────────────────────────

export interface FeeHead {
  id: string;
  feeName: string;
  code: string;
  mandatory: boolean;
  taxable: boolean;
  status: "Active" | "Inactive";
}

export interface FeeComponent {
  id: string;
  name: string;
  amount: number;
  frequency: string;  // "Monthly (10 Inst.)"
  dueDay: string;     // "5th"
  totalAnnual: number;
}

export interface GradeFeeStructure {
  grade: string;           // "Grade 10"
  components: FeeComponent[];
  totalAnnualFees: number;
}

export interface TransportSlab {
  id: string;
  slabName: string;
  rangeFrom: number;
  rangeTo: number | null;
  rateMonthly: number;
  rateAnnual: number;
  studentCount: number;
}

export interface FeeQuickInsights {
  projAnnualRevenue: string;   // formatted, e.g. "₹1.84 Cr"
  activeGrades: number;
  collectedPercent: number;
  pendingAmount: string;       // formatted, e.g. "₹42L"
}

// ─── User Accounts ────────────────────────────────────────────────────────────

export type UserRole =
  | "Principal"
  | "Accountant"
  | "Teacher"
  | "Admin Clerk"
  | "Receptionist"
  | "Librarian";

export type ModulePermission =
  | "viewDashboard"
  | "downloadReports"
  | "viewAttendance"
  | "markAttendance"
  | "viewStudents"
  | "editStudents"
  | "viewFeeRecords"
  | "recordPayments"
  | "viewStaff"
  | "manageStaff"
  | "sendBroadcast"
  | "manageAdmissions";

export interface UserAccount {
  id: string;
  fullName: string;
  role: UserRole;
  mobileNumber: string;
  lastLogin: string;
  status: "ACTIVE" | "INACTIVE";
  permissions: ModulePermission[];
}

export interface AddUserFormData {
  fullName: string;
  mobileNumber: string;
  role: string;
  email: string;
  permissions: ModulePermission[];
}

// ─── Permissions ──────────────────────────────────────────────────────────────

export interface RolePermission {
  role: UserRole;
  userCount: number;
  permissions: ModulePermission[];
}

// ─── WhatsApp & Notifications ─────────────────────────────────────────────────

export interface WAConnection {
  connected: boolean;
  whatsappNumber: string;
  accountName: string;
  dialogId: string;
  monthlyUsed: number;
  monthlyLimit: number;
  resetInDays: number;
}

export interface WATemplate {
  id: string;
  name: string;
  category: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  lastUsed: string | null;
}

export interface NotificationSettings {
  attendanceAlerts: boolean;
  feeReminders: boolean;
  attendanceReminderToTeachers: boolean;
  monthlyReportToPrincipal: boolean;
  broadcastMessaging: boolean;
  newEnquiryNotification: boolean;
}