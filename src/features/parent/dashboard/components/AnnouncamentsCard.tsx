import { Card, CardContent } from "../../../../components/ui/card";
import { Megaphone, Star, ArrowRight } from "lucide-react";

interface AnnouncementCardProps {
  title: string;
  description: string;
  tag?: string;
  variant?: "latest" | "announcements";
  postedAt?: string;
  onViewAll?: () => void;
}

export const AnnouncementCard = ({
  title,
  description,
  tag = "Latest Announcement",
  variant = "latest",
  postedAt,
  onViewAll,
}: AnnouncementCardProps) => {

  // ── Announcements variant (All Fees Paid) ──
  if (variant === "announcements") {
    return (
      <Card className="hover:border-[#3525CD] border border-[#E8EBF2] shadow-none transition-colors">
        <CardContent className="p-5 flex flex-col gap-4">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone size={15} className="text-[#0B1C30]" />
              <p className="text-[15px] font-semibold text-[#0B1C30]">Announcements</p>
            </div>
            <button className="text-[11px] text-[#3525CD] hover:underline font-medium">
              View all
            </button>
          </div>

          {/* Announcement item */}
          <div className="rounded-lg border border-[#C7D2FE] bg-[#EEF2FF] overflow-hidden">
            <div className="flex">
              {/* Left accent bar */}
              <div className="w-1 bg-[#3525CD] shrink-0 rounded-l-lg" />

              <div className="p-4 flex flex-col gap-1.5">
                {/* Tag badge */}
                <span className="text-[9px] font-bold tracking-widest text-[#3525CD] uppercase bg-[#EEF2FF] px-2 py-0.5 rounded w-fit">
                  {tag}
                </span>

                <p className="text-[13px] font-semibold text-[#0B1C30] leading-snug">
                  {title}
                </p>

                <p className="text-[12px] text-gray-500 leading-relaxed">
                  {description}
                </p>

                {postedAt && (
                  <p className="text-[11px] text-gray-400 mt-1">{postedAt}</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-[12px] text-[#6B7280] border border-[#E8EBF2] px-3 py-1.5 rounded-lg hover:border-[#3525CD] hover:text-[#3525CD] transition-colors">
              🎧 Help Desk
            </button>
            <button className="flex items-center gap-1.5 text-[12px] text-[#6B7280] border border-[#E8EBF2] px-3 py-1.5 rounded-lg hover:border-[#3525CD] hover:text-[#3525CD] transition-colors">
              📋 Syllabus
            </button>
          </div>

        </CardContent>
      </Card>
    );
  }

  // ── Latest variant (Fees Pending layout) ──
  return (
    <Card className="hover:border-[#3525CD] border border-[#E8EBF2] shadow-none transition-colors">
      <CardContent className="p-5">
        <div className="flex items-center gap-1.5 mb-3">
          <Star size={14} className="text-[#3525CD]" />
          <span className="text-[11px] font-semibold text-[#3525CD] uppercase tracking-wide">
            {tag}
          </span>
        </div>
<p className="text-[13px] font-semibold text-[#3525CD] leading-snug">
  {title}
</p>
        <p className="text-xs text-gray-500 leading-relaxed mb-3">{description}</p>
        <button
          onClick={onViewAll}
          className="text-xs font-medium text-[#3525CD] hover:opacity-75 transition-opacity flex items-center gap-1"
        >
          View All Announcements
          <ArrowRight size={12} />
        </button>
      </CardContent>
    </Card>
  );
};