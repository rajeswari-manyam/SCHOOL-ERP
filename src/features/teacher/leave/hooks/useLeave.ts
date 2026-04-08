import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLeaveRequests, createLeaveRequest, updateLeaveRequest, deleteLeaveRequest } from "../api/leave.api";
import { CreateLeaveRequestInput, UpdateLeaveRequestInput } from "../types/leave.types";

export const useLeaveRequests = () => {
  return useQuery({
    queryKey: ["teacher-leave-requests"],
    queryFn: fetchLeaveRequests,
  });
};

export const useCreateLeaveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLeaveRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teacher-leave-requests"] }),
  });
};

export const useUpdateLeaveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateLeaveRequestInput }) => updateLeaveRequest(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teacher-leave-requests"] }),
  });
};

export const useDeleteLeaveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLeaveRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teacher-leave-requests"] }),
  });
};
