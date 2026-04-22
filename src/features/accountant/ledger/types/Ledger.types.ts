

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

export type AddExpenseModalProps = {
  onClose: () => void;
  onAdd: (data: LedgerEntry) => void;
 initialData?: ExpenseFormInput;
};


export type ExpenseFormInput = {
    id?: string; 
  category: string;
  description: string;
  amount: string;
  reference?: string;
  date: string;
  paidVia: string;
  notes?: string;
};
export type SummaryItem = {
  label: string;
  amount: number;
  type: "income" | "expense";
};

export type BalanceSheetProps = {
  income: number;
  expense: number;
  chartData: MonthlyData[];
};
export interface IncomeExpenseCardsProps {
  totalIncome: number;
  feeCollection: number;
  otherIncome: number;
  totalExpense: number;
  payrollExpense: number;
  operatingExpenses: number;
  type: "income" | "expense";
}
export interface StatCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  trend?: string;
  icon: "income" | "expense" | "wallet" | "savings" | "payroll";
  variant?: "green" | "red" | "blue" | "purple";
  progress?: number;
}