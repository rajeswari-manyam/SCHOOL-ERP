export interface Invoice {
  id: string;
  schoolId: string;
  schoolName: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  paidAt?: string;
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  amount: number;
  method: "card" | "bank" | "wallet";
  transactionId: string;
  paidAt: string;
}

export interface BillingStats {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  overduePayments: number;
}
