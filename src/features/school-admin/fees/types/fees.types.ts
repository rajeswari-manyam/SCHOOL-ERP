export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  dueDate: string;
  status: "paid" | "unpaid";
  paidAt?: string;
}

export interface MarkPaidInput {
  feeId: string;
  paidAt: string;
}
