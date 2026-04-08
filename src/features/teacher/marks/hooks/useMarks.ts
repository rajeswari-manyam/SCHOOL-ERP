import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMarks, createMarkEntry, updateMarkEntry, deleteMarkEntry } from "../api/marks.api";
import type { UpdateMarkEntryInput } from "../types/marks.types";

export const useMarks = () => {
  return useQuery({
    queryKey: ["teacher-marks"],
    queryFn: fetchMarks,
  });
};

export const useCreateMarkEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMarkEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teacher-marks"] }),
  });
};

export const useUpdateMarkEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateMarkEntryInput }) => updateMarkEntry(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teacher-marks"] }),
  });
};

export const useDeleteMarkEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMarkEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teacher-marks"] }),
  });
};
