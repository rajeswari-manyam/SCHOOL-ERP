import { useNavigate } from "react-router-dom";
import type { CriticalTicket, TicketPriority, TicketStatus } from "../types/dashboard.types";

const priorityStyles: Record<TicketPriority, string> = {
  URGENT: "border border-red-400 text-red-500",
  HIGH:   "border border-amber-400 text-amber-600",
  MEDIUM: "bg-indigo-50 text-indigo-500 border border-indigo-200",
  LOW:    "bg-gray-100 text-gray-500",
};

const statusStyles: Record<TicketStatus, { text: string; dot: string; label: string }> = {
  OPEN:        { text: "text-red-500",     dot: "bg-red-500",     label: "Open" },
  IN_PROGRESS: { text: "text-amber-500",   dot: "bg-amber-400",   label: "In Progress" },
  RESOLVED:    { text: "text-emerald-600", dot: "bg-emerald-500", label: "Resolved" },
};

const COL = "text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-4 py-3 text-left";

interface CriticalTicketsTableProps {
  tickets: CriticalTicket[];
  requiresAction: number;
  isLoading: boolean;
}

const CriticalTicketsTable = ({ tickets, requiresAction, isLoading }: CriticalTicketsTableProps) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <h2 className="text-sm font-extrabold text-gray-900">Critical Support Tickets</h2>
        {requiresAction > 0 && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
            {requiresAction} REQUIRES ACTION
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-sm text-gray-400 animate-pulse">Loading…</div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-50">
              <th className={COL}>Ticket ID</th>
              <th className={COL}>School</th>
              <th className={COL}>Subject</th>
              <th className={COL}>Priority</th>
              <th className={COL}>Status</th>
              <th className={COL}>Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tickets.map((t) => {
              const s = statusStyles[t.status];
              return (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <button
                      onClick={() => navigate(`/super-admin/support?ticket=${t.id}`)}
                      className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      {t.ticketId}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{t.school}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 max-w-[220px]">{t.subject}</td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${priorityStyles[t.priority]}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${s.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-400 whitespace-nowrap">{t.createdAgo}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CriticalTicketsTable;
