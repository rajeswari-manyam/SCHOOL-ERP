import { useEffect, useRef, useState } from "react";
import { X, Paperclip } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { SchoolAnnouncementPayload } from "@/services/school-announcement.api";

export const CATEGORIES = ["General", "Academic", "Event", "Holiday", "Emergency", "Other"];
export const AUDIENCES = [
  { label: "parents", value: "parents" },
  { label: "Staff", value: "staff" },
];

const INITIAL = {
  title: "",
  message: "",
  category: "General",
  publishDate: "",
  audience: "parents",
};

export interface AnnouncementInitialValues {
  id: string;
  title: string;
  message: string;
  category: string;
  publishDate: string;
  audience: string;
  existingAttachmentName?: string;
}

interface AnnouncementFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: SchoolAnnouncementPayload) => void;
  submitting?: boolean;
  editing?: AnnouncementInitialValues | null;
}

export default function AnnouncementFormModal({ open, onClose, onSubmit, submitting, editing }: AnnouncementFormModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(INITIAL);
  const [attachment, setAttachment] = useState<File | null>(null);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setForm({
        title: editing.title,
        message: editing.message,
        category: editing.category || "General",
        publishDate: editing.publishDate,
        audience: editing.audience || "parents",
      });
    } else {
      setForm(INITIAL);
    }
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [open, editing]);

  const canSubmit = form.title.trim().length > 0 && form.message.trim().length > 0 && form.publishDate.length > 0 && !submitting;

  const handleClear = () => {
    setForm(INITIAL);
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      title: form.title,
      message: form.message,
      category: form.category,
      publishDate: form.publishDate,
      audience: form.audience,
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
            <h2 className="text-xl font-bold text-gray-900">{editing ? "Edit announcement" : "New announcement"}</h2>
            <p className="text-sm text-gray-500 mt-1">Publish updates that parents, students, or staff will see.</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close"
            className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-6 space-y-5">
          <div>
            <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-500">Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. School closed for Independence Day"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-500">Message</Label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              rows={4}
              placeholder="Write the announcement details..."
              className="mt-1.5 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-500">Category</Label>
              <Select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                options={CATEGORIES.map((c) => ({ label: c, value: c }))}
                className="mt-1.5 h-10 rounded-xl"
              />
            </div>
            <div>
              <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-500">Publish Date</Label>
              <Input
                type="date"
                value={form.publishDate}
                onChange={(e) => setForm((f) => ({ ...f, publishDate: e.target.value }))}
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-500 mb-2 block">Audience</Label>
            <div className="grid grid-cols-2 gap-2">
              {AUDIENCES.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, audience: a.value }))}
                  className={`h-10 rounded-xl border text-sm font-semibold transition-colors ${
                    form.audience === a.value
                      ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-500">Attachment (optional)</Label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1.5 w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-gray-300 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Paperclip className="w-4 h-4" />
              {attachment ? attachment.name : editing?.existingAttachmentName ?? "Attach a file"}
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
            {submitting ? "Saving…" : editing ? "Save changes" : "Publish Announcement"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
