import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supportTicketApi } from "@/services/support-ticket.api";
import type { SupportTicketRecord } from "@/services/support-ticket.api";
import type { TicketFilters, TicketStats } from "../types/support.types";

export const SUPPORT_KEYS = {
  all:  ["super-admin", "support"] as const,
  list: () => [...SUPPORT_KEYS.all, "list"] as const,
};

export const useAllTicketsQuery = () =>
  useQuery({
    queryKey: SUPPORT_KEYS.list(),
    queryFn: supportTicketApi.getAllTickets,
    staleTime: 30_000,
  });

const isToday = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
};

export const useTicketStats = (tickets: SupportTicketRecord[] | undefined): TicketStats =>
  useMemo(() => {
    const list = tickets ?? [];
    return {
      open: list.filter((t) => t.status === "open").length,
      inProgress: list.filter((t) => t.status === "in_progress").length,
      resolvedToday: list.filter((t) => t.status === "resolved" && !!t.resolvedAt && isToday(t.resolvedAt)).length,
    };
  }, [tickets]);

export const useTicketFiltering = (
  tickets: SupportTicketRecord[] | undefined,
  filters: TicketFilters
): { page: SupportTicketRecord[]; total: number } =>
  useMemo(() => {
    const list = tickets ?? [];
    const search = filters.search.trim().toLowerCase();
    const filtered = list.filter((t) => {
      const matchesSearch =
        !search ||
        t.subject.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search) ||
        (t.school?.school_name ?? "").toLowerCase().includes(search);
      const matchesPriority = filters.priority === "ALL" || t.priority === filters.priority;
      const matchesStatus = filters.status === "ALL" || t.status === filters.status;
      const matchesSchool = !filters.school || t.school?.school_name === filters.school;
      return matchesSearch && matchesPriority && matchesStatus && matchesSchool;
    });
    const total = filtered.length;
    const start = (filters.page - 1) * filters.pageSize;
    return { page: filtered.slice(start, start + filters.pageSize), total };
  }, [tickets, filters]);

export const useTicketMutations = () => {
  const qc = useQueryClient();
  const deleteTicket = useMutation({
    mutationFn: (id: string) => supportTicketApi.deleteTicket(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUPPORT_KEYS.all, refetchType: "all" }),
  });
  return { deleteTicket };
};
