import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { parentsApi } from "@/services/school-parents.api";
import type { CreateParentPayload } from "@/services/school-parents.api";

export function useCreateParentMutation(options?: UseMutationOptions<unknown, Error, CreateParentPayload>) {
  return useMutation({
    mutationFn: (payload: CreateParentPayload) => parentsApi.createParent(payload),
    ...options,
  });
}
