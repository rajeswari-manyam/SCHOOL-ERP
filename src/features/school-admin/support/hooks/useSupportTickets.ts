import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supportTicketApi } from "@/services/support-ticket.api";
import type { SupportTicketPayload } from "@/services/support-ticket.api";

export const supportTicketKeys = {
  all: ["support-tickets"] as const,
  list: () => [...supportTicketKeys.all, "list"] as const,
};

export function useSupportTickets() {
  return useQuery({
    queryKey: supportTicketKeys.list(),
    queryFn: supportTicketApi.getTicketsBySchool,
    staleTime: 30_000,
  });
}

export function useSupportTicketMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: supportTicketKeys.list(), refetchType: "all" });

  const createTicket = useMutation({
    mutationFn: (payload: SupportTicketPayload) => supportTicketApi.createTicket(payload),
    onSuccess: () => {
      invalidate();
      toast.success("Ticket submitted — our team will get back to you shortly");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to raise support ticket"),
  });

  const updateTicket = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SupportTicketPayload }) =>
      supportTicketApi.updateTicket(id, payload),
    onSuccess: () => {
      invalidate();
      toast.success("Ticket updated");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to update support ticket"),
  });

  const deleteTicket = useMutation({
    mutationFn: (id: string) => supportTicketApi.deleteTicket(id),
    onSuccess: () => {
      invalidate();
      toast.success("Ticket deleted");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to delete support ticket"),
  });

  return { createTicket, updateTicket, deleteTicket };
}
