import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAttendanceRecords, markAttendance, updateAttendance, deleteAttendance } from "../api/attendance.api";
import type { UpdateAttendanceInput } from "../types/attendance.types";

export const useAttendanceRecords = () => {
  return useQuery({
    queryKey: ["teacher-attendance-records"],
    queryFn: fetchAttendanceRecords,
  });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAttendance,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teacher-attendance-records"] }),
  });
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAttendanceInput }) => updateAttendance(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teacher-attendance-records"] }),
  });
};

export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAttendance,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teacher-attendance-records"] }),
  });
};
