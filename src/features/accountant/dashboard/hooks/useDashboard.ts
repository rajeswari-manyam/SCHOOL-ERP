import { useEffect, useState } from "react";
import type{
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
    // 🔥 Replace with API later

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
        amount: "Rs.2000",
        mode: "UPI",
      },
      {
        id: "2",
        time: "11:00 AM",
        student: "Anjali",
        className: "IX-B",
        feeHead: "Transport",
        amount: "Rs.1500",
        mode: "Cash",
      },
   {
        id: "2",
        time: "11:00 AM",
        student: "Anjali",
        className: "IX-B",
        feeHead: "Transport",
        amount: "Rs.1500",
        mode: "Cash",
      },
      {
        id:"3",
         time:"11:00 AM",
         student:"Sanjay",
         className:"IIX-B",
         feeHead:"Transport",
         amount:"Rs.1500",
         mode:"Cash",
      },
      {
        id:"4",
         time:"11:00 AM",
         student:"Anjali",
         className:"IX-B",
         feeHead:"Transport",
         amount:"Rs.1500",
         mode:"Cash",
      },
      {
        id:"5",
         time:"11:00 AM",
         student:"Anjali",
         className:"IX-B",
         feeHead:"Transport",
         amount:"Rs.1500",
         mode:"Cash",
      },
      {
        id:"6",
         time:"11:00 AM",
         student:"Sonu",
         className:"IX-B",
         feeHead:"Transport",
         amount:"Rs.1500",
         mode:"Cash",
      },
      {
        id:"7",
         time:"11:00 AM",
         student:"Navya",
         className:"IX-B",
         feeHead:"Transport",
         amount:"Rs.1500",
         mode:"Cash",
      },
      {
        id:"8",
         time:"11:00 AM",
         student:"Reddy",
         className:"IX-B",
         feeHead:"Transport",
         amount:"Rs.1500",
         mode:"Cash",
      },
      {
        id:"9",
         time:"11:00 AM",
         student:"Rani",
         className:"IX-B",
         feeHead:"Transport",
         amount:"Rs.1500",
         mode:"Cash",
      },
      {
        id:"10",
         time:"11:00 AM",
         student:"Ammulu",
         className:"IX-B",
         feeHead:"Transport",
         amount:"Rs.1500",
         mode:"Cash",
      },
    ]);
    setPaymentModes([
      { mode: "UPI", amount: 120000 },
      { mode: "Cash", amount: 80000 },
      { mode: "Cheque", amount: 40000 },
    ]);

    setReminder({
      sent: 120,
      delivered: 100,
      failed: 20,
    });
  }, []);

  return {
    stats,
    transactions,
    paymentModes,
    reminder,
  };
};