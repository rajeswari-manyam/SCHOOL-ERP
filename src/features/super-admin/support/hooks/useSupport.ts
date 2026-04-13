import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supportApi } from "../api/support.api";
import type { TicketFilters, TicketFormValues } from "../types/support.types";

export const SUPPORT_KEYS = {
  all:    ["super-admin", "support"] as const,
  list:   (f: Partial<TicketFilters>) => [...SUPPORT_KEYS.all, "list", f] as const,
  stats:  () => [...SUPPORT_KEYS.all, "stats"] as const,
  detail: (id: string) => [...SUPPORT_KEYS.all, "detail", id] as const,
};

export const useTickets = (filters: Partial<TicketFilters>) =>
  useQuery({
    queryKey: SUPPORT_KEYS.list(filters),
    queryFn: () => supportApi.getTickets(filters),
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev,
  });

export const useTicketStats = () =>
  useQuery({
    queryKey: SUPPORT_KEYS.stats(),
    queryFn: supportApi.getStats,
    staleTime: 1000 * 60 * 2,
  });

export const useTicketMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: SUPPORT_KEYS.all });

  const createTicket = useMutation({
    mutationFn: (payload: TicketFormValues) => supportApi.createTicket(payload),
    onSuccess: invalidate,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      supportApi.updateStatus(id, status),
    onSuccess: invalidate,
  });

  const assignTicket = useMutation({
    mutationFn: ({ id, assignedTo }: { id: string; assignedTo: string }) =>
      supportApi.assignTicket(id, assignedTo),
    onSuccess: invalidate,
  });

  const resolveTicket = useMutation({
    mutationFn: (id: string) => supportApi.resolveTicket(id),
    onSuccess: invalidate,
  });

  const deleteTicket = useMutation({
    mutationFn: (id: string) => supportApi.deleteTicket(id),
    onSuccess: invalidate,
  });

  return { createTicket, updateStatus, assignTicket, resolveTicket, deleteTicket };
};
