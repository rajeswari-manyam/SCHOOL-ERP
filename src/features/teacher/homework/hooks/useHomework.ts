import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchHomework, createHomework, updateHomework, deleteHomework } from "../api/homework.api";
import type{ UpdateHomeworkInput } from "../types/homework.types";

export const useHomework = () => {
  return useQuery({
    queryKey: ["teacher-homework"],
    queryFn: fetchHomework,
  });
};

export const useCreateHomework = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHomework,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teacher-homework"] }),
  });
};

export const useUpdateHomework = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateHomeworkInput }) => updateHomework(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teacher-homework"] }),
  });
};

export const useDeleteHomework = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHomework,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teacher-homework"] }),
  });
};
