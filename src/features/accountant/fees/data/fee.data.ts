import type {
  FeeRow,
  Transaction,
  Student,
  FeeOption,
  ClassType,
  ClassFee,
  TransportSlab,
  TransportStudent,
  FeeHead,
} from "../types/fees.types";


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
  {
    id: "3",
    student: "Rahul Verma",
    admissionNo: "ADM-2024-219",
    className: "11-B",
    feeHead: "Transport Fee",
    amount: 2500,
    dueDate: "10 Apr 2025",
    daysOverdue: 2,
    reminders: 0,
    status: "warning",
  },
];


export const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "15 Apr 11:42 AM",
    className: "10-A",
    student: "Ravi Kumar",
    amount: 8500,
    mode: "UPI",
    feeHead: "Tuition Apr",
    receiptNo: "RCP-2025-0248",
  },
  {
    id: "2",
    date: "14 Apr 10:05 AM",
    className: "9-C",
    student: "Aman Gupta",
    amount: 1200,
    mode: "CASH",
    feeHead: "Library Fee",
    receiptNo: "RCP-2025-0246",
  },
];


export const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Arjun Kumar",
    admissionNo: "ADM-2024-308",
    className: "10-A",
    parentName: "Raj Kumar",
    pendingAmount: 12500,
  },
  {
    id: "s2",
    name: "Sanya Sharma",
    admissionNo: "ADM-2024-112",
    className: "9-C",
    parentName: "Suresh Sharma",
    pendingAmount: 5000,
  },
];


export const feeOptions: FeeOption[] = [
  { id: "tuition-t1", label: "Term I Tuition", amount: 12000 },
  { id: "tuition-t2", label: "Term II Tuition", amount: 12500 },
  { id: "library", label: "Library Fee", amount: 1200 },
  { id: "sports", label: "Sports Fee", amount: 800 },
  { id: "transport", label: "Transport Fee", amount: 2500 },
  { id: "exam", label: "Examination Fee", amount: 1500 },
];


export const feeHeads: FeeHead[] = [
  {
    id: "1",
    name: "Tuition Fee",
    code: "TUI-01",
    description: "Monthly academic tuition cost",
    mandatory: true,
    taxable: false,
    gst: "0%",
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "Examination Fee",
    code: "EXM-02",
    description: "Term-wise examination charges",
    mandatory: true,
    taxable: false,
    gst: "0%",
    status: "ACTIVE",
  },
  {
    id: "3",
    name: "Transport Fee",
    code: "TRN-03",
    description: "School bus facility charges",
    mandatory: false,
    taxable: false,
    gst: "5%",
    status: "ACTIVE",
  },
];


export const classes: ClassType[] = [
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
];


export const classWiseFees: ClassFee[] = [
  {
    id: "cf1",
    feeHead: "Tuition Fee",
    icon: "T",
    billingCycle: "Monthly",
    amount: 8500,
    dueDate: "5th of every month",
    annualTotal: 102000,
  },
  {
    id: "cf2",
    feeHead: "Examination Fee",
    icon: "E",
    billingCycle: "Quarterly",
    amount: 1500,
    dueDate: "1st Mar / Sep",
    annualTotal: 6000,
  },
];


export const initialSlabs: TransportSlab[] = [
  { id: "1", name: "Slab 1", from: 0, to: 3, monthly: 800, students: 45 },
  { id: "2", name: "Slab 2", from: 3, to: 6, monthly: 1200, students: 67 },
  { id: "3", name: "Slab 3", from: 6, to: 10, monthly: 1600, students: 38 },
];

export const initialStudents: TransportStudent[] = [
  {
    id: "AD4588",
    name: "Arun Sharma",
    cls: "Class 10-A",
    slabId: "2",
    distance: 4.2,
  },
  {
    id: "AD4601",
    name: "Priya Singh",
    cls: "Class 8-C",
    slabId: "1",
    distance: 1.8,
  },
];


export interface Concession {
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
  status: "ACTIVE" | "PENDING";
}

export const concessionsData: Concession[] = [
  {
    id: "1",
    studentName: "Ravi Kumar",
    studentInitials: "RK",
    studentId: "2024098",
    class: "10A",
    type: "Sibling Discount",
    typeColor: "bg-purple-100 text-purple-700",
    amount: "Rs. 1,000",
    amountUnit: "/mo",
    reason: "2nd child in school",
    approvedBy: "Principal",
    status: "ACTIVE",
  },
  {
    id: "2",
    studentName: "Priya Devi",
    studentInitials: "PD",
    studentId: "2024056",
    class: "9B",
    type: "Merit Scholarship",
    typeColor: "bg-amber-100 text-amber-700",
    amount: "50%",
    amountUnit: " tuition",
    reason: "Rank 1 in class",
    approvedBy: "Principal",
    status: "ACTIVE",
  },
];