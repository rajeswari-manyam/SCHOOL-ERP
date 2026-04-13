import { useState, useRef, useEffect } from "react";
import type { SupportTicket } from "../types/support.types";
import { useTicketMutations } from "../hooks/useSupport";

interface TicketActionsMenuProps {
  ticket: SupportTicket;
  onView: (t: SupportTicket) => void;
}

const TicketActionsMenu = ({ ticket, onView }: TicketActionsMenuProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { updateStatus, resolveTicket, deleteTicket } = useTicketMutations();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const actions = [
    { label: "View Details",      onClick: () => { onView(ticket); setOpen(false); } },
    { label: "Mark In Progress",  onClick: () => { updateStatus.mutate({ id: ticket.id, status: "IN_PROGRESS" }); setOpen(false); } },
    { label: "Mark Resolved",     onClick: () => { resolveTicket.mutate(ticket.id); setOpen(false); } },
    { label: "Delete Ticket",     onClick: () => { confirm("Delete this ticket?") && deleteTicket.mutate(ticket.id); setOpen(false); }, className: "text-red-500" },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        View
      </button>

      {open && (
        <div className="absolute right-0 top-7 z-50 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1">
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={a.onClick}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${a.className ?? "text-gray-700"}`}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketActionsMenu;
