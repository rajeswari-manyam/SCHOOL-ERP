export type LeaveType = "CASUAL" | "SICK" | "PERSONAL" | "EMERGENCY";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type LeaveTypeApi = "casual" | "sick" | "personal" | "emergency";

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

// ─── Apply Leave API (POST /tenant/leaves) ────────────────────────────────────
export interface ApplyLeavePayload {
  staff_id: string;
  leave_type: LeaveTypeApi;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  school_code: string;
}

export interface ApplyLeaveResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    staff_id: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    total_days: number;
    status: string;
  };
}

// ─── GET /tenant/leavebalance?staff_id=... ──────────────────────────────────
export interface LeaveBalanceApiItem {
  leave_type?: string;
  type?: string;
  label?: string;
  total?: number;
  total_days?: number;
  used?: number;
  used_days?: number;
  remaining?: number;
  remaining_days?: number;
  accentColor?: string;
}

export interface LeaveBalanceApiResponse {
  status?: boolean;
  message?: string;
  data?: LeaveBalanceApiItem | LeaveBalanceApiItem[];
  balances?: LeaveBalanceApiItem[];
  leave_balances?: LeaveBalanceApiItem[];
  leavebalance?: LeaveBalanceApiItem[];
  [key: string]: unknown;
}
