export type PayslipStatus = "PAID" | "PENDING" | "PROCESSING";

export interface SalaryDeduction {
  label: string;
  amount: number;
}

export interface SalaryEarning {
  label: string;
  amount: number;
}

export interface AttendanceSummary {
  workingDays: number;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  leaveDays: number;
}

export interface Payslip {
  id: string;
  month: string;       // "YYYY-MM"
  monthLabel: string;  // "April 2025"
  status: PayslipStatus;

  // Employee info (static for teacher)
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  bankAccount: string; // masked, e.g. "XXXX 4321"
  pan: string;         // masked, e.g. "ABCDE1234F"

  // Earnings
  earnings: SalaryEarning[];
  grossSalary: number;

  // Deductions
  deductions: SalaryDeduction[];
  totalDeductions: number;

  // Net
  netSalary: number;

  // Attendance
  attendance: AttendanceSummary;
}

export interface AnnualSummary {
  year: number;
  totalEarned: number;
  totalDeductions: number;
  totalNet: number;
}
