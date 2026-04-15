export type PayrollStatus = "Pending" | "Processed";

export type StaffPayroll = {
  id: string;
  name: string;
  role: string;
  present: number;
  absent: number;
  gross: number;
  deductions: number;
  net: number;
  status: PayrollStatus;
};