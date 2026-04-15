export type ReportType =
  | "monthly"
  | "defaulters"
  | "reconciliation"
  | "annual"
  | "payroll"
  | "ledger";

export type Report = {
  id: string;
  name: string;
  type: ReportType;
  generatedAt: string;
  format: "PDF" | "Excel";
};