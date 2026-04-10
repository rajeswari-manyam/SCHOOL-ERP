import type { AccountantDashboardStats } from "../types/dashboard.types";

const MOCK_ACCOUNTANT_STATS: AccountantDashboardStats = {
  totalFeesCollected: 1248000,
  pendingFees:        342000,
  defaulters:         47,
  transactions:       312,
};

export const fetchAccountantDashboardStats =
  async (): Promise<AccountantDashboardStats> => {
    await new Promise((r) => setTimeout(r, 400));
    return MOCK_ACCOUNTANT_STATS;
  };
