import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolsApi } from "@/services/super-admin-schools.api";
import type { SchoolFilters, SchoolFormValues, School, SchoolUpdatePayload } from "../types/school.types";

export const SCHOOLS_KEYS = {
  all: ["super-admin", "schools"] as const,
  list: (filters: Partial<SchoolFilters>) => [...SCHOOLS_KEYS.all, "list", filters] as const,
  detail: (id: string) => [...SCHOOLS_KEYS.all, "detail", id] as const,
  allSchools: ["super-admin", "schools", "all"] as const,
};

export const useSchools = (filters: Partial<SchoolFilters>) => {
  return useQuery({
    queryKey: SCHOOLS_KEYS.list(filters),
    queryFn: () => schoolsApi.getSchools(filters),
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
  });
};

export const useAllSchools = (search?: string) => {
  return useQuery({
    queryKey: [...SCHOOLS_KEYS.allSchools, search ?? ""],
    queryFn: () => schoolsApi.getAllSchools(search),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data): School[] => {
      if (Array.isArray(data?.data)) return data.data;
      return [];
    },
  });
};

export const useSchool = (id: string) => {
  return useQuery({
    queryKey: SCHOOLS_KEYS.detail(id),
    queryFn: () => schoolsApi.getSchool(id),
    enabled: !!id,
  });
};

export const useSchoolDetail = (id: string) => {
  return useQuery({
    queryKey: [...SCHOOLS_KEYS.detail(id), "raw"] as const,
    queryFn: () => schoolsApi.getSchoolDetail(id),
    enabled: !!id,
  });
};

export const useSchoolMutations = () => {
  const qc = useQueryClient();

  const invalidate = () => qc.invalidateQueries({ queryKey: SCHOOLS_KEYS.all });

  const createSchool = useMutation({
    mutationFn: (payload: SchoolFormValues) => schoolsApi.createSchool(payload),
    onSuccess: (data) => {
      console.log("School registration response:", data);
      invalidate();
    },
    onError: (error) => {
      console.error("School registration error:", error);
    },
  });

  const updateSchool = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SchoolUpdatePayload }) =>
      schoolsApi.updateSchool(id, payload),
    onSuccess: invalidate,
  });

  const suspendSchool = useMutation({
    mutationFn: (id: string) => schoolsApi.suspendSchool(id),
    onSuccess: invalidate,
  });

  const reactivateSchool = useMutation({
    mutationFn: (id: string) => schoolsApi.reactivateSchool(id),
    onSuccess: invalidate,
  });

  const deleteSchool = useMutation({
    mutationFn: (id: string) => schoolsApi.deleteSchool(id),
    onSuccess: invalidate,
  });

  const importCsv = useMutation({
    mutationFn: (file: File) => schoolsApi.importCsv(file),
    onSuccess: invalidate,
  });

  return { createSchool, updateSchool, suspendSchool, reactivateSchool, deleteSchool, importCsv };
};