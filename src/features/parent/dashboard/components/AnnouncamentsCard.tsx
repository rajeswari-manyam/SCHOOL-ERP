import { useState } from "react"
import { Card, CardContent } from "../../../../components/ui/card"
import { Megaphone, Star, ArrowRight } from "lucide-react"
import { useDashboardStore } from "../store/uistore"
import type { AnnouncementVariant } from "../types/dashboard.types"

interface AnnouncementCardProps {
  variant?: AnnouncementVariant
}

function SkeletonLine({ w = "w-full" }: { w?: string }) {
  return <div className={`h-3 rounded bg-gray-200 animate-pulse ${w}`} />
}

export const AnnouncementCard = ({ variant = "latest" }: AnnouncementCardProps) => {
  const { announcements, isLoadingAnnouncements } = useDashboardStore()
  const [showAll, setShowAll] = useState(false)

  // Latest = first item
  const latest = announcements[0]

  const title       = latest?.title       ?? "No announcements yet"
  const description = latest?.message     ?? ""
  const postedAt    = latest
    ? new Date(latest.created_at).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : undefined
  const tag = latest?.visibility_scope?.type ?? "General"

  if (isLoadingAnnouncements) {
    return (
      <Card className="border border-[#E8EBF2] shadow-none">
        <CardContent className="p-5 flex flex-col gap-3">
          <SkeletonLine w="w-1/2" />
          <SkeletonLine />
          <SkeletonLine w="w-3/4" />
        </CardContent>
      </Card>
    )
  }

  // ─── ANNOUNCEMENTS VARIANT ────────────────────────────────
  if (variant === "announcements") {
    return (
      <>
        <Card className="hover:border-[#3525CD] border border-[#E8EBF2] shadow-none transition-colors">
          <CardContent className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone size={15} className="text-[#0B1C30]" />
                <p className="text-[15px] font-semibold text-[#0B1C30]">
                  Announcements
                </p>
              </div>
              <button
                onClick={() => setShowAll(true)}
                className="text-[11px] text-[#3525CD] hover:underline font-medium"
              >
                View all
              </button>
            </div>

            {latest ? (
              <div className="rounded-lg border border-[#C7D2FE] bg-[#EEF2FF] overflow-hidden">
                <div className="flex">
                  <div className="w-1 bg-[#3525CD] shrink-0 rounded-l-lg" />
                  <div className="p-4 flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold tracking-widest text-[#3525CD] uppercase bg-[#EEF2FF] px-2 py-0.5 rounded w-fit">
                      {tag}
                    </span>
                    <p className="text-[13px] font-semibold text-[#0B1C30]">{title}</p>
                    <p className="text-[12px] text-gray-500">{description}</p>
                    {postedAt && (
                      <p className="text-[11px] text-gray-400 mt-1">{postedAt}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[12px] text-gray-400">No announcements to show.</p>
            )}
          </CardContent>
        </Card>

        {showAll && (
          <div className="border rounded-xl p-4 bg-white shadow-sm mt-2">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-[14px]">All Announcements</h2>
              <button onClick={() => setShowAll(false)} className="text-xs text-[#3525CD]">
                Close
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {announcements.map((item) => (
                <div key={item.id} className="border p-3 rounded-lg">
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(item.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    )
  }

  // ─── DEFAULT (LATEST) VARIANT ─────────────────────────────
  return (
    <>
      <Card className="hover:border-[#3525CD] border border-[#E8EBF2] shadow-none transition-colors">
        <CardContent className="p-5">
          <div className="flex items-center gap-1.5 mb-3">
            <Star size={14} className="text-[#3525CD]" />
            <span className="text-[11px] font-semibold text-[#3525CD] uppercase tracking-wide">
              Latest Announcement
            </span>
          </div>
          <p className="text-[13px] font-semibold text-[#3525CD]">{title}</p>
          <p className="text-xs text-gray-500 mb-3">{description}</p>
          <button
            onClick={() => setShowAll(true)}
            className="text-xs font-medium text-[#3525CD] flex items-center gap-1"
          >
            View All Announcements
            <ArrowRight size={12} />
          </button>
        </CardContent>
      </Card>

      {showAll && (
        <div className="border rounded-xl p-4 bg-white shadow-sm mt-2">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-[14px]">All Announcements</h2>
            <button onClick={() => setShowAll(false)} className="text-xs text-[#3525CD]">
              Close
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {announcements.map((item) => (
              <div key={item.id} className="border p-3 rounded-lg">
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs text-gray-500">{item.message}</p>
                <p className="text-[10px] text-gray-400 mt-1">
                  {new Date(item.created_at).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}