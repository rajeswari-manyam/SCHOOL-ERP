import type { AccountantDashboardStats } from "../types/dashboard.types";

const MOCK_ACCOUNTANT_STATS: AccountantDashboardStats = {
  totalCollected:     1250000,
  pendingDues:       250000,
  totalTransactions:  312,
  
};

export const fetchAccountantDashboardStats =
  async (): Promise<AccountantDashboardStats> => {
    await new Promise((r) => setTimeout(r, 400));
    return MOCK_ACCOUNTANT_STATS;
  };
