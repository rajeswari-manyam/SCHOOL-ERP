export type TicketPriority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";
export type TicketStatus   = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface SupportTicket {
  id: string;
  ticketId: string;       // e.g. "TK-0089"
  school: string;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;      // relative display e.g. "2 hrs ago"
  createdAtISO?: string;
  assignedTo?: string;    // undefined = unassigned
  description?: string;
}

export interface TicketStats {
  open: number;
  inProgress: number;
  resolvedToday: number;
}

export interface TicketFilters {
  search: string;
  priority: TicketPriority | "ALL";
  status: TicketStatus | "ALL";
  school: string;
  page: number;
  pageSize: number;
}

export interface TicketsResponse {
  data: SupportTicket[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TicketFormValues {
  school: string;
  subject: string;
  description: string;
  priority: TicketPriority;
}
