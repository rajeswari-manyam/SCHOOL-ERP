import { useState } from "react";
import type { Receipt } from "../types/receipts.types";

export const useReceipts = () => {
  const [data] = useState<Receipt[]>([
    {
      id: "1",
      receiptNo: "RCP-2025-0848",
      date: "6 Apr 2025",
      time: "11:42 AM",
      student: "Ravi Kumar",
      className: "10A",
      feeHead: "Tuition Apr",
      amount: 8500,
      mode: "UPI",
      status: "Sent",
      waStatus: "Sent",
    },
    {
      id: "2",
      receiptNo: "RCP-2025-0847",
      date: "6 Apr 2025",
      time: "11:15 AM",
      student: "Priya Devi",
      className: "9B",
      feeHead: "Tuition Apr",
      amount: 6000,
      mode: "Cash",
      status: "Sent",
      waStatus: "Sent",
    },
    {
      id: "3",
      receiptNo: "RCP-2025-0846",
      date: "6 Apr 2025",
      time: "10:58 AM",
      student: "Kiran Reddy",
      className: "8A",
      feeHead: "Exam Fee",
      amount: 2000,
      mode: "UPI",
      status: "Sent",
      waStatus: "Sent",
    },
    {
      id: "4",
      receiptNo: "RCP-2025-0844",
      date: "6 Apr 2025",
      time: "9:47 AM",
      student: "Anitha Rao",
      className: "6A",
      feeHead: "Transport",
      amount: 1500,
      mode: "Cash",
      status: "Not Sent",
      waStatus: "Not Sent",
    },
    {
      id: "5",
      receiptNo: "RCP-2025-0843",
      date: "6 Apr 2025",
      time: "9:20 AM",
      student: "Venkat M",
      className: "10B",
      feeHead: "Tuition Apr",
      amount: 8500,
      mode: "Cheque",
      status: "Sent",
      waStatus: "Sent",
    },
  ]);

  return { data };
};