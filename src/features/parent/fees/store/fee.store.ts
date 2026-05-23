import { create } from "zustand";
import type { Fee, PaymentHistory } from "../types/fee.types";

interface FeeStore {
  fees: Fee[];
  history: PaymentHistory[];
  selectedFee: Fee | null;
  setSelectedFee: (fee: Fee | null) => void;
  markPaid: (id: string, mode: string) => void;
}

export const useFeeStore = create<FeeStore>((set) => ({
  fees: [
    {
      id: "1",
      term: "Tuition Fee — April 2025",
      amount: 8500,
      paid: 0,
      dueDate: "9 April 2025",
      status: "overdue",
      daysOverdue: 2,
      reminder: "Reminder sent 6 Apr via WhatsApp",
    },
    {
      id: "2",
      term: "Examination Fee — Q1 2025",
      amount: 2000,
      paid: 0,
      dueDate: "15 April 2025",
      status: "upcoming",
      reminder: "No reminder sent yet",
    },
  ],

  history: [
    { id: "h1", date: "1 Apr 2025", feeHead: "Tuition Fee — April 2025", amount: 8500, mode: "UPI", receiptNo: "RCP-2025-0823" },
    { id: "h2", date: "1 Mar 2025", feeHead: "Tuition Fee — March 2025", amount: 8500, mode: "UPI", receiptNo: "RCP-2025-0761" },
    { id: "h3", date: "3 Feb 2025", feeHead: "Examination Fee — Q4", amount: 2000, mode: "Cash", receiptNo: "RCP-2025-0744" },
    { id: "h4", date: "1 Feb 2025", feeHead: "Tuition Fee — February 2025", amount: 8500, mode: "Bank Transfer", receiptNo: "RCP-2025-0698" },
    { id: "h5", date: "1 Jan 2025", feeHead: "Tuition Fee — January 2025", amount: 8500, mode: "UPI", receiptNo: "RCP-2025-0634" },
    { id: "h6", date: "2 Dec 2024", feeHead: "Activity Fee", amount: 1500, mode: "Cash", receiptNo: "RCP-2024-0589" },
    { id: "h7", date: "1 Dec 2024", feeHead: "Tuition Fee — December", amount: 8500, mode: "UPI", receiptNo: "RCP-2024-0571" },
    { id: "h8", date: "1 Nov 2024", feeHead: "Tuition Fee — November", amount: 8500, mode: "UPI", receiptNo: "RCP-2024-0523" },
  ],

  selectedFee: null,

  setSelectedFee: (fee) => set({ selectedFee: fee }),

  markPaid: (id, mode) =>
    set((state) => ({
      fees: state.fees.map((f) =>
        f.id === id ? { ...f, status: "paid" as const, paid: f.amount, mode } : f
      ),
    })),
}));