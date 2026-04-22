export type StatItem = {
  label: string;
  value: string | number;
};

export type PaymentMode = "UPI" | "CASH" | "CHEQUE" | "ONLINE";

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

export type MonthlyTrendItem = {
  month: string;
  actual: number;
  target: number;
};

export type PaymentModeBreakdownItem = {
  mode: PaymentMode;
  dot: string;
  volume: number;
  growth: number;
};

export type TopPayingClassItem = {
  className: string;
  amount: number;
  pct: number; 
};