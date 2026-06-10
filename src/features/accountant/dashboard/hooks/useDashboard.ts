
import {
  statsMock,
  transactionsMock,
  paymentModesMock,
  reminderMock,
  financialSummaryMock,
} from "../data/dashboard.data";

export const useDashboardData = () => {
  return {
    stats: statsMock,
    transactions: transactionsMock,
    paymentModes: paymentModesMock,
    reminder: reminderMock,
    financialSummary: financialSummaryMock,
  };
};