import type {
  PendingFee,
  FeeTransaction,
  FeeHead,
  TransportSlab,
  ClassFeeStructure,
  FeeStats,
  PeriodSummary,
  RecordPaymentForm,
} from "../types/fees.types";

export const MOCK_FEE_STATS: FeeStats = {
  totalOutstanding: 118000,
  pendingStudents: 89,
  collectedThisMonth: 234000,
  collectedPercent: 66,
  remindersToday: 47,
  reminderTime: "8:00 AM",
  severelyOverdue: 12,
};

export const MOCK_PENDING_FEES: PendingFee[] = [
  {
    studentId: "1",
    studentName: "Ravi Teja",
    admissionNo: "ADM20230492",
    initials: "RT",
    class: "10",
    section: "A",
    feeHead: "Tuition Fee",
    amount: 8500,
    dueDate: "22 Mar 2025",
    daysOverdue: 16,
    daysRemaining: null,
    isDueToday: false,
    reminders: { sent: 3, total: 3 },
    parentPhone: "+91 98765 43210",
  },
  {
    studentId: "2",
    studentName: "Priya Sharma",
    admissionNo: "ADM20230811",
    initials: "PS",
    class: "9",
    section: "B",
    feeHead: "Tuition Fee",
    amount: 8000,
    dueDate: "28 Mar 2025",
    daysOverdue: 10,
    daysRemaining: null,
    isDueToday: false,
    reminders: { sent: 2, total: 3 },
    parentPhone: "+91 87654 32109",
  },
  {
    studentId: "3",
    studentName: "Kiran Kumar",
    admissionNo: "ADM20230214",
    initials: "KK",
    class: "8",
    section: "A",
    feeHead: "Exam Fee",
    amount: 4500,
    dueDate: "01 Apr 2025",
    daysOverdue: 6,
    daysRemaining: null,
    isDueToday: false,
    reminders: { sent: 1, total: 3 },
    parentPhone: "+91 76543 21098",
  },
  {
    studentId: "4",
    studentName: "Suresh Reddy",
    admissionNo: "ADM20230557",
    initials: "SR",
    class: "7",
    section: "B",
    feeHead: "Tuition Fee",
    amount: 3000,
    dueDate: "04 Apr 2025",
    daysOverdue: null,
    daysRemaining: 4,
    isDueToday: false,
    reminders: { sent: 1, total: 3 },
    parentPhone: "+91 65432 10987",
  },
  {
    studentId: "5",
    studentName: "Anitha Devi",
    admissionNo: "ADM20230321",
    initials: "AD",
    class: "6",
    section: "A",
    feeHead: "Transport Fee",
    amount: 2500,
    dueDate: "07 Apr 2025",
    daysOverdue: null,
    daysRemaining: null,
    isDueToday: true,
    reminders: { sent: 0, total: 3 },
    parentPhone: "+91 54321 09876",
  },
  {
    studentId: "6",
    studentName: "Venkat Rao",
    admissionNo: "ADM20230109",
    initials: "VR",
    class: "10",
    section: "B",
    feeHead: "Activity Fee",
    amount: 1500,
    dueDate: "15 Mar 2025",
    daysOverdue: 23,
    daysRemaining: null,
    isDueToday: false,
    reminders: { sent: 3, total: 3 },
    parentPhone: "+91 43210 98765",
  },
  {
    studentId: "7",
    studentName: "Deepa Kumari",
    admissionNo: "ADM20230445",
    initials: "DK",
    class: "9",
    section: "A",
    feeHead: "Tuition Fee",
    amount: 8500,
    dueDate: "20 Mar 2025",
    daysOverdue: 18,
    daysRemaining: null,
    isDueToday: false,
    reminders: { sent: 2, total: 3 },
    parentPhone: "+91 32109 87654",
  },
];

export const MOCK_TRANSACTIONS: FeeTransaction[] = [
  { receiptNo: "RCP-2025-0847", dateTime: "7 Apr 2025\n11:30 AM", studentName: "Ravi Teja", class: "10A", feeHead: "Tuition Fee", amount: 8500, mode: "UPI", sentToParent: true },
  { receiptNo: "RCP-2025-0846", dateTime: "7 Apr 2025\n10:15 AM", studentName: "Priya S", class: "9B", feeHead: "Exam Fee", amount: 2000, mode: "Cash", sentToParent: true },
  { receiptNo: "RCP-2025-0845", dateTime: "6 Apr 2025\n4:30 PM", studentName: "Kiran R", class: "8A", feeHead: "Tuition Fee", amount: 8500, mode: "UPI", sentToParent: true },
  { receiptNo: "RCP-2025-0844", dateTime: "6 Apr 2025\n3:00 PM", studentName: "Venkat R", class: "10B", feeHead: "Activity Fee", amount: 1200, mode: "Cash", sentToParent: true },
  { receiptNo: "RCP-2025-0843", dateTime: "5 Apr 2025\n11:30 AM", studentName: "Meena D", class: "7B", feeHead: "Tuition Fee", amount: 8500, mode: "Cheque", sentToParent: true },
  { receiptNo: "RCP-2025-0842", dateTime: "5 Apr 2025\n08:45 AM", studentName: "Arjun K", class: "6C", feeHead: "Tuition Fee", amount: 7200, mode: "UPI", sentToParent: true },
  { receiptNo: "RCP-2025-0841", dateTime: "4 Apr 2025\n02:15 PM", studentName: "Sana M", class: "12A", feeHead: "Lab Fee", amount: 3500, mode: "Cash", sentToParent: true },
  { receiptNo: "RCP-2025-0840", dateTime: "4 Apr 2025\n11:00 AM", studentName: "Rahul V", class: "10A", feeHead: "Tuition Fee", amount: 8500, mode: "UPI", sentToParent: true },
  { receiptNo: "RCP-2025-0839", dateTime: "3 Apr 2025\n04:45 PM", studentName: "Ishita G", class: "11C", feeHead: "Tuition Fee", amount: 9800, mode: "Cheque", sentToParent: true },
  { receiptNo: "RCP-2025-0838", dateTime: "3 Apr 2025\n01:30 PM", studentName: "Dev P", class: "5B", feeHead: "Library Fee", amount: 500, mode: "Cash", sentToParent: true },
];

export const MOCK_FEE_HEADS: FeeHead[] = [
  { id: "1", name: "Tuition Fee", code: "TUI-01", mandatory: true, taxable: false, gstPercent: 0, status: "Active" },
  { id: "2", name: "Exam Fee", code: "EXM-05", mandatory: true, taxable: false, gstPercent: 0, status: "Active" },
  { id: "3", name: "Transport Fee", code: "TRN-03", mandatory: false, taxable: true, gstPercent: 5, status: "Active" },
  { id: "4", name: "Activity Fee", code: "ACT-09", mandatory: false, taxable: true, gstPercent: 12, status: "Active" },
  { id: "5", name: "Library Fee", code: "LIB-02", mandatory: true, taxable: false, gstPercent: 0, status: "Active" },
];

export const MOCK_TRANSPORT_SLABS: TransportSlab[] = [
  { slab: "Slab A", range: "0–5 KM", monthly: 1200, students: 245 },
  { slab: "Slab B", range: "5–10 KM", monthly: 2000, students: 182 },
  { slab: "Slab C", range: "10+ KM", monthly: 3500, students: 96 },
];

export const MOCK_CLASS_FEE_STRUCTURES: Record<string, ClassFeeStructure[]> = {
  "Class 6": [
    { feeHeadId: "1", feeHeadName: "Tuition Fee", subtitle: "Mandatory Core Head", billingCycle: "Monthly", dueDate: "10th of every month", amount: 6000, annualTotal: 72000 },
    { feeHeadId: "2", feeHeadName: "Exam Fee", subtitle: "Quarterly Collection", billingCycle: "Quarterly", dueDate: "Term-start (4 Times)", amount: 2500, annualTotal: 10000 },
    { feeHeadId: "5", feeHeadName: "Library & Digital", subtitle: "Annual Infrastructure", billingCycle: "Annually", dueDate: "Academic Start", amount: 8000, annualTotal: 8000 },
  ],
  "Class 7": [
    { feeHeadId: "1", feeHeadName: "Tuition Fee", subtitle: "Mandatory Core Head", billingCycle: "Monthly", dueDate: "10th of every month", amount: 6500, annualTotal: 78000 },
    { feeHeadId: "2", feeHeadName: "Exam Fee", subtitle: "Quarterly Collection", billingCycle: "Quarterly", dueDate: "Term-start (4 Times)", amount: 3000, annualTotal: 12000 },
    { feeHeadId: "5", feeHeadName: "Library & Digital", subtitle: "Annual Infrastructure", billingCycle: "Annually", dueDate: "Academic Start", amount: 9000, annualTotal: 9000 },
  ],
  "Class 8": [
    { feeHeadId: "1", feeHeadName: "Tuition Fee", subtitle: "Mandatory Core Head", billingCycle: "Monthly", dueDate: "10th of every month", amount: 6800, annualTotal: 81600 },
    { feeHeadId: "2", feeHeadName: "Exam Fee", subtitle: "Quarterly Collection", billingCycle: "Quarterly", dueDate: "Term-start (4 Times)", amount: 3200, annualTotal: 12800 },
    { feeHeadId: "5", feeHeadName: "Library & Digital", subtitle: "Annual Infrastructure", billingCycle: "Annually", dueDate: "Academic Start", amount: 9500, annualTotal: 9500 },
  ],
  "Class 9": [
    { feeHeadId: "1", feeHeadName: "Tuition Fee", subtitle: "Mandatory Core Head", billingCycle: "Monthly", dueDate: "10th of every month", amount: 7000, annualTotal: 84000 },
    { feeHeadId: "2", feeHeadName: "Exam Fee", subtitle: "Quarterly Collection", billingCycle: "Quarterly", dueDate: "Term-start (4 Times)", amount: 3200, annualTotal: 12800 },
    { feeHeadId: "5", feeHeadName: "Library & Digital", subtitle: "Annual Infrastructure", billingCycle: "Annually", dueDate: "Academic Start", amount: 10000, annualTotal: 10000 },
  ],
  "Class 10": [
    { feeHeadId: "1", feeHeadName: "Tuition Fee", subtitle: "Mandatory Core Head", billingCycle: "Monthly", dueDate: "10th of every month", amount: 7200, annualTotal: 86400 },
    { feeHeadId: "2", feeHeadName: "Exam Fee", subtitle: "Quarterly Collection", billingCycle: "Quarterly", dueDate: "Term-start (4 Times)", amount: 3500, annualTotal: 14000 },
    { feeHeadId: "5", feeHeadName: "Library & Digital", subtitle: "Annual Infrastructure", billingCycle: "Annually", dueDate: "Academic Start", amount: 10000, annualTotal: 10000 },
  ],
};

export const MOCK_PERIOD_SUMMARY: PeriodSummary = {
  totalPayments: 23,
  collected: 234000,
  breakdown: { cash: 84000, upi: 120000, cheque: 30000, bankTransfer: 0 },
};

let receiptCounter = 848;

export const feeApi = {
  getStats: async (): Promise<FeeStats> => {
    await new Promise(r => setTimeout(r, 200));
    return { ...MOCK_FEE_STATS };
  },

  getPendingFees: async (): Promise<PendingFee[]> => {
    await new Promise(r => setTimeout(r, 300));
    return [...MOCK_PENDING_FEES];
  },

  getTransactions: async (): Promise<FeeTransaction[]> => {
    await new Promise(r => setTimeout(r, 300));
    return [...MOCK_TRANSACTIONS];
  },

  getPeriodSummary: async (): Promise<PeriodSummary> => {
    await new Promise(r => setTimeout(r, 200));
    return { ...MOCK_PERIOD_SUMMARY };
  },

  getFeeHeads: async (): Promise<FeeHead[]> => {
    await new Promise(r => setTimeout(r, 200));
    return [...MOCK_FEE_HEADS];
  },

  getTransportSlabs: async (): Promise<TransportSlab[]> => {
    await new Promise(r => setTimeout(r, 200));
    return [...MOCK_TRANSPORT_SLABS];
  },

  getClassFeeStructure: async (className: string): Promise<ClassFeeStructure[]> => {
    await new Promise(r => setTimeout(r, 200));
    return MOCK_CLASS_FEE_STRUCTURES[className] || MOCK_CLASS_FEE_STRUCTURES["Class 10"];
  },

  recordPayment: async (form: RecordPaymentForm): Promise<{ receiptNo: string; success: boolean }> => {
    await new Promise(r => setTimeout(r, 600));
    const receiptNo = `RCP-2025-${String(receiptCounter++).padStart(4, "0")}`;
    return { receiptNo, success: true };
  },

  sendReminder: async (studentIds: string[]): Promise<{ sent: number }> => {
    await new Promise(r => setTimeout(r, 400));
    return { sent: studentIds.length };
  },
};