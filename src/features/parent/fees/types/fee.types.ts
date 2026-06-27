import type { LucideIcon } from "lucide-react";

export type FeeStatus = "paid" | "pending" | "overdue" | "upcoming";

export interface Fee {
  id: string;
  feeid: string;
  fee_type?: string;
  academicYearId: string;
  term: string;
  dueDate: string;
  amount: number;
  totalFee?: number;
  originalAmount?: number;
  discountAmount?: number;
  paidAmount?: number;
  status: FeeStatus;
  daysOverdue?: number;
  reminder?: string;
}

export interface FeeCardProps {
  fee: Fee;
  onPay: () => void;
}

export interface PaymentHistory {
  id: string;
  date: string;
  feeHead: string;
  amount: number;
  mode: string;
  receiptNo: string;
}

export interface FeeHistoryProps {
  data: PaymentHistory[];
  onDelete?: (paymentId: string) => Promise<void>;
}

export type Tab = "pending" | "history" | "annual";

export interface AllPaidStateProps {
  onTabChange: (t: Tab) => void;
  studentName?: string;
  month?: string;
  lastPayment?: { amount: number; date: string; mode: string } | null;
  nextDue?: { label: string; date: string } | null;
  phone?: string;
  balance?: number;
  standing?: string;
  consecutiveOnTime?: number;
}

export interface FeeBannerProps {
  text: string;
  onPayNow?: () => void;
}

export interface PaymentModalProps {
  fee: Fee;
  onClose: () => void;
  onSuccess: (mode: string, amount: number, txnId: string, date: string) => void;
  studentId?: string;
  studentName?: string;
  studentClass?: string;
}

export interface MonthStatus {
  label: string;
  paid?: boolean;
  pending?: boolean;
  upcoming?: boolean;
}

export interface ExamTerm {
  label: string;
  amount: number;
  paid?: boolean;
  pending?: boolean;
  upcoming?: boolean;
}

export interface FeeProgressCardProps {
  tuitionMonths: MonthStatus[];
  examTerms: ExamTerm[];
}

export type HelpBarVariant = "banner" | "cards";

export interface HelpBarProps {
  variant?: HelpBarVariant;
}

export interface PaymentMethod {
  id: string;
  label: string;
  Icon: LucideIcon;
}

export interface PaymentMethodsProps {
  defaultSelected?: string;
  onChange?: (methodId: string) => void;
}

export interface PaymentSuccessModalProps {
  amount: number;
  feeHead: string;
  mode: string;
  receiptNo?: string;
  date?: string;
  studentName?: string;
  className?: string;
  whatsappNumber?: string;
  onDownload?: () => void;
  onBack: () => void;
}

export interface SessionSummaryProps {
  totalFees: number;
  paidAmount: number;
  currency?: string;
}

export interface StudentCardProps {
  name: string;
  className: string;
  rollNo: string;
  status: "good" | "warning" | "blocked";
}
