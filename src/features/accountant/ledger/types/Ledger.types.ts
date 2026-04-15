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
};