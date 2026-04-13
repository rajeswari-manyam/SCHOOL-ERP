import type { SupportTicket } from "../types/support.types";
import { PriorityBadge, StatusBadge } from "./TicketBadges";
import TicketActionsMenu from "./TicketActionsMenu";

interface TicketsTableProps {
  tickets: SupportTicket[];
  isLoading: boolean;
  onView: (t: SupportTicket) => void;
}

const COL = "text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-4 py-3 text-left";

const TicketsTable = ({ tickets, isLoading, onView }: TicketsTableProps) => {
  if (isLoading) {
    return (
      <div className="divide-y divide-gray-50">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-5 animate-pulse">
            <div className="h-4 w-16 rounded bg-gray-100" />
            <div className="h-3 w-28 rounded bg-gray-100" />
            <div className="flex-1 h-3 w-40 rounded bg-gray-100" />
            <div className="h-6 w-16 rounded-full bg-gray-100" />
            <div className="h-3 w-16 rounded bg-gray-100" />
            <div className="h-3 w-20 rounded bg-gray-100" />
            <div className="h-3 w-16 rounded bg-gray-100" />
            <div className="h-3 w-8 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  if (!tickets.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-sm text-gray-400 font-medium">No tickets found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className={COL}>Ticket ID</th>
            <th className={COL}>School</th>
            <th className={COL}>Subject</th>
            <th className={COL}>Priority</th>
            <th className={COL}>Status</th>
            <th className={COL}>Created</th>
            <th className={COL}>Assigned</th>
            <th className={COL}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
              {/* Ticket ID */}
              <td className="px-4 py-5">
                <button
                  onClick={() => onView(ticket)}
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  {ticket.ticketId}
                </button>
              </td>

              {/* School */}
              <td className="px-4 py-5">
                <span className="text-sm font-bold text-gray-900">{ticket.school}</span>
              </td>

              {/* Subject */}
              <td className="px-4 py-5 max-w-[200px]">
                <span className="text-sm text-gray-600 leading-snug">{ticket.subject}</span>
              </td>

              {/* Priority */}
              <td className="px-4 py-5">
                <PriorityBadge priority={ticket.priority} />
              </td>

              {/* Status */}
              <td className="px-4 py-5">
                <StatusBadge status={ticket.status} />
              </td>

              {/* Created */}
              <td className="px-4 py-5 text-sm text-gray-500 whitespace-nowrap">
                {ticket.createdAt}
              </td>

              {/* Assigned */}
              <td className="px-4 py-5">
                {ticket.assignedTo ? (
                  <span className="text-sm text-gray-700">{ticket.assignedTo}</span>
                ) : (
                  <span className="text-sm italic text-gray-300">unassigned</span>
                )}
              </td>

              {/* Actions */}
              <td className="px-4 py-5">
                <TicketActionsMenu ticket={ticket} onView={onView} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketsTable;
