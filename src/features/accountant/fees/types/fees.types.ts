export type PaymentMode = "UPI" | "CASH" | "CARD";

/* =========================
   STATUS TYPE (define first)
========================= */
export type FeeStatus =
  | "overdue"
  | "due-today"
  | "warning"
  | "upcoming"
  | "paid";

/* =========================
   CORE TYPES
========================= */
export type FeeFormData = {
  studentId: string;
  amount: number;
  paymentMode: PaymentMode;
  transactionId?: string;
  receiptNo?: string;
  paymentDate: string;
  selectedFees: string[];
};

export type FeeRow = {
  id: string;
  student: string;
  admissionNo: string;
  className: string;
  feeHead: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  reminders: number;
  status: FeeStatus;
};

export type Transaction = {
  id: string;
  date: string;
  student: string;
  amount: number;
  mode: PaymentMode;
  feeHead?: string;
  receiptNo?: string;
};

export type Student = {
  id: string;
  name: string;
  admissionNo: string;
  className: string;
  parentName: string;
  pendingAmount: number;
};

export type FeeOption = {
  id: string;
  label: string;
  amount: number;
};