export type StaffRole = "Class Teacher" | "Subject Teacher" | "Admin" | "Support";

export type StaffStatus = "ACTIVE" | "ON_LEAVE" | "INACTIVE";
export type TabKey =
  | "all"
  | "teachers"
  | "non-teaching"
  | "leave-requests";
export type LeaveType = "SICK" | "CASUAL" | "PAID";

export interface LeaveRequest {
  type: LeaveType;
  from: string; // later you can switch to Date
  to: string;
  days: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}
export interface StaffMember {
  id: string;
  name: string;
  initials: string;

  role: StaffRole;
  status: StaffStatus;

  employeeId: string;
  phone: string;
  email: string;

  classes: string[];
  subjects: string[];

  leaveBalance: number;
  isTeaching: boolean;

  leaveRequest?: LeaveRequest;

  createdAt?: string;
  updatedAt?: string;
}