import { useNavigate } from "react-router-dom";
import { Megaphone, Calendar, Plus, Paperclip, Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnnouncements, useAnnouncementMutations } from "./hooks/useAnnouncements";
import { AUDIENCES } from "./AnnouncementFormPage";
import type { AnnouncementInitialValues } from "./AnnouncementFormPage";
import type { SchoolAnnouncementRecord } from "@/services/school-announcement.api";

const audienceLabel = (value: string) => AUDIENCES.find((a) => a.value === value)?.label ?? value;

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export default function AnnouncementsPage() {
  const navigate = useNavigate();
  const { data: announcements, isLoading, isError } = useAnnouncements();
  const { deleteAnnouncement } = useAnnouncementMutations();

  const goToForm = (editing?: AnnouncementInitialValues) =>
    navigate("/schooladmin/announcements/new", { state: { editing } });

  const openEdit = (a: SchoolAnnouncementRecord) => {
    goToForm({
      id: a.id,
      title: a.title.trim(),
      message: a.message.trim(),
      category: a.category.trim(),
      publishDate: a.publishDate,
      audience: a.audience,
      existingAttachmentName: a.attachments?.[0]?.name,
    });
  };

  const handleDelete = (a: SchoolAnnouncementRecord) => {
    if (confirm(`Delete the announcement "${a.title.trim()}"?`)) {
      deleteAnnouncement.mutate(a.id);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Announcements</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Publish updates that parents, students, and staff will see on their dashboard.
          </p>
        </div>
        <Button
          onClick={() => goToForm()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </Button>
      </div>

      {/* Announcements list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-sm text-red-500">
          Failed to load announcements.
        </div>
      ) : !announcements || announcements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-3">
            <Megaphone className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-sm font-semibold text-gray-700">No announcements published yet</p>
          <p className="text-xs text-gray-400 mt-1">Click "New Announcement" to publish an update.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Megaphone className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900">{a.title.trim()}</p>
                      {a.category && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-700">
                          {a.category.trim()}
                        </span>
                      )}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-500 capitalize">
                        {a.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{a.message.trim()}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {fmtDate(a.publishDate)}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {audienceLabel(a.audience)}</span>
                      {a.attachments?.map((att) => (
                        <a
                          key={att.key}
                          href={att.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                        >
                          <Paperclip className="w-3 h-3" /> {att.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(a)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-50"
                    aria-label="Edit announcement"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(a)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50"
                    aria-label="Delete announcement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
