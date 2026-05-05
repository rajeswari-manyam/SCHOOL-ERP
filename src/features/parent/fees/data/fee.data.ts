import { Zap, CreditCard, Landmark } from "lucide-react";
import type { Fee, PaymentHistory, MonthStatus, ExamTerm, PaymentMethod } from "../types/fee.types";

export const paidFeeSummary = {
  month: "April 2025",
  studentName: "Ravi Kumar",
  lastPayment: {
    amount: 8500,
    date: "1 April 2025",
    mode: "UPI",
  },
  nextDue: {
    label: "May fees",
    date: "5 May 2025",
  },
  phone: "+91 98765 43210",
  balance: 0,
  standing: "Excellent",
  consecutiveOnTime: 12,
};

export const feeBannerDummy = {
  text: "Fee payment for May 2025 is pending. Please pay before due date to avoid late charges.",
};

export const feeList: Fee[] = [
  {
    id: "fee_1",
    term: "Term 1 - Tuition Fee",
    dueDate: "10 Apr 2025",
    amount: 8500,
    status: "overdue",
    daysOverdue: 5,
    reminder: "Reminder sent on WhatsApp",
  },
  {
    id: "fee_2",
    term: "Term 2 - Exam Fee",
    dueDate: "25 Apr 2025",
    amount: 3200,
    status: "upcoming",
    reminder: "No reminder sent yet",
  },
  {
    id: "fee_3",
    term: "Annual Sports Fee",
    dueDate: "01 May 2025",
    amount: 1500,
    status: "upcoming",
    reminder: "No reminder sent yet",
  },
];

export const feeHistoryDummy: PaymentHistory[] = [
  {
    id: "tx_1",
    date: "01 Apr 2025",
    feeHead: "Tuition Fee - Term 1",
    amount: 8500,
    mode: "UPI",
    receiptNo: "RCPT-10021",
  },
  {
    id: "tx_2",
    date: "15 Mar 2025",
    feeHead: "Exam Fee",
    amount: 1200,
    mode: "Card",
    receiptNo: "RCPT-10011",
  },
  {
    id: "tx_3",
    date: "10 Feb 2025",
    feeHead: "Library Fee",
    amount: 500,
    mode: "Cash",
    receiptNo: "RCPT-10005",
  },
  {
    id: "tx_4",
    date: "05 Jan 2025",
    feeHead: "Sports Fee",
    amount: 1500,
    mode: "UPI",
    receiptNo: "RCPT-10001",
  },
];

export const feeDummy: Fee = {
  id: "fee_101",
  term: "Tuition Fee - Term 1",
  amount: 8500,
  dueDate: "10 Apr 2025",
  status: "pending",
};

export const tuitionMonths: MonthStatus[] = [
  { label: "OCT", paid: true },
  { label: "NOV", paid: true },
  { label: "DEC", paid: true },
  { label: "JAN", paid: true },
  { label: "FEB", paid: true },
  { label: "MAR", paid: true },
  { label: "APR", pending: true },
  { label: "MAY", upcoming: true },
  { label: "JUN", upcoming: true },
  { label: "JUL", upcoming: true },
  { label: "AUG", upcoming: true },
  { label: "SEP", upcoming: true },
];

export const examTerms: ExamTerm[] = [
  { label: "Term 1", amount: 2000, paid: true },
  { label: "Term 2", amount: 2000, paid: true },
  { label: "Term 3", amount: 2000, pending: true },
  { label: "Term 4", amount: 2000, upcoming: true },
];

export const helpBarBannerData = {
  title: "Need help with fee payments?",
  description: "Contact the school accounts department for any discrepancies.",
  buttons: {
    call: "Call Office",
    query: "Raise Query",
  },
};

export const helpBarCardsData = {
  needHelp: {
    title: "Need Help?",
    description:
      "Questions regarding fee structure or missed payments? Contact our administrative office.",
    button: "Contact Admin",
  },
  refund: {
    title: "Refund Policy",
    description:
      "Read about our fee refund guidelines and cancellation policies for the academic year.",
    button: "View Policy",
  },
  quickPay: {
    title: "Quick Pay",
    description:
      "You have no upcoming dues for the next 30 days. You're all caught up!",
    status: "Excellent",
  },
};

export const paymentMethods: PaymentMethod[] = [
  { id: "upi", label: "UPI Payment", Icon: Zap },
  { id: "card", label: "Credit / Debit Card", Icon: CreditCard },
  { id: "bank", label: "Net Banking", Icon: Landmark },
];

export const paymentSuccessDefaults = {
  receiptNo: "RCP-2025-0848",
  date: "7 April 2025",
  studentName: "Ravi Kumar",
  className: "10A",
  whatsappNumber: "+91 98765 43210",
};

export const sessionSummaryData = {
  totalFees: 145000,
  paidAmount: 104400,
  currency: "INR",
};

export const studentCardData: {
  name: string;
  className: string;
  rollNo: number;
  status: "good" | "warning" | "blocked";
} = {
  name: "Ravi Kumar",
  className: "10A",
  rollNo: 24,
  status: "good",
};