import { useState } from "react";
import type { Receipt } from "../types/receipts.types";

export const useReceipts = () => {
  const [data] = useState<Receipt[]>([
    {
      id: "1",
      receiptNo: "RCPT-001",
      date: "2026-04-14 10:30 AM",
      student: "Rahul",
      className: "10A",
      feeHead: "Tuition",
      amount: 2000,
      mode: "UPI",
      sentToParent: true,
    },
  ]);

  return { data };
};