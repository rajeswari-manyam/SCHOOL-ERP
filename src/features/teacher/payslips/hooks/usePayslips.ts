import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPayslips, createPayslip, updatePayslip, deletePayslip } from "../api/payslip.api";
import type{ UpdatePayslipInput } from "../types/payslip.types";

export const usePayslips = () => {
  return useQuery({
    queryKey: ["teacher-payslips"],
    queryFn: fetchPayslips,
  });
};

export const useCreatePayslip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPayslip,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teacher-payslips"] }),
  });
};

export const useUpdatePayslip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePayslipInput }) => updatePayslip({ id, input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teacher-payslips"] }),
  });
};

export const useDeletePayslip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePayslip,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teacher-payslips"] }),
  });
};
