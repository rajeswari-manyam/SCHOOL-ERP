import type { BillingCycle } from "../constants/fee.constants";

// ─── Payment ──────────────────────────────────────────────────────────────────

/** Extended payment modes: BANK added alongside CASH, UPI, CARD, CHEQUE */
export type PaymentMode = "UPI" | "CASH" | "CARD" | "CHEQUE" | "BANK";

/**
 * NEW: Three-state payment status for partial payment support.
 * PAID       → paidAmount === totalAmount
 * PARTIAL    → 0 < paidAmount < totalAmount
 * PENDING    → paidAmount === 0
 */
export type PaymentStatus = "PAID" | "PARTIAL" | "PENDING";

// ─── Transactions ─────────────────────────────────────────────────────────────

export type Transaction = {
  id: string;
  studentId?: string;
  date: string;
  student: string;
  className: string;
  /** Total fee amount originally due */
  amount: number;
  /** NEW: amount the student actually paid in this transaction */
  paidAmount: number;
  /** NEW: amount still outstanding after payment */
  remainingAmount: number;
  /** NEW: PAID | PARTIAL | PENDING */
  status: PaymentStatus;
  mode: PaymentMode;
  /** NEW: reference for UPI / CARD / BANK transfers */
  transactionId?: string;
  feeHead?: string;
  receiptNo?: string;
};

export type FeeTransaction = Transaction & {
  class?: string;
};

// ─── Fee record ───────────────────────────────────────────────────────────────

export type Fee = {
  id: string;
  studentId: string;
  studentName: string;
  studentInitials: string;
  studentAdmissionId: string;
  class: string;
  /** NEW: section within the class, e.g. "A" | "B" */
  section?: string;
  feeHead: string;
  amount: number;
  /** NEW: cumulative amount paid across all partial/full payments */
  paidAmount: number;
  /** NEW: amount still due (amount - paidAmount) */
  remainingAmount: number;
  dueDate: string;
  /** NEW: days after dueDate before lateFee starts accruing */
  gracePeriod: number;
  /** NEW: late fee calculated if overdue beyond gracePeriod */
  lateFee: number;
  daysOverdue: number;
  reminders: number;
  status: FeeStatus;
  /** NEW: payment lifecycle status */
  paymentStatus: PaymentStatus;
  overdueSeverity: OverdueSeverity;
  billingCycle: BillingCycle;
};

export type FeeCreateInput = {
  studentId: string;
  feeHead: string;
  amount: number;
  dueDate: string;
  gracePeriod?: number;
  billingCycle: BillingCycle;
  /** NEW: class + section for correct fee assignment */
  classId: string;
  sectionId?: string;
};

export type FeeUpdateInput = {
  feeHead?: string;
  amount?: number;
  dueDate?: string;
  gracePeriod?: number;
  billingCycle?: BillingCycle;
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

// ─── Payment form ─────────────────────────────────────────────────────────────

export type FeeFormData = {
  studentId: string;
  /** Amount student is paying NOW (may be partial) */
  paymentAmount: number;
  paymentMode: PaymentMode;
  /** Required for UPI / CARD / BANK */
  transactionId?: string;
  receiptNo?: string;
  paymentDate: string;
  selectedFees: string[];
};

export type FeeOption = {
  id: string;
  label: string;
  amount: number;
  /** Portion already paid on this fee item */
  paidAmount: number;
  /** Remaining outstanding on this fee item */
  remainingAmount: number;
  overdue?: boolean;
  dueDate?: string;
  /** Applicable late fee for this item */
  lateFee?: number;
};

// ─── Fee head ─────────────────────────────────────────────────────────────────

export interface FeeHeadFormValues {
  name: string;
  description?: string;
  displayOrder: string;
  status: "active" | "inactive";
}

export interface AssignedStudent {
  id: string;
  first_name: string;
  last_name: string;
  admission_number: string;
}

export interface FeeStructureAssignment {
  id: string;
  feeHeadId: string;
  feeHeadName: string;
  classId: string;
  className: string;
  sectionId: string | null;
  sectionName: string | null;
  mandatory: boolean;
  billingCycle: BillingCycle;
  dueDate: string;
  amount: number | null;
  annualTotal: number | null;
  applicableTo?: "ALL_STUDENTS" | "SELECTED_STUDENTS";
  allowConcession?: boolean;
  status?: string;
  academicYear?: string;
  studentIds?: string[];
  assignedStudents?: AssignedStudent[];
}

export interface FeeStructureFormValues {
  feeHeadId: string;
  classId: string;
  sectionId: string;
  applicableTo: "all" | "selected";
  mandatory: boolean;
  billingCycle: BillingCycle;
  dueDate: string;
  amount: string;
  annualTotal: string;
  studentIds: string[];
  allowConcession: boolean;
  allowedConcessionTypes: string[];
}

export interface StudentWithFee {
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: string;
  sectionName: string;
  selected: boolean;
}

export type FeeHeadStatus = "ACTIVE" | "INACTIVE";

export type FeeHead = {
  id: string;
  name: string;
  code?: string;
  description?: string;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

// ─── Class / fee structure ────────────────────────────────────────────────────

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
  /** NEW: days of grace before late fee triggers */
  gracePeriod: number;
  /** NEW: flat or percentage late fee */
  lateFeeAmount: number;
  lateFeeType: "flat" | "percentage";
  annualTotal: number | null;
  /** NEW: which class this fee belongs to */
  classId: string;
  /** NEW: which section(s); null means all sections */
  sectionId: string | null;
};

// ─── Filters ──────────────────────────────────────────────────────────────────

export type FilterValues = {
  search: string;
  dateFrom: string;
  dateTo: string;
  /** Class/section IDs from getAllClasses / getSectionsByClassId — "" means no filter */
  classId: string;
  sectionId: string;
  selectedMode: string;
  dueStatus: DueStatus;
  sortBy: string;
};

export type FeeRow = {
  id: string;
  studentId?: string;
  student: string;
  admissionNo: string;
  className: string;
  feeHead: string;
  originalAmount: number;
  discountAmount: number;
  amount: number;       // finalAmount (after discount)
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  daysOverdue: number;
  lateFee?: number;
  reminders: number;
  status: FeeStatus;
  paymentStatus: PaymentStatus;
};

// ─── Student ──────────────────────────────────────────────────────────────────

export type Student = {
  id: string;
  name: string;
  admissionNo: string;
  className: string;
  /** NEW: section within the class */
  section?: string;
  parentName: string;
  pendingAmount: number;
};

// ─── Transport ────────────────────────────────────────────────────────────────

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

// ─── Concession ───────────────────────────────────────────────────────────────

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

// ─── Component props ──────────────────────────────────────────────────────────

export interface FeeStructureProps {
  showModal: boolean;
  setShowModal: (v: boolean) => void;
}

export interface Props {
  receiptNo: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
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
