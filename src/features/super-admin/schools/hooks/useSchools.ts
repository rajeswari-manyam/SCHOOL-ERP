import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSchools, fetchSchool, createSchool, updateSchool, suspendSchool, activateSchool, deleteSchool } from "../api/schools.api";
import { CreateSchoolInput, UpdateSchoolInput, SchoolFilters } from "../types/school.types";

export const useSchools = (filters?: SchoolFilters) => {
  return useQuery({
    queryKey: ["super-admin-schools", filters],
    queryFn: () => fetchSchools(filters),
  });
};

export const useSchool = (id: string) => {
  return useQuery({
    queryKey: ["super-admin-school", id],
    queryFn: () => fetchSchool(id),
  });
};

export const useCreateSchool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSchool,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["super-admin-schools"] }),
  });
};

export const useUpdateSchool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSchoolInput }) => updateSchool({ id, input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["super-admin-schools"] }),
  });
};

export const useSuspendSchool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: suspendSchool,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["super-admin-schools"] }),
  });
};

export const useActivateSchool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activateSchool,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["super-admin-schools"] }),
  });
};

export const useDeleteSchool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSchool,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["super-admin-schools"] }),
  });
};
