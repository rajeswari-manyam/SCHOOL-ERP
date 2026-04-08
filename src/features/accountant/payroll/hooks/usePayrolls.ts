import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPayrolls,
  createPayroll,
  updatePayroll,
  deletePayroll,
} from "../api/payroll.api";
import { CreatePayrollInput, UpdatePayrollInput } from "../types/payroll.types";

export const usePayrolls = () => {
  return useQuery({
    queryKey: ["accountant-payrolls"],
    queryFn: fetchPayrolls,
  });
};

export const useCreatePayroll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPayroll,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["accountant-payrolls"] }),
  });
};

export const useUpdatePayroll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePayrollInput }) =>
      updatePayroll(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["accountant-payrolls"] }),
  });
};

export const useDeletePayroll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePayroll,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["accountant-payrolls"] }),
  });
};
