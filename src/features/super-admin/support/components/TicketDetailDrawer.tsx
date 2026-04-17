import { X } from "lucide-react";
import type { SupportTicket } from "../types/support.types";
import { PriorityBadge, StatusBadge } from "./TicketBadges";
import { useTicketMutations } from "../hooks/useSupport";

interface TicketDetailDrawerProps {
  ticket: SupportTicket | null;
  onClose: () => void;
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1 py-3 border-b border-gray-50 last:border-0">
    <span className="text-[11px] font-bold tracking-widest uppercase text-gray-400">{label}</span>
    <div className="text-sm text-gray-800">{children}</div>
  </div>
);

const TicketDetailDrawer = ({ ticket, onClose }: TicketDetailDrawerProps) => {
  const { updateStatus, assignTicket, resolveTicket } = useTicketMutations();
  if (!ticket) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">{ticket.ticketId}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{ticket.school}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Row label="Subject">{ticket.subject}</Row>
          <Row label="Priority"><PriorityBadge priority={ticket.priority} /></Row>
          <Row label="Status"><StatusBadge status={ticket.status} /></Row>
          <Row label="Created">{ticket.createdAt}</Row>
          <Row label="Assigned To">
            {ticket.assignedTo ?? <span className="italic text-gray-300">Unassigned</span>}
          </Row>
          {ticket.description && (
            <Row label="Description">
              <p className="text-sm text-gray-600 leading-relaxed">{ticket.description}</p>
            </Row>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col gap-2">
          {ticket.status !== "IN_PROGRESS" && ticket.status !== "RESOLVED" && (
            <button
              onClick={() => updateStatus.mutate({ id: ticket.id, status: "IN_PROGRESS" })}
              className="w-full h-10 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors"
            >
              Mark In Progress
            </button>
          )}
          {ticket.status !== "RESOLVED" && (
            <button
              onClick={() => { resolveTicket.mutate(ticket.id); onClose(); }}
              className="w-full h-10 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              Mark Resolved
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full h-10 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default TicketDetailDrawer;
