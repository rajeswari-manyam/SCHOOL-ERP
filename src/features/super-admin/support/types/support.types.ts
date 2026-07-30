import type { SupportTicketPriority } from "@/services/support-ticket.api";

export type { SupportTicketRecord, SupportTicketAttachment, SupportTicketPriority } from "@/services/support-ticket.api";

export type TicketPriorityFilter = "ALL" | SupportTicketPriority;
export type TicketStatusFilter = "ALL" | string;

export interface TicketFilters {
  search: string;
  priority: TicketPriorityFilter;
  status: TicketStatusFilter;
  school: string;
  page: number;
  pageSize: number;
}

export interface TicketStats {
  open: number;
  inProgress: number;
  resolvedToday: number;
}
