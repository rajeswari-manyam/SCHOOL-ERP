import type { BillingCycle } from "../constants/fee.constants";



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

export type FeeTransaction = Transaction & {
  class?: string;
  status?: string;
};



export type FeeStatus =
  | "overdue"
  | "due-today"
  | "warning"
  | "upcoming"
  | "paid";

export type OverdueSeverity = "today" | "warning" | "critical";

export type DueStatus =
  | "All"
  | "3-Day Warning"
  | "Due Today"
  | "Overdue"
  | "Severely Overdue";

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



export type FeeFormData = {
  studentId: string;
  amount: number;
  paymentMode: PaymentMode;
  transactionId?: string;
  receiptNo?: string;
  paymentDate: string;
  selectedFees: string[];
};

export type FeeOption = {
  id: string;
  label: string;
  amount: number;
};

export interface FeeHeadFormValues {
  name: string;
  code: string;
  description?: string;
  mandatory: boolean;
  taxable: boolean;
  billingCycle: BillingCycle;
  displayOrder: string;
}

export type FilterValues = {
  search: string;
  dateFrom: string;
  dateTo: string;
  selectedClass: string;
  selectedMode: string;
  dueStatus: DueStatus;
  sortBy: string;
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



export type SectionType = "Section A" | "Section B" | "Both Same";

export type ClassType =
  | "Class 6"
  | "Class 7"
  | "Class 8"
  | "Class 9"
  | "Class 10";

export type ClassFee = {
  id: string;
  feeHead: string;
  icon: string;
  billingCycle: BillingCycle;
  amount: number | null;
  dueDate: string;
  annualTotal: number | null;
};



export type Student = {
  id: string;
  name: string;
  admissionNo: string;
  className: string;
  parentName: string;
  pendingAmount: number;
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



export interface FeeStructureProps {
  showModal: boolean;
  setShowModal: (v: boolean) => void;
}

export interface Props {
  receiptNo: string;
  amount: number;
  paymentMode: string;
  paymentDate: string;
  studentName: string;
  studentClass: string;
  onRecordAnother: () => void;
  onClose: () => void;
}

export interface TransportFeesProps {
  triggerAddSlab: boolean;
  onAddSlabHandled: () => void;
  triggerEditSlabs: boolean;
  onEditSlabsHandled: () => void;
}

export type SlabModalProps = {
  slab: TransportSlab | null;
  isAdd: boolean;
  onClose: () => void;
  onSave: (data: Omit<TransportSlab, "id" | "students">) => void;
};

export type StudentSlabAssignmentProps = {
  students: TransportStudent[];
  slabs: TransportSlab[];
  search: string;
  onSearchChange: (val: string) => void;
  pendingSlabs: Record<string, string>;
  onSlabChange: (studentId: string, slabId: string) => void;
  onSaveStudentSlab: (studentId: string) => void;
};

export type TransportSlabsTableProps = {
  slabs: TransportSlab[];
  onEdit: (slab: TransportSlab) => void;
  onDelete: (id: string) => void;
};

export type SendFeeReminderModalProps = {
  onClose: () => void;
  studentName?: string;
  studentClass?: string;
  amountOverdue?: number;
  daysPastDue?: number;
  remindersSent?: number;
  fatherPhone?: string;
  motherPhone?: string;
};

export type FilterBarProps = {
  onSearch?: (filters: FilterValues) => void;
  showDueStatus?: boolean;
  defaultDateFrom?: string;
  defaultDateTo?: string;
};

export type AllTransactionsTableProps = {
  data: Transaction[];
};

export type ConcessionCardProps = {
  row: Concession;
  onEdit?: () => void;
  onDelete?: () => void;
};

export type PendingFeesTableProps = {
  data: FeeRow[];
};

export type RecordFeePaymentModalProps = {
  onClose: () => void;
};