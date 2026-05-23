import { useMutation } from "@tanstack/react-query";
import { parentsApi } from "../api/parents.api";
import type { CreateParentPayload } from "../api/parents.api";

export function useCreateParentMutation(options?: Parameters<typeof useMutation>[2]) {
  return useMutation({
    mutationFn: (payload: CreateParentPayload) => parentsApi.createParent(payload),
    ...options,
  });
}
