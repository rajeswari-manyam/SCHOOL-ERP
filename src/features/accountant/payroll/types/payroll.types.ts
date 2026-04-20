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

export type PayrollSummary = {
  totalStaff: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  month: string;
  year: number;
  processingDueDate: string;
};

export type AttendanceDeduction = {
  staffName: string;
  daysAbsent: number;
  amountDeducted: number;
};

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