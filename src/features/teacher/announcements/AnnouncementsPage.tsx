import { Megaphone, Calendar, Paperclip } from "lucide-react";
import { useAnnouncements } from "./hooks/useAnnouncements";

const CATEGORY_STYLE: Record<string, string> = {
  General:   "bg-indigo-100 text-indigo-700",
  Academic:  "bg-blue-100 text-blue-700",
  Event:     "bg-amber-100 text-amber-700",
  Holiday:   "bg-emerald-100 text-emerald-700",
  Emergency: "bg-red-100 text-red-700",
};

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const AnnouncementsPage = () => {
  const { data: announcements, isLoading, isError } = useAnnouncements();

  return (
    <div className="flex flex-col gap-4 min-h-full px-3 sm:px-6 pt-2 pb-6 max-w-3xl mx-auto">
      {/* Page header */}
      <div>
        <h1 className="text-sm font-semibold text-gray-900">Announcements</h1>
        <p className="text-[11px] text-gray-500 mt-0.5">Updates from the school admin for staff.</p>
      </div>

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
          <p className="text-sm font-semibold text-gray-700">No announcements yet</p>
          <p className="text-xs text-gray-400 mt-1">Updates from the school admin will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Megaphone className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-gray-900">{a.title.trim()}</p>
                  {a.category && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${CATEGORY_STYLE[a.category.trim()] ?? "bg-gray-100 text-gray-500"}`}>
                      {a.category.trim()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{a.message.trim()}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400 flex-wrap">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {fmtDate(a.publishDate)}</span>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;
