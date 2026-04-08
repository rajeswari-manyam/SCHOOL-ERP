import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAttendanceGrid, markAttendance } from "../api/attendance.api";

export const useAttendance = (date: string) => {
  return useQuery({
    queryKey: ["attendance", date],
    queryFn: () => getAttendanceGrid(date),
    staleTime: 5 * 60 * 1000,
  });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAttendance,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["attendance", variables.date]);
    },
  });
};
