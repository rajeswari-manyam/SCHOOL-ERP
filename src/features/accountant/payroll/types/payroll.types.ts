export interface Payroll {
  id: string;
  staffId: string;
  staffName: string;
  month: string; // e.g., '2026-04'
  baseSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: "pending" | "paid";
  paidAt?: string;
}

export interface CreatePayrollInput {
  staffId: string;
  month: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
}

export interface UpdatePayrollInput extends Partial<CreatePayrollInput> {}
