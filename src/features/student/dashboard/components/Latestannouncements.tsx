import { useState } from "react";
import type { Announcement } from "../types/dashboard.types";
import { Megaphone, CalendarCheck } from "lucide-react";

interface Props {
  data: Announcement[];
}

const BRAND = "#3525CD";

const iconConfig: Record<
  Announcement["type"],
  { icon: React.ReactNode; bg: string; color: string }
> = {
  info: {
    icon: <Megaphone size={16} strokeWidth={2} />,
    bg: "#EEF0FF",
    color: BRAND,
  },
  alert: {
    icon: <CalendarCheck size={16} strokeWidth={2} />,
    bg: "#FEF0E6",
    color: "#E07B39",
  },
};

export const LatestAnnouncements = ({ data }: Props) => {
  const [showAll, setShowAll] = useState(false);

  // 👉 default: only 2 items (daily view)
  const visibleData = showAll ? data : data.slice(0, 2);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm transition-all duration-200 md:hover:border-[#3525CD] md:hover:shadow-md">

      {/* Title */}
      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">
        Latest Announcements
      </h3>

      {/* List */}
      <div className="flex flex-col gap-2 sm:gap-4">
        {visibleData.map((ann) => {
          const cfg = iconConfig[ann.type] ?? iconConfig.info;

          return (
            <div
              key={ann.id}
              className="
                flex items-start gap-3
                rounded-lg sm:rounded-xl
                p-2.5 sm:p-3
                transition-all duration-200
                md:hover:bg-gray-50 md:hover:shadow-sm
                cursor-pointer
              "
            >
              {/* Icon */}
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: cfg.bg, color: cfg.color }}
              >
                {cfg.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-snug">
                  {ann.title}
                </p>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                  Published {ann.timeAgo}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toggle Button */}
      {data.length > 2 && (
        <div className="border-t border-gray-100 mt-3 sm:mt-4 pt-3 sm:pt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="
              w-full text-center
              text-[11px] sm:text-xs
              font-bold uppercase tracking-[0.1em]
              transition-all duration-200
              md:hover:text-[#2419A8]
            "
            style={{ color: BRAND }}
          >
            {showAll ? "Show Less" : "View All Announcements"}
          </button>
        </div>
      )}

    </div>
  );
};