import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolsApi } from "@/services/super-admin-schools.api";
import type { SchoolFilters, SchoolFormValues, School, SchoolUpdatePayload, SchoolsResponse } from "../types/school.types";

export const SCHOOLS_KEYS = {
  all: ["super-admin", "schools"] as const,
  list: (filters: Partial<SchoolFilters>) => [...SCHOOLS_KEYS.all, "list", filters] as const,
  detail: (id: string) => [...SCHOOLS_KEYS.all, "detail", id] as const,
  allSchools: ["super-admin", "schools", "all"] as const,
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

/**
 * `getSchools` (server) and `getAllSchools` (server) both resolve to the same
 * `GET /organization/getallschooldetails` call — the backend has no
 * filter/page params, every bit of filtering/pagination already happens
 * client-side in JS after the fetch. Calling them as two separate hooks with
 * two separate query keys meant SchoolsPage fired the identical network
 * request twice on every load. Deriving this hook's result from
 * `useAllSchools`'s already-cached data instead removes the duplicate call —
 * same filtering/pagination logic, now applied to shared data in a `useMemo`
 * rather than behind its own `useQuery`.
 */
export const useSchools = (filters: Partial<SchoolFilters>) => {
  const { data: allSchools, isLoading, isFetching } = useAllSchools();

  const data = useMemo((): SchoolsResponse => {
    const all = allSchools ?? [];
    const search = (filters.search ?? "").toLowerCase().trim();
    const filtered = all.filter((s) => {
      const matchesSearch = !search || s.name.toLowerCase().includes(search) || s.city.toLowerCase().includes(search);
      const matchesPlan = !filters.plan || filters.plan === "ALL" || s.plan === filters.plan;
      const matchesStatus = !filters.status || filters.status === "ALL" || s.status === filters.status;
      const matchesCity = !filters.city || s.city === filters.city;
      return matchesSearch && matchesPlan && matchesStatus && matchesCity;
    });

    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 8;
    const start = (page - 1) * pageSize;

    return {
      data: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    };
  }, [allSchools, filters.search, filters.plan, filters.status, filters.city, filters.page, filters.pageSize]);

  return { data, isLoading, isFetching };
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

  // refetchType: "all" (not the default "active") matters here — "Add School"
  // lives on its own route, so by the time this mutation succeeds, the
  // Schools list's query is inactive (unmounted). With refetchOnMount:false
  // set globally, an inactive query that's merely marked stale won't refetch
  // on its next mount either, so the new school wouldn't show up until a
  // hard page refresh. Forcing the refetch here, at invalidation time,
  // refreshes the cache immediately so the list is already current by the
  // time the user navigates back to it.
  const invalidate = () => qc.invalidateQueries({ queryKey: SCHOOLS_KEYS.all, refetchType: "all" });

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