export type StaffRole = string;

export type StaffStatus = "ACTIVE" | "ON_LEAVE" | "INACTIVE";
export type TabKey =
  | "all"
  | "teachers"
  | "non-teaching"
  | "leave-requests";
export type LeaveType = "SICK" | "CASUAL" | "PAID";

export interface LeaveRequest {
  staffId?: string;
  staffName?: string;
  type: LeaveType;
  from: string;
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
  leavesTaken?: number;
  leavesAllocated?: number;
  isTeaching: boolean;

  leaveRequest?: LeaveRequest;

  departmentId?: string;
  departmentName?: string;

  qualification?: string;
  salary?: number;
  dateOfBirth?: string;
  dateOfJoin?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStaffPayload {
  school_id?: string;
  name: string;
  email: string;
  phone: string;
  emp_number: string;
  qualification: string;
  department_id?: string;
  academicYearId?: string;
  salary?: number;
  date_of_birth: string;
  date_of_join: string;
  school_code: string;
  role: string;
}

export interface UpdateStaffPayload {
  name?: string;
  email?: string;
  phone?: string;
  emp_number?: string;
  qualification?: string;
  department_id?: string;
  academicYearId?: string;
  salary?: number;
  date_of_birth?: string;
  date_of_join?: string;
  role?: string;
  status?: StaffStatus;
}

export interface AssignedClassSubject {
  class_id: string;
  class_name: string;
  section_id: string;
  section_name: string;
  subject_id: string;
  subject_name: string;
}

export interface StaffDetails {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  qualification: string | null;
  emp_number: string;
  salary: number | null;
  date_of_birth: string | null;
  date_of_join: string | null;
  status: string;
  department: { id: string; departmentName: string } | null;
  leavesTaken?: number;
  leavesPending?: number;
  leavesBalance?: number;
  assigned_classes_subjects: AssignedClassSubject[];
}