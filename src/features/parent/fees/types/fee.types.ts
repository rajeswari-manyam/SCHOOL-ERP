export type FeeStatus = "paid" | "pending" | "overdue" | "upcoming";

export interface Fee {
  id: string;
  term: string;
  amount: number;
  paid: number;
  dueDate: string;
  status: FeeStatus;
  daysOverdue?: number;
  reminder?: string;
  receiptNo?: string;
  mode?: string;
}

export interface PaymentHistory {
  id: string;
  date: string;
  feeHead: string;
  amount: number;
  mode: string;
  receiptNo: string;
}