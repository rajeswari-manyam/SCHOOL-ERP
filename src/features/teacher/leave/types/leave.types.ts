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
  academicYearId?: string;
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

// ─── GET /tenant/leavebalance?staff_id=...&academic_year=... ──────────────
export interface LeaveBalanceApiItem {
  leave_type?: string;
  type?: string;
  label?: string;
  total?: number;
  total_days?: number;
  allocated?: number;
  used?: number;
  used_days?: number;
  remaining?: number;
  remaining_days?: number;
  balance?: number;
  accentColor?: string;
}

export interface LeaveBalanceApiResponse {
  status?: boolean;
  message?: string;
  academic_year?: string;
  total_allocated?: number;
  total_used?: number;
  total_balance?: number;
  balance_list?: LeaveBalanceApiItem[];
  used_list?: { leave_type?: string; total_days?: number }[];
  [key: string]: unknown;
}
