import { useState } from "react"
import { Card, CardContent } from "../../../../components/ui/card"
import { Megaphone, X, Bell, Star, ArrowRight } from "lucide-react"
import { useDashboardStore } from "../store/uistore"
import type { AnnouncementVariant } from "../types/dashboard.types"

interface AnnouncementCardProps {
  variant?: AnnouncementVariant
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

const TAG_STYLES: Record<string, string> = {
  All:    "bg-indigo-50 text-indigo-600 border-indigo-100",
  Parent: "bg-emerald-50 text-emerald-600 border-emerald-100",
  Class:  "bg-amber-50 text-amber-600 border-amber-100",
}

const DOT_STYLES: Record<string, string> = {
  All:    "bg-indigo-500",
  Parent: "bg-emerald-500",
  Class:  "bg-amber-500",
}

function tagStyle(type: string) {
  return TAG_STYLES[type] ?? "bg-gray-100 text-gray-500 border-gray-200"
}
function dotStyle(type: string) {
  return DOT_STYLES[type] ?? "bg-gray-400"
}

function SkeletonItem() {
  return (
    <div className="flex flex-col gap-1.5 py-3 border-b border-gray-100 last:border-0">
      <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
      <div className="h-3 w-full rounded bg-gray-200 animate-pulse" />
      <div className="h-3 w-3/4 rounded bg-gray-200 animate-pulse" />
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export const AnnouncementCard = ({ variant = "latest" }: AnnouncementCardProps) => {
  const { announcements, isLoadingAnnouncements } = useDashboardStore()
  const [showAll, setShowAll] = useState(false)

  const latest = announcements[0]
  const preview = announcements.slice(0, 3)

  // ─── ANNOUNCEMENTS VARIANT (used on dashboard) ────────────────────────────
  if (variant === "announcements") {
    return (
      <>
        <Card className="hover:border-indigo-200 border border-[#E8EBF2] shadow-none transition-colors">
          <CardContent className="p-0">

            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Megaphone size={13} className="text-indigo-600" />
                </div>
                <p className="text-[14px] font-semibold text-[#0B1C30]">Announcements</p>
                {announcements.length > 0 && (
                  <span className="text-[10px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {announcements.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowAll(true)}
                className="text-[11px] text-indigo-600 hover:underline font-semibold"
              >
                View all
              </button>
            </div>

            {/* List */}
            <div className="px-4 py-1 divide-y divide-gray-50">
              {isLoadingAnnouncements ? (
                [1, 2, 3].map((i) => <SkeletonItem key={i} />)
              ) : preview.length === 0 ? (
                <p className="text-[12px] text-gray-400 py-4 text-center">No announcements to show.</p>
              ) : (
                preview.map((item) => {
                  const type = item.visibility_scope?.type ?? "General"
                  return (
                    <div key={item.id} className="py-3 flex gap-3 group cursor-default">
                      {/* Dot */}
                      <div className="mt-1.5 shrink-0">
                        <span className={`block w-2 h-2 rounded-full ${dotStyle(type)}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wide ${tagStyle(type)}`}>
                            {type}
                          </span>
                          <span className="text-[10px] text-gray-400">{timeAgo(item.created_at)}</span>
                        </div>
                        <p className="text-[12px] font-semibold text-[#0B1C30] leading-tight truncate">{item.title}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{item.message}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            {!isLoadingAnnouncements && announcements.length > 3 && (
              <div className="px-4 pb-3 pt-0">
                <button
                  onClick={() => setShowAll(true)}
                  className="w-full text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 py-2 rounded-lg transition text-center"
                >
                  + {announcements.length - 3} more announcements
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── All Announcements Modal ── */}
        {showAll && (
          <div
            className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setShowAll(false)}
          >
            <div
              className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2">
                  <Megaphone size={16} className="text-indigo-600" />
                  <h2 className="text-[15px] font-semibold text-[#0B1C30]">All Announcements</h2>
                  <span className="text-[10px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">
                    {announcements.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowAll(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal body */}
              <div className="overflow-y-auto flex-1 px-5 py-2 divide-y divide-gray-50">
                {announcements.map((item) => {
                  const type = item.visibility_scope?.type ?? "General"
                  return (
                    <div key={item.id} className="py-4 flex gap-3">
                      <div className="mt-1 shrink-0">
                        <span className={`block w-2.5 h-2.5 rounded-full ${dotStyle(type)}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wide ${tagStyle(type)}`}>
                            {type}
                          </span>
                          <span className="text-[10px] text-gray-400">{timeAgo(item.created_at)}</span>
                        </div>
                        <p className="text-[13px] font-semibold text-[#0B1C30] leading-snug mb-1">{item.title}</p>
                        <p className="text-[12px] text-gray-500 leading-relaxed">{item.message}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // ─── DEFAULT (LATEST) VARIANT ─────────────────────────────────────────────
  const title       = latest?.title   ?? "No announcements yet"
  const description = latest?.message ?? "Check back later for updates from the school."
  const type        = latest?.visibility_scope?.type ?? "General"

  return (
    <>
      <Card className="hover:border-indigo-200 border border-[#E8EBF2] shadow-none transition-colors">
        <CardContent className="p-5">
          <div className="flex items-center gap-1.5 mb-3">
            <Star size={14} className="text-indigo-600" />
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wide">
              Latest Announcement
            </span>
            {latest && (
              <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded border ${tagStyle(type)}`}>
                {type}
              </span>
            )}
          </div>

          {isLoadingAnnouncements ? (
            <div className="flex flex-col gap-2">
              <div className="h-3 w-3/4 rounded bg-gray-200 animate-pulse" />
              <div className="h-3 w-full rounded bg-gray-200 animate-pulse" />
            </div>
          ) : (
            <>
              <p className="text-[13px] font-semibold text-[#0B1C30] leading-snug mb-1">{title}</p>
              <p className="text-[11px] text-gray-500 line-clamp-2 mb-3">{description}</p>
              <button
                onClick={() => setShowAll(true)}
                className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1 hover:underline"
              >
                View All Announcements
                <ArrowRight size={11} />
              </button>
            </>
          )}
        </CardContent>
      </Card>

      {showAll && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowAll(false)}
        >
          <div
            className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <Bell size={15} className="text-indigo-600" />
                <h2 className="text-[15px] font-semibold text-[#0B1C30]">All Announcements</h2>
              </div>
              <button onClick={() => setShowAll(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition">
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-2 divide-y divide-gray-50">
              {announcements.map((item) => {
                const t = item.visibility_scope?.type ?? "General"
                return (
                  <div key={item.id} className="py-4 flex gap-3">
                    <div className="mt-1 shrink-0">
                      <span className={`block w-2.5 h-2.5 rounded-full ${dotStyle(t)}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wide ${tagStyle(t)}`}>{t}</span>
                        <span className="text-[10px] text-gray-400">{timeAgo(item.created_at)}</span>
                      </div>
                      <p className="text-[13px] font-semibold text-[#0B1C30] leading-snug mb-1">{item.title}</p>
                      <p className="text-[12px] text-gray-500 leading-relaxed">{item.message}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
