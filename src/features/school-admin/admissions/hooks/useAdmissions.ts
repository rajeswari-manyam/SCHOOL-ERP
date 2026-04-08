import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getApplications,
  getApplication,
  createApplication,
  updateApplicationStatus,
} from "../api/admissions.api";

export const useApplications = () => {
  return useQuery({
    queryKey: ["admissions"],
    queryFn: getApplications,
    staleTime: 5 * 60 * 1000,
  });
};

export const useApplication = (id: string) => {
  return useQuery({
    queryKey: ["admission", id],
    queryFn: () => getApplication(id),
    enabled: !!id,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries(["admissions"]);
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      remarks,
    }: {
      id: string;
      status: "approved" | "rejected";
      remarks?: string;
    }) => updateApplicationStatus(id, status, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries(["admissions"]);
    },
  });
};
