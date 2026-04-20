// src/features/accountant/reports/data/data.ts

import type { Report, ReportType } from "../types/reports.types";

/* =========================
   REPORT LIST (HISTORY)
========================= */
export const mockReports: Report[] = [
  {
    id: "1",
    name: "Monthly Fee Collection",
    type: "monthly",
    generatedAt: new Date().toISOString(),
    format: "PDF",
    generatedBy: "Admin",
    period: "April 2025",
  },
  {
    id: "2",
    name: "Fee Defaulters Report",
    type: "defaulters",
    generatedAt: new Date().toISOString(),
    format: "Excel",
    generatedBy: "Admin",
    period: "March 2025",
  },
];

/* =========================
   REPORT CARDS (DASHBOARD)
========================= */
export const reportCards = [
  {
    id: "monthly" as ReportType,
    title: "Monthly Fee Collection",
    description:
      "Total collected, pending, class-wise breakdown, payment mode analysis",
    icon: "fee",
    color: "blue",
    autoSend: true,
  },
  {
    id: "defaulters" as ReportType,
    title: "Fee Defaulters Report",
    description:
      "Students with overdue fees, days overdue, parent contact list",
    icon: "defaulters",
    color: "amber",
  },
  {
    id: "reconciliation" as ReportType,
    title: "Payment Reconciliation",
    description:
      "UPI, cash, cheque breakdown for bank statement matching",
    icon: "reconciliation",
    color: "emerald",
  },
  {
    id: "annual" as ReportType,
    title: "Annual Fee Summary",
    description:
      "Full academic year collection vs expected, class-wise annual breakdown",
    icon: "annual",
    color: "violet",
  },
  {
    id: "payroll" as ReportType,
    title: "Payroll Report",
    description:
      "Monthly salary outflow, staff-wise breakdown, annual payroll summary",
    icon: "payroll",
    color: "rose",
  },
  {
    id: "ledger" as ReportType,
    title: "Income & Expense Report",
    description:
      "Full ledger export with income, expenses, and net balance",
    icon: "ledger",
    color: "cyan",
  },
] as const;