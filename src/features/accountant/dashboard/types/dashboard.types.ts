export type StatItem = {
  label: string;
  value: string | number;
};

export type PaymentMode = "UPI" | "Cash" | "Cheque";

export type Transaction = {
  id: string;
  time: string;
  student: string;
  className: string;
  feeHead: string;
  amount: number;
  mode: PaymentMode;
};

export type PaymentModeSummary = {
  mode: PaymentMode;
  amount: number;
};

export type ReminderStatus = {
  sent: number;
  delivered: number;
  failed: number;
};