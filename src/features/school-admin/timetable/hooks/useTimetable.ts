import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTimetable,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry,
} from "../api/timetable.api";
import {
  TimetableCreateInput,
  TimetableUpdateInput,
} from "../types/timetable.types";

export const useTimetable = () => {
  return useQuery({
    queryKey: ["timetable"],
    queryFn: fetchTimetable,
  });
};

export const useCreateTimetableEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTimetableEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["timetable"] }),
  });
};

export const useUpdateTimetableEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TimetableUpdateInput }) =>
      updateTimetableEntry(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["timetable"] }),
  });
};

export const useDeleteTimetableEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTimetableEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["timetable"] }),
  });
};
