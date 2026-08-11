import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Paperclip } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import { useSupportTicketMutations } from "./hooks/useSupportTickets";
import type { TicketPriority } from "./types";
import { PRIORITY_TO_API, priorityFromApi } from "./types";

export const CATEGORIES = [
  "Technical Issue",
  "WhatsApp / Notifications",
  "Fee Collection",
  "Attendance",
  "Student / Staff Data",
  "Billing & Subscription",
  "Other",
];

export const PRIORITIES: TicketPriority[] = ["Low", "Medium", "High", "Urgent"];

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  Low: "border-slate-300 text-slate-600",
  Medium: "border-indigo-500 text-indigo-600 bg-indigo-50",
  High: "border-amber-400 text-amber-600",
  Urgent: "border-red-400 text-red-600",
};

const INITIAL = {
  subject: "",
  category: "",
  contactPhone: "",
  priority: "Medium" as TicketPriority,
  description: "",
};

export interface RaiseTicketInitialValues {
  id: string;
  subject: string;
  category: string;
  contactPhone: string;
  priority: TicketPriority;
  description: string;
  existingAttachmentName?: string;
}

interface RaiseTicketPageState {
  editing?: RaiseTicketInitialValues | null;
}

export default function RaiseTicketPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { editing } = (location.state as RaiseTicketPageState | null) ?? {};
  const goBackToList = () => navigate("/schooladmin/support");

  const user = useAuthStore((s) => s.user);
  const { createTicket, updateTicket } = useSupportTicketMutations();
  const submitting = createTicket.isPending || updateTicket.isPending;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(() =>
    editing
      ? {
          subject: editing.subject,
          category: editing.category,
          contactPhone: editing.contactPhone,
          priority: priorityFromApi(editing.priority),
          description: editing.description,
        }
      : { ...INITIAL, contactPhone: user?.phone ?? "" }
  );
  const [attachment, setAttachment] = useState<File | null>(null);

  const canSubmit = form.subject.trim().length > 0 && form.description.trim().length > 0 && !submitting;

  const handleClear = () => {
    setForm({ ...INITIAL, contactPhone: user?.phone ?? "" });
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const payload = {
      subject: form.subject,
      category: form.category,
      contactNumber: form.contactPhone,
      priority: PRIORITY_TO_API[form.priority],
      description: form.description,
      attachment,
    };
    if (editing) {
      updateTicket.mutate({ id: editing.id, payload }, { onSuccess: goBackToList });
    } else {
      createTicket.mutate(payload, { onSuccess: goBackToList });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <button type="button" onClick={goBackToList} className="hover:text-indigo-600 transition-colors font-medium">
          Support Tickets
        </button>
        <span>›</span>
        <span className="text-gray-700 font-semibold">{editing ? "Edit support ticket" : "Raise a support ticket"}</span>
      </div>

      <Card className="w-full flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="flex-shrink-0 flex items-start justify-between px-6 pt-6 pb-5 border-b border-gray-100">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{editing ? "Edit support ticket" : "Raise a support ticket"}</h1>
            <p className="text-sm text-gray-500 mt-1">Tell us what's wrong and we'll route it to the right team.</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={goBackToList} aria-label="Back"
            className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          <div>
            <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-500">Subject</Label>
            <Input
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              placeholder="e.g. WhatsApp alerts not firing"
              className="mt-1.5 bg-[#EFF4FF]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-500">Category</Label>
              <Select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="Select category"
                options={CATEGORIES.map((c) => ({ label: c, value: c }))}
                className="mt-1.5 h-10 rounded-xl bg-[#EFF4FF]"
              />
            </div>
            <div>
              <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-500">Contact Phone</Label>
              <Input
                type="tel"
                value={form.contactPhone}
                onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
                placeholder="+91 98765 43210"
                className="mt-1.5 bg-[#EFF4FF]"
              />
            </div>
          </div>

          <div>
            <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-500 mb-2 block">Priority</Label>
            <div className="grid grid-cols-4 gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, priority: p }))}
                  className={`h-10 rounded-xl border text-sm font-semibold transition-colors ${
                    form.priority === p ? PRIORITY_STYLES[p] : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-500">Description</Label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={4}
              placeholder="Describe the issue in detail — what happened, when it started, who's affected"
              className="mt-1.5 w-full rounded-xl border border-gray-300 bg-[#EFF4FF] px-4 py-2.5 text-sm text-slate-900 placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div>
            <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-500">Attachment (optional)</Label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1.5 w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-gray-300 bg-[#EFF4FF] text-sm text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Paperclip className="w-4 h-4" />
              {attachment ? attachment.name : editing?.existingAttachmentName ?? "Attach a screenshot or file"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-end gap-4 px-6 py-4 border-t border-gray-100">
          <button type="button" onClick={handleClear} className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
            Clear
          </button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {submitting ? "Submitting…" : editing ? "Save changes" : "Submit ticket"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
