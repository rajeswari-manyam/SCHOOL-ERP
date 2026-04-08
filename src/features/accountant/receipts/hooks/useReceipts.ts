import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchReceipts,
  createReceipt,
  updateReceipt,
  deleteReceipt,
} from "../api/receipts.api";
import {
  CreateReceiptInput,
  UpdateReceiptInput,
} from "../types/receipts.types";

export const useReceipts = () => {
  return useQuery({
    queryKey: ["accountant-receipts"],
    queryFn: fetchReceipts,
  });
};

export const useCreateReceipt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReceipt,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["accountant-receipts"] }),
  });
};

export const useUpdateReceipt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateReceiptInput }) =>
      updateReceipt(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["accountant-receipts"] }),
  });
};

export const useDeleteReceipt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReceipt,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["accountant-receipts"] }),
  });
};
