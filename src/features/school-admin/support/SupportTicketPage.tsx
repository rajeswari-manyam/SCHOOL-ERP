import { useState } from "react";
import { Plus, MessageSquareText, Calendar, Paperclip, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import RaiseTicketModal from "./RaiseTicketModal";
import { useSupportTickets, useSupportTicketMutations } from "./hooks/useSupportTickets";
import { priorityFromApi } from "./types";
import type { RaiseTicketInitialValues } from "./RaiseTicketModal";
import type { SupportTicketRecord, SupportTicketPayload } from "@/services/support-ticket.api";
import type { TicketPriority } from "./types";

const PRIORITY_BADGE: Record<TicketPriority, string> = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-indigo-100 text-indigo-700",
  High: "bg-amber-100 text-amber-700",
  Urgent: "bg-red-100 text-red-700",
};

const STATUS_BADGE: Record<string, string> = {
  open: "bg-emerald-100 text-emerald-700",
  in_progress: "bg-amber-100 text-amber-700",
  resolved: "bg-indigo-100 text-indigo-700",
  closed: "bg-gray-100 text-gray-500",
};

const statusLabel = (status: string) =>
  status.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export default function SupportTicketPage() {
  const { data: tickets, isLoading, isError } = useSupportTickets();
  const { createTicket, updateTicket, deleteTicket } = useSupportTicketMutations();
  const [openModal, setOpenModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<SupportTicketRecord | null>(null);

  const editingValues: RaiseTicketInitialValues | null = editingTicket
    ? {
        id: editingTicket.id,
        subject: editingTicket.subject.trim(),
        category: editingTicket.category.trim(),
        contactPhone: editingTicket.contactNumber,
        priority: priorityFromApi(editingTicket.priority),
        description: editingTicket.description.trim(),
        existingAttachmentName: editingTicket.attachments?.[0]?.name,
      }
    : null;

  const handleSubmit = (payload: SupportTicketPayload) => {
    if (editingTicket) {
      updateTicket.mutate(
        { id: editingTicket.id, payload },
        { onSuccess: () => { setOpenModal(false); setEditingTicket(null); } }
      );
    } else {
      createTicket.mutate(payload, { onSuccess: () => setOpenModal(false) });
    }
  };

  const openCreate = () => { setEditingTicket(null); setOpenModal(true); };
  const openEdit = (ticket: SupportTicketRecord) => { setEditingTicket(ticket); setOpenModal(true); };
  const closeModal = () => { setOpenModal(false); setEditingTicket(null); };

  const handleDelete = (ticket: SupportTicketRecord) => {
    if (confirm(`Delete the ticket "${ticket.subject.trim()}"?`)) {
      deleteTicket.mutate(ticket.id);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Support Tickets</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Raised issues are routed to the VidyaTrack support team.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Raise Ticket
        </Button>
      </div>

      {/* Ticket list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-24 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-sm text-red-500">
          Failed to load support tickets.
        </div>
      ) : !tickets || tickets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-3">
            <MessageSquareText className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-sm font-semibold text-gray-700">No support tickets yet</p>
          <p className="text-xs text-gray-400 mt-1">Click "Raise Ticket" to report an issue to our team.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => {
            const priority = priorityFromApi(t.priority);
            return (
              <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900">{t.subject.trim()}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${PRIORITY_BADGE[priority]}`}>
                        {priority}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${STATUS_BADGE[t.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {statusLabel(t.status)}
                      </span>
                    </div>
                    {t.category && <p className="text-xs text-gray-400 mt-1">{t.category.trim()}</p>}
                    <p className="text-sm text-gray-600 mt-2">{t.description.trim()}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {fmtDate(t.createdAt)}</span>
                      {t.attachments?.map((a) => (
                        <a
                          key={a.key}
                          href={a.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                        >
                          <Paperclip className="w-3 h-3" /> {a.name}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit(t)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-50"
                      aria-label="Edit ticket"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50"
                      aria-label="Delete ticket"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <RaiseTicketModal
        open={openModal}
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitting={createTicket.isPending || updateTicket.isPending}
        editing={editingValues}
      />
    </div>
  );
}
