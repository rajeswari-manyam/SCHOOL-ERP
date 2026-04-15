import { useState } from "react";
import type { FeeRow, Transaction } from "../types/fees.types";

export const useFeeData = () => {
  const [fees] = useState<FeeRow[]>([
    {
      id: "1",
      student: "Rahul",
      className: "10A",
      amount: 2000,
      dueDate: "2026-04-10",
      status: "Overdue",
    },
    {
      id: "2",
      student: "Anjali",
      className: "9B",
      amount: 1500,
      dueDate: "2026-04-20",
      status: "Pending",
    },
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      date: "2026-04-12",
      student: "Rahul",
      amount: 2000,
      mode: "UPI",
    },
  ]);

  return { fees, transactions };
};