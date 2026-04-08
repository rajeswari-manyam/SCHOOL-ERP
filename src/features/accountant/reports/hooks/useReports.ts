import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchReports,
  createReport,
  updateReport,
  deleteReport,
} from "../api/reports.api";
import { ReportCreateInput, ReportUpdateInput } from "../types/reports.types";

export const useReports = () => {
  return useQuery({
    queryKey: ["accountant-reports"],
    queryFn: fetchReports,
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReport,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["accountant-reports"] }),
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ReportUpdateInput }) =>
      updateReport(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["accountant-reports"] }),
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReport,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["accountant-reports"] }),
  });
};
