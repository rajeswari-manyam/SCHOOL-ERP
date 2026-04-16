import type { FeeRow, Transaction } from "../types/fees.types";

export const mockFees: FeeRow[] = [
  {
    id: "1",
    student: "Arjun Kumar",
    admissionNo: "ADM-2024-308",
    className: "10-A",
    feeHead: "Term II Tuition",
    amount: 12500,
    dueDate: "15 Mar 2025",
    daysOverdue: 15,
    reminders: 3,
    status: "overdue",
  },
  {
    id: "2",
    student: "Sanya Sharma",
    admissionNo: "ADM-2024-112",
    className: "9-C",
    feeHead: "Library Fee",
    amount: 1200,
    dueDate: "25 Mar 2025",
    daysOverdue: 5,
    reminders: 1,
    status: "warning",
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: "t1",
    date: "07 Apr 2025",
    student: "Anita Rao",
    amount: 8000,
    mode: "UPI",
    feeHead: "Term II Tuition",
    receiptNo: "RCP-2025-0412",
  },
  {
    id: "t2",
    date: "06 Apr 2025",
    student: "Dev Mehta",
    amount: 1200,
    mode: "CASH",
    feeHead: "Library Fee",
    receiptNo: "RCP-2025-0411",
  },
];
// Add to your existing fee.data.ts

export const mockStudents = [
  { id: "s1", name: "Arjun Kumar",  admissionNo: "ADM-2024-308", className: "10-A", parentName: "Raj Kumar", pendingAmount: 12500 },
  { id: "s2", name: "Sanya Sharma", admissionNo: "ADM-2024-112", className: "9-C", parentName: "Suresh Sharma", pendingAmount: 5000 },
  { id: "s3", name: "Anita Rao",    admissionNo: "ADM-2024-201", className: "8-B", parentName: "Mohan Rao", pendingAmount: 0 },
  { id: "s4", name: "Dev Mehta",    admissionNo: "ADM-2024-175", className: "11-A", parentName: "Anil Mehta", pendingAmount: 2500 },
];

export const feeOptions = [
  { id: "tuition-t2", label: "Term II Tuition",  amount: 12500 },
  { id: "library",    label: "Library Fee",       amount: 1200  },
  { id: "sports",     label: "Sports Fee",        amount: 800   },
  { id: "transport",  label: "Transport Fee",     amount: 2500  },
  { id: "exam",       label: "Examination Fee",   amount: 1500  },
];