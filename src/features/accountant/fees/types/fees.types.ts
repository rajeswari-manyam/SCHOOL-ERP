export type FeeStatus = "Paid" | "Pending" | "Overdue";

export type FeeRow = {
  id: string;
  student: string;
  className: string;
  amount: number;
  dueDate: string;
  status: FeeStatus;
};

export type Transaction = {
  id: string;
  date: string;
  student: string;
  amount: number;
  mode: "UPI" | "Cash" | "Cheque";
};