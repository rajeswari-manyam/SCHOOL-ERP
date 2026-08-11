import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useAnnouncementMutations } from "./hooks/useAnnouncements";

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

interface AnnouncementFormPageState {
  editing?: AnnouncementInitialValues | null;
}

export default function AnnouncementFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { editing } = (location.state as AnnouncementFormPageState | null) ?? {};
  const goBackToList = () => navigate("/schooladmin/announcements");

  const { createAnnouncement, updateAnnouncement } = useAnnouncementMutations();
  const submitting = createAnnouncement.isPending || updateAnnouncement.isPending;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(editing
    ? {
        title: editing.title,
        message: editing.message,
        category: editing.category || "General",
        publishDate: editing.publishDate,
        audience: editing.audience || "parents",
      }
    : INITIAL
  );
  const [attachment, setAttachment] = useState<File | null>(null);

  useEffect(() => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const canSubmit = form.title.trim().length > 0 && form.message.trim().length > 0 && form.publishDate.length > 0 && !submitting;

  const handleClear = () => {
    setForm(INITIAL);
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const payload = {
      title: form.title,
      message: form.message,
      category: form.category,
      publishDate: form.publishDate,
      audience: form.audience,
      attachment,
    };
    if (editing) {
      updateAnnouncement.mutate({ id: editing.id, payload }, { onSuccess: goBackToList });
    } else {
      createAnnouncement.mutate(payload, { onSuccess: goBackToList });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <button type="button" onClick={goBackToList} className="hover:text-indigo-600 transition-colors font-medium">
          Announcements
        </button>
        <span>›</span>
        <span className="text-gray-700 font-semibold">{editing ? "Edit announcement" : "New announcement"}</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-gray-100">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{editing ? "Edit announcement" : "New announcement"}</h1>
            <p className="text-sm text-gray-500 mt-1">Publish updates that parents, students, or staff will see.</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={goBackToList} aria-label="Back"
            className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          <div>
            <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-500">Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. School closed for Independence Day"
              className="mt-1.5 bg-[#EFF4FF]"
            />
          </div>

          <div>
            <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-500">Message</Label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              rows={4}
              placeholder="Write the announcement details..."
              className="mt-1.5 w-full rounded-xl border border-gray-300 bg-[#EFF4FF] px-4 py-2.5 text-sm text-slate-900 placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-500">Category</Label>
              <Select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                options={CATEGORIES.map((c) => ({ label: c, value: c }))}
                className="mt-1.5 h-10 rounded-xl bg-[#EFF4FF]"
              />
            </div>
            <div>
              <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-500">Publish Date</Label>
              <Input
                type="date"
                value={form.publishDate}
                onChange={(e) => setForm((f) => ({ ...f, publishDate: e.target.value }))}
                className="mt-1.5 bg-[#EFF4FF]"
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
              className="mt-1.5 w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-gray-300 bg-[#EFF4FF] text-sm text-gray-500 hover:bg-gray-100 transition-colors"
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
        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t border-gray-100">
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
      </div>
    </div>
  );
}
