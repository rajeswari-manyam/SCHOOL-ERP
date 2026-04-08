import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchInvoices, fetchPayments, fetchBillingStats, recordPayment } from "../api/billing.api";

export const useInvoices = () => useQuery({ queryKey: ["super-admin-invoices"], queryFn: fetchInvoices });
export const usePayments = () => useQuery({ queryKey: ["super-admin-payments"], queryFn: fetchPayments });
export const useBillingStats = () => useQuery({ queryKey: ["super-admin-billing-stats"], queryFn: fetchBillingStats });

export const useRecordPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, method }: { invoiceId: string; method: string }) => recordPayment(invoiceId, method),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["super-admin-invoices"] }),
  });
};
