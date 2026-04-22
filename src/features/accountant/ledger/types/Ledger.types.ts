
export type EntryType = "Income" | "Expense";

export type LedgerEntry = {
  id: string;
  date: string;
  category: string;
  description: string;
  reference?: string;
  amount: number;
  recordedBy: string;
  type: EntryType;
  paidVia?: string;
  notes?: string;
};

export type PettyCashEntry = {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  balanceAfter: number;
  authorizedBy: string;
  receipt?: string;
};

export type MonthlyData = {
  month: string;
  income: number;
  expense: number;
};