export type PaymentMode = "Cash" | "UPI" | "Cheque" | "Bank Transfer";
export type FeeStatusFilter = "All" | "3-Day Warning" | "Due Today" | "Overdue" | "Severely Overdue";
export type SortOption = "Days Overdue" | "Amount" | "Name" | "Due Date";
export type CollectionCycleStatus = "Active" | "Inactive";

export interface FeeHead {
  id: string;
  name: string;
  code: string;
  mandatory: boolean;
  taxable: boolean;
  gstPercent: number;
  status: "Active" | "Inactive";
}

export interface TransportSlab {
  slab: string;
  range: string;
  monthly: number;
  students: number;
}

export interface ClassFeeStructure {
  feeHeadId: string;
  feeHeadName: string;
  subtitle: string;
  billingCycle: "Monthly" | "Quarterly" | "Annually";
  dueDate: string;
  amount: number;
  annualTotal: number;
}

export interface PendingFee {
  studentId: string;
  studentName: string;
  admissionNo: string;
  initials: string;
  class: string;
  section: string;
  feeHead: string;
  amount: number;
  dueDate: string;
  daysOverdue: number | null;
  daysRemaining: number | null;
  isDueToday: boolean;
  reminders: { sent: number; total: number };
  parentPhone: string;
}

export interface FeeTransaction {
  receiptNo: string;
  dateTime: string;
  studentName: string;
  class: string;
  feeHead: string;
  amount: number;
  mode: PaymentMode;
  sentToParent: boolean;
}

export interface RecordPaymentForm {
  studentId: string;
  feeHead: string;
  amountDue: number;
  amountReceived: number;
  paymentMode: PaymentMode;
  upiReference?: string;
  receiptNumber: string;
  paymentDate: string;
  notes?: string;
  sendWhatsApp: boolean;
  parentPhone: string;
}

export interface FeeStats {
  totalOutstanding: number;
  pendingStudents: number;
  collectedThisMonth: number;
  collectedPercent: number;
  remindersToday: number;
  reminderTime: string;
  severelyOverdue: number;
}

export interface PeriodSummary {
  totalPayments: number;
  collected: number;
  breakdown: {
    cash: number;
    upi: number;
    cheque: number;
    bankTransfer: number;
  };
}