import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { parentsApi } from "@/services/school-parents.api";
import type { CreateParentPayload, BulkCreateParentsResponse } from "@/services/school-parents.api";

export function useCreateParentMutation(options?: UseMutationOptions<unknown, Error, CreateParentPayload>) {
  return useMutation({
    mutationFn: (payload: CreateParentPayload) => parentsApi.createParent(payload),
    ...options,
  });
}

export function useBulkCreateParentsMutation(
  options?: UseMutationOptions<BulkCreateParentsResponse, Error, CreateParentPayload[]>,
) {
  return useMutation({
    mutationFn: (payload: CreateParentPayload[]) => parentsApi.createParents(payload),
    ...options,
  });
}