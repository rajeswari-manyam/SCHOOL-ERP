import { useQuery } from "@tanstack/react-query";
import { getDashboard, getDashboardSummary } from "@/services/accountant-reports.api";
import { getUserById } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";
import type {
  Transaction,
  PaymentModeSummary,
  MonthlyTrendItem,
} from "../types/dashboard.types";

/**
 * Accountant dashboard data, split into three independent React Query keys so
 * each section of the page resolves on its own. A slow/failed endpoint never
 * blocks the others — each section renders its own skeleton until ready.
 */
export const ACCOUNTANT_KEYS = {
  all: ["accountant", "dashboard"] as const,
  summary: () => [...ACCOUNTANT_KEYS.all, "summary"] as const,
  dashboard: () => [...ACCOUNTANT_KEYS.all, "dashboard"] as const,
  profile: (userId: string) => [...ACCOUNTANT_KEYS.all, "profile", userId] as const,
};

interface DashboardSectionData {
  transactions: Transaction[];
  paymentModes: PaymentModeSummary[];
  trend: MonthlyTrendItem[];
}

/** GET /tenant/getdashboardsummary — stat + financial summary cards */
export function useAccountantSummary() {
  return useQuery({
    queryKey: ACCOUNTANT_KEYS.summary(),
    queryFn: async () => {
      const res = await getDashboardSummary();
      return res?.status ? res.data : null;
    },
    staleTime: 60_000,
    retry: 2,
  });
}

/** GET /tenant/getdashboard — recent transactions, payment modes, monthly trend */
export function useAccountantDashboard() {
  return useQuery({
    queryKey: ACCOUNTANT_KEYS.dashboard(),
    queryFn: async (): Promise<DashboardSectionData> => {
      const res = await getDashboard();
      if (!res?.status) return { transactions: [], paymentModes: [], trend: [] };

      const d = res.data;

      return {
        paymentModes: d.payment_mode_summary.map((p) => ({
          mode: p.payment_mode as PaymentModeSummary["mode"],
          amount: p.amount,
        })),
        transactions: d.recent_payments.map((p) => ({
          id: p.id,
          time: new Date(p.createdAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          student: p.student.name,
          className: p.student.admission_number,
          feeHead: p.fee_type === "transport" ? "Transport" : "Fee",
          amount: p.amount_received,
          mode: p.payment_mode as Transaction["mode"],
        })),
        trend: d.monthly_collection_trend,
      };
    },
    staleTime: 60_000,
    retry: 2,
  });
}

/** GET /tenant/getuserById — accountant display name (header only, cached long) */
export function useAccountantProfile() {
  const userId = useAuthStore((s) => s.user?.id ?? "");
  return useQuery({
    queryKey: ACCOUNTANT_KEYS.profile(userId),
    queryFn: async () => {
      const res = await getUserById(userId);
      if (!res?.status) return null;
      const d = res.data as any;
      return {
        name: d.name ?? d.accountant_name ?? d.first_name ?? "",
        dateOfJoin: d.date_of_join ?? "",
      };
    },
    enabled: Boolean(userId),
    staleTime: 10 * 60_000,
    retry: 1,
  });
}
