// ==========================
// 1. CORE DOMAIN TYPES
// ==========================

export type PayrollStatus = "Draft" | "Pending" | "Paid" | "Failed";

export type Payroll = {
  id: string;
  name: string;
  initials: string;
  role: string;
  present: number;
  absent: number;
  gross: number;
  deductions: number;
  net: number;
  status: PayrollStatus;
};

// ==========================
// 2. SALARY CONFIG TYPES
// ==========================

export type SalaryConfig = {
  id: string;
  name: string;
  initials: string;
  role: string;
  basic: number;
  hra: number;
  transport: number;
  other: number;
  tds: number;
  pfPercentage: number;
  professionalTax: number;
  gross: number;
  net: number;
  effectiveFrom: string;
};

export type SalaryFormData = {
  basicSalary: number;
  hra: number;
  transportAllowance: number;
  otherAllowance: number;
  pfPercentage: number;
  professionalTax: number;
  tds: number;
  effectiveFrom: string;
};

// ==========================
// 3. HISTORY TYPES
// ==========================

export type PayrollHistory = {
  month: string;
  year: number;
  staffCount: number;
  totalGross: number;
  totalDeductions: number;
  netPaid: number;
  paymentDate: string;
  mode: string;
  status: "Paid" | "Pending";
};

// ==========================
// 4. PAYROLL FORM TYPE
// ==========================

export type PayrollFormData = {
  paymentMode: "Bank Transfer" | "Cash" | "UPI" | "Cheque";
  paymentDate: string;
  approvalNote?: string;
  confirmAttendance: boolean;
  confirmSalary: boolean;
};

// ==========================
// 5. CORE STAFF / SUMMARY
// ==========================

export interface CreatePayrollInput {
  month: string;
  year: number;
  attendanceDeductions: {
    staffId: string;
    daysAbsent: number;
    amountDeducted: number;
  }[];
}

export interface StaffPayroll {
  id: string;            // staff_id
  payrollId?: string;    // payroll config ID (for createpayslips)
  payslipId?: string;    // payslip ID (if generated)
  name: string;
  initials: string;
  role: string;
  present: number;
  absent: number;
  gross: number;
  /** bonus + overtime + extraClass − leaveDeductions − otherDeductions */
  adjustments: number;
  bonus: number;
  overtime: number;
  extraClass: number;
  leaveDeductions: number;
  otherDeductions: number;
  /** Statutory deductions: PF + PT */
  deductions: number;
  net: number;
  status: PayrollStatus;
  paymentDate?: string;
  paymentMethod?: string;
  remarks?: string;
}

export interface UpdatePayrollInput {
  totalStaff: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  processingDueDate: string;
}

export interface AttendanceDeduction {
  staffName: string;
  daysAbsent: number;
  amountDeducted: number;
}

export interface PaySalaryFormData {
  bonus: number;
  overtime: number;
  extraClass: number;
  leaveDeductions: number;
  otherDeductions: number;
  paymentMethod: "Bank Transfer" | "Cash" | "UPI" | "Cheque";
  paymentDate: string;
  remarks: string;
}

// ==========================
// 6. UI PROP TYPES
// ==========================

export type MonthlyPayrollTabProps = {
  staffData: StaffPayroll[];
  summary: PayrollSummary;
  isProcessed: boolean;
  isLoading?: boolean;
  processedDate: string | null;
  processedBy: string | null;
  onStartProcessing: () => void;
  onViewPayslip?: (staff: StaffPayroll) => void;
  onPaySalary: (staffId: string, data: PaySalaryFormData) => void;
  onPaySelected: (ids: string[], data: PaySalaryFormData) => void;
  onDeletePayslip?: (staff: StaffPayroll) => void;
  onGeneratePayslip?: (staff: StaffPayroll, bonus: number, overtime: number, extraClass: number) => Promise<PayslipResult>;
};

export interface PayrollSummary {
  totalStaff: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  month: string;
  year: number;
  processingDueDate: string;
}

export interface StatusBannerProps {
  isProcessed: boolean;
  summary: PayrollSummary;
  processedDate: string | null;
  processedBy: string | null;
  onStartProcessing: () => void;
}

export interface HistoryStatsProps {
  totalPayrollFY: number;
  avgMonthlyPayroll: number;
  staffCount: number;
  fyLabel?: string;
  growthPercent?: number;
  avatars?: string[];
}

export interface TrendPoint {
  label: string;
  amount: number;
}

export interface PayrollHistoryTabProps {
  history: PayrollHistory[];
  totalPayrollFY: number;
  avgMonthlyPayroll: number;
  staffCount: number;
}

export const MONTHS = [
  "JUN", "JUL", "AUG", "SEP", "OCT", "NOV",
  "DEC", "JAN", "FEB", "MAR",
] as const;

export interface SalaryConfigTabProps {
  salaryData: SalaryConfig[];
  isLoading?: boolean;
  isEditing: boolean;
  selectedStaff: SalaryConfig | null;
  onEdit: (staff: SalaryConfig) => void;
  onClose: () => void;
  onSave: (id: string, data: SalaryFormData) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export interface SalaryTableProps {
  data: SalaryConfig[];
  onEdit: (staff: SalaryConfig) => void;
  onDelete: (id: string) => void;
}

export interface EditSalaryModalProps {
  staff?: SalaryConfig | null;
  onClose: () => void;
  onSave: (id: string, data: SalaryFormData) => void;
}

export interface HistoryTableProps {
  data: PayrollHistory[];
}

export interface PayrollStatsProps {
  summary: PayrollSummary;
}

export interface PayrollTableProps {
  data: StaffPayroll[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onPaySalary: (staff: StaffPayroll) => void;
  onViewPayslip?: (staff: StaffPayroll) => void;
  onEdit?: (staff: StaffPayroll) => void;
  onDelete?: (staff: StaffPayroll) => void;
}

export interface ProcessPayrollModalProps {
  month?: string;
  onClose: () => void;
  onSubmit: (data: PayrollFormData) => void;
  summary: PayrollSummary;
  attendanceDeductions?: AttendanceDeduction[];
}

export interface PayslipResult {
  presentDays: number;
  absentDays: number;
  netSalary: number;
  grossSalary: number;
  totalDeductions: number;
}

export interface PaySalaryModalProps {
  staff: StaffPayroll;
  onClose: () => void;
  onPay: (staffId: string, data: PaySalaryFormData) => Promise<PayslipResult | void>;
}

export interface BulkPayModalProps {
  staff: StaffPayroll[];
  onClose: () => void;
  onPay: (ids: string[], data: PaySalaryFormData) => void;
}
