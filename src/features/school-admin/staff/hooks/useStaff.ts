import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../api/staff.api";
import { StaffCreateInput, StaffUpdateInput } from "../types/staff.types";

export const useStaff = () => {
  return useQuery({
    queryKey: ["staff"],
    queryFn: fetchStaff,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStaff,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: StaffUpdateInput }) =>
      updateStaff(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });
};
