import { useState, useEffect } from "react";
import { getDashboard, getDashboardSummary } from "@/services/accountant-reports.api";
import type {
  DashboardRecentPayment,
  DashboardSummary,
} from "@/services/accountant-reports.api";
import { getUserById } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";
import type { Transaction, PaymentModeSummary, MonthlyTrendItem } from "../types/dashboard.types";

export const useDashboardData = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");

  const [summary,        setSummary]        = useState<DashboardSummary | null>(null);
  const [transactions,   setTransactions]   = useState<Transaction[]>([]);
  const [paymentModes,   setPaymentModes]   = useState<PaymentModeSummary[]>([]);
  const [trend,          setTrend]          = useState<MonthlyTrendItem[]>([]);
  const [accountantName, setAccountantName] = useState("");
  const [dateOfJoin,     setDateOfJoin]     = useState("");

  // Fetch accountant profile
  useEffect(() => {
    if (!userId) return;
    getUserById(userId)
      .then((res) => {
        if (!res.status) return;
        const d = res.data as any;
        const name = d.name ?? d.accountant_name ?? d.first_name ?? "";
        setAccountantName(name);
        if (d.date_of_join) setDateOfJoin(d.date_of_join);
      })
      .catch(() => {});
  }, [userId]);

  // Fetch stat card summary from dedicated endpoint
  useEffect(() => {
    getDashboardSummary()
      .then((res) => {
        if (!res.status) return;
        setSummary(res.data);
      })
      .catch(() => {});
  }, []);

  // Fetch transactions, payment modes, and monthly trend
  useEffect(() => {
    getDashboard()
      .then((res) => {
        if (!res.status) return;
        const d = res.data;

        setPaymentModes(
          d.payment_mode_summary.map((p) => ({
            mode:   p.payment_mode as PaymentModeSummary["mode"],
            amount: p.amount,
          }))
        );

        setTransactions(
          d.recent_payments.map((p: DashboardRecentPayment) => ({
            id:        p.id,
            time:      new Date(p.createdAt).toLocaleTimeString("en-IN", {
                         hour: "2-digit", minute: "2-digit", hour12: true,
                       }),
            student:   p.student.name,
            className: p.student.admission_number,
            feeHead:   p.fee_type === "transport" ? "Transport" : "Fee",
            amount:    p.amount_received,
            mode:      p.payment_mode as Transaction["mode"],
          }))
        );

        setTrend(d.monthly_collection_trend);
      })
      .catch(() => {});
  }, []);

  return {
    summary,
    transactions,
    paymentModes,
    trend,
    accountantName,
    dateOfJoin,
    reminder: null,
  };
};
