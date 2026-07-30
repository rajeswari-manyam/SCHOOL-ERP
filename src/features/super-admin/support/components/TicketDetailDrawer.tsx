import { X, Download } from "lucide-react";
import type { SupportTicketRecord } from "@/services/support-ticket.api";
import { PriorityBadge, StatusBadge } from "./TicketBadges";
import { useTicketMutations } from "../hooks/useSupport";

interface TicketDetailDrawerProps {
  ticket: SupportTicketRecord | null;
  onClose: () => void;
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1 py-3 border-b border-gray-50 last:border-0">
    <span className="text-[11px] font-bold tracking-widest uppercase text-gray-400">{label}</span>
    <div className="text-sm text-gray-800">{children}</div>
  </div>
);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const TicketDetailDrawer = ({ ticket, onClose }: TicketDetailDrawerProps) => {
  const { deleteTicket } = useTicketMutations();
  if (!ticket) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">{ticket.subject.trim()}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{ticket.school?.school_name ?? "—"}</p>
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
          <Row label="Category">{ticket.category.trim() || "—"}</Row>
          <Row label="Priority"><PriorityBadge priority={ticket.priority} /></Row>
          <Row label="Status"><StatusBadge status={ticket.status} /></Row>
          <Row label="Contact Number">{ticket.contactNumber.trim()}</Row>
          <Row label="Raised By">{ticket.createdByName ?? "—"}</Row>
          <Row label="Created">{fmtDate(ticket.createdAt)}</Row>
          <Row label="Assigned To">
            {ticket.assignedTo ?? <span className="italic text-gray-300">Unassigned</span>}
          </Row>
          <Row label="Description">
            <p className="text-sm text-gray-600 leading-relaxed">{ticket.description.trim()}</p>
          </Row>
          {ticket.attachments.length > 0 && (
            <Row label="Attachments">
              <div className="space-y-1.5">
                {ticket.attachments.map((a) => (
                  <a
                    key={a.key}
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> {a.name}
                  </a>
                ))}
              </div>
            </Row>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col gap-2">
          <button
            onClick={() => {
              if (confirm("Delete this ticket?")) {
                deleteTicket.mutate(ticket.id);
                onClose();
              }
            }}
            className="w-full h-10 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Delete Ticket
          </button>
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
