export type LeaveType = "CASUAL" | "SICK" | "PERSONAL" | "EMERGENCY";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface LeaveBalance {
  type: LeaveType;
  label: string;
  total: number;
  used: number;
  remaining: number;
  accentColor: string; // tailwind color key for styling
}

export interface LeaveApplication {
  id: string;
  type: LeaveType;
  fromDate: string;   // YYYY-MM-DD
  toDate: string;     // YYYY-MM-DD
  totalDays: number;
  reason: string;
  substituteArrangement?: string;
  medicalCertUrl?: string;
  status: LeaveStatus;
  appliedOn: string;  // YYYY-MM-DD
  reviewedBy?: string;
  reviewedOn?: string;
  rejectionReason?: string;
}

export interface ApplyLeaveFormData {
  type: LeaveType | null;
  fromDate: string;
  toDate: string;
  reason: string;
  substituteArrangement: string;
  medicalCertFile: File | null;
}

export interface LeaveCalendarDay {
  date: string;        // YYYY-MM-DD
  isLeave: boolean;
  leaveType?: LeaveType;
  leaveStatus?: LeaveStatus;
  isToday: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayLabel?: string;
}
