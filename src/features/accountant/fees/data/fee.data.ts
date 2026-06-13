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
  FeeStructureAssignment,
  StudentWithFee,
} from "../types/fees.types";

export const mockFees: FeeRow[] = [
  {
    id: "1",
    student: "Arjun Kumar",
    admissionNo: "ADM-2024-308",
    className: "10-A",
    feeHead: "Term II Tuition",
    amount: 12500,
    paidAmount: 0,
    remainingAmount: 12500,
    dueDate: "15 Mar 2025",
    daysOverdue: 15,
    lateFee: 12500 * 0.02 * 15,
    reminders: 3,
    status: "overdue",
    paymentStatus: "PENDING",
  },
  {
    id: "2",
    student: "Sanya Sharma",
    admissionNo: "ADM-2024-112",
    className: "9-C",
    feeHead: "Library Fee",
    amount: 1200,
    paidAmount: 0,
    remainingAmount: 1200,
    dueDate: "25 Mar 2025",
    daysOverdue: 5,
    lateFee: 1200 * 0.02 * 5,
    reminders: 1,
    status: "warning",
    paymentStatus: "PENDING",
  },
  {
    id: "3",
    student: "Rahul Verma",
    admissionNo: "ADM-2024-219",
    className: "11-B",
    feeHead: "Transport Fee",
    amount: 2500,
    paidAmount: 0,
    remainingAmount: 2500,
    dueDate: "10 Apr 2025",
    daysOverdue: 2,
    lateFee: 2500 * 0.02 * 2,
    reminders: 0,
    status: "warning",
    paymentStatus: "PENDING",
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "15 Apr 11:42 AM",
    className: "10-A",
    student: "Ravi Kumar",
    amount: 8500,
    paidAmount: 8500,
    remainingAmount: 0,
    status: "PAID",
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
    paidAmount: 1200,
    remainingAmount: 0,
    status: "PAID",
    mode: "CASH",
    feeHead: "Library Fee",
    receiptNo: "RCP-2025-0246",
  },
  {
    id: "3",
    date: "13 Apr 02:30 PM",
    className: "11-B",
    student: "Priya Singh",
    amount: 2500,
    paidAmount: 2500,
    remainingAmount: 0,
    status: "PAID",
    mode: "UPI",
    feeHead: "Transport Fee",
    receiptNo: "RCP-2025-0245",
  },
  {
    id: "4",
    date: "12 Apr 09:15 AM",
    className: "10-A",
    student: "Arjun Kumar",
    amount: 12500,
    paidAmount: 12500,
    remainingAmount: 0,
    status: "PAID",
    mode: "CHEQUE",
    feeHead: "Term II Tuition",
    receiptNo: "RCP-2025-0243",
  },
  {
    id: "5",
    date: "11 Apr 04:20 PM",
    className: "9-C",
    student: "Sanya Sharma",
    amount: 1200,
    paidAmount: 1200,
    remainingAmount: 0,
    status: "PAID",
    mode: "UPI",
    feeHead: "Library Fee",
    receiptNo: "RCP-2025-0242",
  },
  {
    id: "6",
    date: "10 Apr 11:00 AM",
    className: "11-B",
    student: "Rahul Verma",
    amount: 2500,
    paidAmount: 2500,
    remainingAmount: 0,
    status: "PAID",
    mode: "CASH",
    feeHead: "Transport Fee",
    receiptNo: "RCP-2025-0240",
  },
  {
    id: "7",
    date: "09 Apr 03:45 PM",
    className: "10-A",
    student: "Ravi Kumar",
    amount: 8500,
    paidAmount: 8500,
    remainingAmount: 0,
    status: "PAID",
    mode: "UPI",
    feeHead: "Tuition Mar",
    receiptNo: "RCP-2025-0238",
  },
  {
    id: "8",
    date: "08 Apr 10:30 AM",
    className: "9-C",
    student: "Aman Gupta",
    amount: 1200,
    paidAmount: 1200,
    remainingAmount: 0,
    status: "PAID",
    mode: "CHEQUE",
    feeHead: "Library Fee",
    receiptNo: "RCP-2025-0237",
  },
  {
    id: "9",
    date: "07 Apr 01:15 PM",
    className: "11-B",
    student: "Priya Singh",
    amount: 2500,
    paidAmount: 2500,
    remainingAmount: 0,
    status: "PAID",
    mode: "UPI",
    feeHead: "Transport Fee",
    receiptNo: "RCP-2025-0235",
  },
  {
    id: "10",
    date: "06 Apr 09:00 AM",
    className: "10-A",
    student: "Arjun Kumar",
    amount: 12500,
    paidAmount: 12500,
    remainingAmount: 0,
    status: "PAID",
    mode: "CASH",
    feeHead: "Term II Tuition",
    receiptNo: "RCP-2025-0234",
  }
];

export const mockStudents: Student[] = [
  { id: "s1", name: "Arjun Kumar", admissionNo: "ADM-2024-308", className: "10-A", parentName: "Raj Kumar", pendingAmount: 12500 },
  { id: "s2", name: "Sanya Sharma", admissionNo: "ADM-2024-112", className: "9-C", parentName: "Suresh Sharma", pendingAmount: 5000 },
];

export const feeOptions: FeeOption[] = [
  { id: "tuition-t1", label: "Term I Tuition", amount: 12000, paidAmount: 0, remainingAmount: 12000 },
  { id: "tuition-t2", label: "Term II Tuition", amount: 12500, paidAmount: 0, remainingAmount: 12500 },
  { id: "library", label: "Library Fee", amount: 1200, paidAmount: 0, remainingAmount: 1200 },
  { id: "sports", label: "Sports Fee", amount: 800, paidAmount: 0, remainingAmount: 800 },
  { id: "transport", label: "Transport Fee", amount: 2500, paidAmount: 0, remainingAmount: 2500 },
  { id: "exam", label: "Examination Fee", amount: 1500, paidAmount: 0, remainingAmount: 1500 },
];

export const feeHeads: FeeHead[] = [
  { id: "fh1", name: "Tuition Fee", code: "TUI-01", description: "Monthly academic tuition cost" },
  { id: "fh2", name: "Examination Fee", code: "EXM-02", description: "Term-wise examination charges" },
  { id: "fh3", name: "Transport Fee", code: "TRN-03", description: "School bus facility charges" },
  { id: "fh4", name: "Library Fee", code: "LIB-04", description: "Annual library membership" },
  { id: "fh5", name: "Activity Fee", code: "ACT-05", description: "Co-curricular activities" },
  { id: "fh6", name: "Lab Fee", code: "LAB-06", description: "Science lab charges" },
];

export const classes: ClassType[] = [
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
];

export const mockClassList: { id: string; name: string }[] = [
  { id: "c1", name: "Class 6" },
  { id: "c2", name: "Class 7" },
  { id: "c3", name: "Class 8" },
  { id: "c4", name: "Class 9" },
  { id: "c5", name: "Class 10" },
];

export const mockSections: { id: string; sectionName: string; classId: string }[] = [
  { id: "sec1", sectionName: "Section A", classId: "c1" },
  { id: "sec2", sectionName: "Section B", classId: "c1" },
  { id: "sec3", sectionName: "Section A", classId: "c2" },
  { id: "sec4", sectionName: "Section B", classId: "c2" },
  { id: "sec5", sectionName: "Section A", classId: "c3" },
  { id: "sec6", sectionName: "Section B", classId: "c3" },
  { id: "sec7", sectionName: "Section A", classId: "c4" },
  { id: "sec8", sectionName: "Section B", classId: "c4" },
  { id: "sec9", sectionName: "Section A", classId: "c5" },
  { id: "sec10", sectionName: "Section B", classId: "c5" },
];

export const mockStudentsList: StudentWithFee[] = [
  { studentId: "st1", studentName: "Arjun Kumar", admissionNo: "ADM-2024-001", className: "Class 6", sectionName: "Section A", selected: false },
  { studentId: "st2", studentName: "Priya Sharma", admissionNo: "ADM-2024-002", className: "Class 6", sectionName: "Section A", selected: false },
  { studentId: "st3", studentName: "Rahul Verma", admissionNo: "ADM-2024-003", className: "Class 6", sectionName: "Section B", selected: false },
  { studentId: "st4", studentName: "Sanya Gupta", admissionNo: "ADM-2024-004", className: "Class 7", sectionName: "Section A", selected: false },
  { studentId: "st5", studentName: "Rohit Singh", admissionNo: "ADM-2024-005", className: "Class 7", sectionName: "Section B", selected: false },
  { studentId: "st6", studentName: "Ananya Patel", admissionNo: "ADM-2024-006", className: "Class 8", sectionName: "Section A", selected: false },
  { studentId: "st7", studentName: "Vikram Reddy", admissionNo: "ADM-2024-007", className: "Class 8", sectionName: "Section B", selected: false },
  { studentId: "st8", studentName: "Neha Jain", admissionNo: "ADM-2024-008", className: "Class 9", sectionName: "Section A", selected: false },
  { studentId: "st9", studentName: "Amit Kumar", admissionNo: "ADM-2024-009", className: "Class 9", sectionName: "Section B", selected: false },
  { studentId: "st10", studentName: "Divya Nair", admissionNo: "ADM-2024-010", className: "Class 10", sectionName: "Section A", selected: false },
  { studentId: "st11", studentName: "Karan Mehta", admissionNo: "ADM-2024-011", className: "Class 10", sectionName: "Section B", selected: false },
  { studentId: "st12", studentName: "Ishita Sharma", admissionNo: "ADM-2024-012", className: "Class 6", sectionName: "Section A", selected: false },
];

export const mockAssignments: FeeStructureAssignment[] = [
  { id: "fs1", feeHeadId: "fh1", feeHeadName: "Tuition Fee", classId: "c1", className: "Class 6", sectionId: null, sectionName: null, mandatory: true, billingCycle: "Monthly", dueDate: "2025-05-05", amount: 8500, annualTotal: 102000, studentIds: [] },
  { id: "fs2", feeHeadId: "fh2", feeHeadName: "Examination Fee", classId: "c2", className: "Class 7", sectionId: null, sectionName: null, mandatory: true, billingCycle: "Quarterly", dueDate: "2025-06-01", amount: 1500, annualTotal: 6000, studentIds: [] },
  { id: "fs3", feeHeadId: "fh3", feeHeadName: "Transport Fee", classId: "c1", className: "Class 6", sectionId: "sec1", sectionName: "Section A", mandatory: false, billingCycle: "Monthly", dueDate: "2025-05-10", amount: 2500, annualTotal: 30000, studentIds: ["st1", "st2"] },
  { id: "fs4", feeHeadId: "fh4", feeHeadName: "Library Fee", classId: "c5", className: "Class 10", sectionId: null, sectionName: null, mandatory: false, billingCycle: "Annual", dueDate: "2025-04-15", amount: 2000, annualTotal: 2000, studentIds: ["st10", "st11"] },
];

export const classWiseFees: ClassFee[] = [
  {
    id: "cf1",
    feeHead: "Tuition Fee",
    icon: "T",
    billingCycle: "Monthly",
    amount: 8500,
    dueDate: "5th of every month",
    gracePeriod: 5,
    lateFeeAmount: 50,
    lateFeeType: "flat",
    annualTotal: 102000,
    classId: "all",
    sectionId: null,
  },
  {
    id: "cf2",
    feeHead: "Examination Fee",
    icon: "E",
    billingCycle: "Quarterly",
    amount: 1500,
    dueDate: "1st Mar / Sep",
    gracePeriod: 7,
    lateFeeAmount: 100,
    lateFeeType: "flat",
    annualTotal: 6000,
    classId: "all",
    sectionId: null,
  },
];

export const initialSlabs: TransportSlab[] = [
  { id: "1", name: "Slab 1", from: 0, to: 3, monthly: 800, students: 45 },
  { id: "2", name: "Slab 2", from: 3, to: 6, monthly: 1200, students: 67 },
  { id: "3", name: "Slab 3", from: 6, to: 10, monthly: 1600, students: 38 },
];

export const initialStudents: TransportStudent[] = [
  { id: "AD4588", name: "Arun Sharma", cls: "Class 10-A", slabId: "2", distance: 4.2 },
  { id: "AD4601", name: "Priya Singh", cls: "Class 8-C", slabId: "1", distance: 1.8 },
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
  { id: "1", studentName: "Ravi Kumar", studentInitials: "RK", studentId: "2024098", class: "10A", type: "Sibling Discount", typeColor: "bg-purple-100 text-purple-700", amount: "Rs. 1,000", amountUnit: "/mo", reason: "2nd child in school", approvedBy: "Principal", status: "ACTIVE" },
  { id: "2", studentName: "Priya Devi", studentInitials: "PD", studentId: "2024056", class: "9B", type: "Merit Scholarship", typeColor: "bg-amber-100 text-amber-700", amount: "50%", amountUnit: " tuition", reason: "Rank 1 in class", approvedBy: "Principal", status: "ACTIVE" },
];

let nextHeadId = feeHeads.length + 1;
let nextAssignmentId = mockAssignments.length + 1;

export const getNextHeadId = () => `fh${nextHeadId++}`;
export const getNextAssignmentId = () => `fs${nextAssignmentId++}`;