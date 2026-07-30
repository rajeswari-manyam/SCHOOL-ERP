import { useEffect, useRef, useState } from "react";
import { X, Paperclip } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import type { SupportTicketPayload } from "@/services/support-ticket.api";
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

interface RaiseTicketModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: SupportTicketPayload) => void;
  submitting?: boolean;
  editing?: RaiseTicketInitialValues | null;
}

export default function RaiseTicketModal({ open, onClose, onSubmit, submitting, editing }: RaiseTicketModalProps) {
  const user = useAuthStore((s) => s.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(() => ({ ...INITIAL, contactPhone: user?.phone ?? "" }));
  const [attachment, setAttachment] = useState<File | null>(null);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setForm({
        subject: editing.subject,
        category: editing.category,
        contactPhone: editing.contactPhone,
        priority: priorityFromApi(editing.priority),
        description: editing.description,
      });
    } else {
      setForm({ ...INITIAL, contactPhone: user?.phone ?? "" });
    }
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [open, editing, user?.phone]);

  const canSubmit = form.subject.trim().length > 0 && form.description.trim().length > 0 && !submitting;

  const handleClear = () => {
    setForm({ ...INITIAL, contactPhone: user?.phone ?? "" });
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      subject: form.subject,
      category: form.category,
      contactNumber: form.contactPhone,
      priority: PRIORITY_TO_API[form.priority],
      description: form.description,
      attachment,
    });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <Card className="w-full sm:max-w-lg flex flex-col rounded-t-2xl sm:rounded-2xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden border border-slate-100">
        <div className="flex justify-center pt-3 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="flex-shrink-0 flex items-start justify-between px-6 pt-6 pb-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{editing ? "Edit support ticket" : "Raise a support ticket"}</h2>
            <p className="text-sm text-gray-500 mt-1">Tell us what's wrong and we'll route it to the right team.</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close"
            className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-6 space-y-5">
          <div>
            <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-500">Subject</Label>
            <Input
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              placeholder="e.g. WhatsApp alerts not firing"
              className="mt-1.5"
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
                className="mt-1.5 h-10 rounded-xl"
              />
            </div>
            <div>
              <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-500">Contact Phone</Label>
              <Input
                type="tel"
                value={form.contactPhone}
                onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
                placeholder="+91 98765 43210"
                className="mt-1.5"
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
              className="mt-1.5 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div>
            <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-500">Attachment (optional)</Label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1.5 w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-gray-300 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
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
