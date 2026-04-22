export type PaymentMode = "UPI" | "CASH" | "CHEQUE" | "ONLINE";

export type Transaction = {
  id: string;
  date: string;
  student: string;
    className: string;   
  amount: number;
  mode: PaymentMode;
  feeHead?: string;
  receiptNo?: string;
};

export type FeeStatus =
  | "overdue"
  | "due-today"
  | "warning"
  | "upcoming"
  | "paid";

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


export type FeeHeadStatus = "ACTIVE" | "INACTIVE";

export type FeeHead = {
  id: string;
  name: string;
  code: string;
  description: string;
  mandatory: boolean;
  taxable: boolean;
  gst: string;
  status: FeeHeadStatus;
};

export type BillingCycle = "Monthly" | "Quarterly" | "Annual" | "One-Time";

export type SectionType = "Section A" | "Section B" | "Both Same";

export type ClassType =
  | "Class 6" | "Class 7" | "Class 8" | "Class 9" | "Class 10";

export type ClassFee = {
  id: string;
  feeHead: string;
  icon: string;
  billingCycle: BillingCycle;
  amount: number | null;
  dueDate: string;
  annualTotal: number | null;
};
export type TransportSlab = {
  id: string;
  name: string;
  from: number;
  to: number | null;
  monthly: number;
  students: number;
};

export type TransportStudent = {
  id: string;
  name: string;
  cls: string;
  slabId: string;
  distance: number;
  routeId?: string;
  pickupPoint?: string;
};

export type ConcessionStatus = "ACTIVE" | "PENDING";

export type Concession = {
  id: string;
  studentName: string;
  studentInitials: string;
  studentId: string;
  class: string;
  type: string;
  typeColor: string;
  amount: string;
  amountUnit?: string;
  reason: string;
  approvedBy: string;
  status: ConcessionStatus;
};
