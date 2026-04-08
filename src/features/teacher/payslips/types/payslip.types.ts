export interface Payslip {
  id: string;
  staffId: string;
  staffName: string;
  month: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: "pending" | "paid";
  paidAt?: string;
}

export interface CreatePayslipInput {
  staffId: string;
  month: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
}

export interface UpdatePayslipInput extends Partial<CreatePayslipInput> {}
