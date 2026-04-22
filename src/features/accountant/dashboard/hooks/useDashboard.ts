import { useEffect, useState } from "react";
import type {
  StatItem,
  Transaction,
  PaymentModeSummary,
  ReminderStatus,
} from "../types/dashboard.types";

export const useDashboardData = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentModes, setPaymentModes] = useState<PaymentModeSummary[]>([]);
  const [reminder, setReminder] = useState<ReminderStatus>({
    sent: 0,
    delivered: 0,
    failed: 0,
  });

  useEffect(() => {
    setStats([
      { label: "Today's Collection", value: 12000 },
      { label: "Monthly Total", value: 320000 },
      { label: "Total Outstanding", value: 85000 },
      { label: "Severely Overdue", value: 20000 },
      { label: "WA Reminders Sent", value: 120 },
      { label: "Payments This Week", value: 54000 },
      { label: "Payroll Status", value: "Pending" },
      { label: "Next Payroll", value: "25th" },
    ]);

    setTransactions([
      {
        id: "1",
        time: "10:30 AM",
        student: "Rahul",
        className: "X-A",
        feeHead: "Tuition",
        amount: 2000,
        mode: "UPI",
      },
      {
        id: "2",
        time: "11:00 AM",
        student: "Anjali",
        className: "IX-B",
        feeHead: "Transport",
        amount: 1500,
        mode: "CASH",
      },
      {
        id: "3",
        time: "11:30 AM",
        student: "Vikram",
        className: "XI-C",
        feeHead: "Hostel",
        amount: 5000,
        mode: "CHEQUE",
      },
      {
        id: "4",
        time: "12:00 PM",
        student: "Sneha",
        className: "VIII-A",
        feeHead: "Tuition",
        amount: 2000,
        mode: "ONLINE",
      },
      {
        id: "5",
        time: "12:30 PM",
        student: "Aditya",
        className: "XII-B",
        feeHead: "Tuition",
        amount: 3000,
        mode: "UPI",
      },
      {
        id: "6",
        time: "1:00 PM",
        student: "Pooja",
        className: "VII-C",
        feeHead: "Transport",
        amount: 1500,
        mode: "CASH",
      },
      {
        id: "7",
        time: "1:30 PM",
        student: "Rohan",
        className: "IX-A",
        feeHead: "Hostel",
        amount: 5000,
        mode: "CHEQUE",
      },
      {
        id: "8",
        time: "2:00 PM",
        student: "Kavya",
        className: "X-B",
        feeHead: "Tuition",
        amount: 2000,
        mode: "ONLINE",
      }
    ]);

    setPaymentModes([
      { mode: "UPI", amount: 120000 },
      { mode: "CASH", amount: 80000 },
      { mode: "CHEQUE", amount: 40000 },
    ]);

    setReminder({
      sent: 120,
      delivered: 100,
      failed: 20,
    });
  }, []);

  return { stats, transactions, paymentModes, reminder };
};