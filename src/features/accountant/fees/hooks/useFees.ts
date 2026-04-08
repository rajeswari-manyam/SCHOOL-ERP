import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFees, createFee, updateFee, deleteFee } from "../api/fees.api";
import { FeeCreateInput, FeeUpdateInput } from "../types/fees.types";

export const useFees = () => {
  return useQuery({
    queryKey: ["accountant-fees"],
    queryFn: fetchFees,
  });
};

export const useCreateFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFee,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["accountant-fees"] }),
  });
};

export const useUpdateFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: FeeUpdateInput }) =>
      updateFee(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["accountant-fees"] }),
  });
};

export const useDeleteFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFee,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["accountant-fees"] }),
  });
};
