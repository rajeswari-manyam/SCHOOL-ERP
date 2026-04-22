// ==========================
// 1. CORE DOMAIN TYPES
// ==========================

export type PayrollStatus = "Draft" | "Processed" | "Paid";

export type StaffPayroll = {
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
// 5. SUMMARY & DEDUCTION
// ==========================

export interface PayrollSummary {
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

// ==========================
// 6. UI PROPS TYPES
// ==========================

export type MonthlyPayrollTabProps = {
  staffData: StaffPayroll[];
  summary: PayrollSummary;
  isProcessed: boolean;
  processedDate: string | null;
  processedBy: string | null;
  onStartProcessing: () => void;
};

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
  isEditing: boolean;
  selectedStaff: SalaryConfig | null;
  onEdit: (staff: SalaryConfig) => void;
  onClose: () => void;
  onSave: (id: string, data: SalaryFormData) => void;
  onAdd: () => void;
}

export interface SalaryTableProps {
  data: SalaryConfig[];
  onEdit: (staff: SalaryConfig) => void;
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
  isProcessed?: boolean;
}

export interface ProcessPayrollModalProps {
  month?: string;
  onClose: () => void;
  onSubmit: (data: PayrollFormData) => void;
  summary: PayrollSummary;
  attendanceDeductions?: AttendanceDeduction[];
}