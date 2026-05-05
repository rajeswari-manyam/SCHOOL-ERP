import type { Announcement } from "../types/Student dashboard.types";
import { getTimeAgo, ANNOUNCEMENT_ICON_CONFIG } from "../utils/Student dashboard.utils";
import { Button } from "@/components/ui/button";

interface LatestAnnouncementsProps {
  announcements: Announcement[];
  onViewAll?: () => void;
}

const LatestAnnouncements = ({ announcements, onViewAll }: LatestAnnouncementsProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
    <h2 className="text-lg font-bold text-gray-900">Latest Announcements</h2>

    <div className="flex flex-col divide-y divide-gray-50">
      {announcements.map((ann) => {
        const { bg, emoji } = ANNOUNCEMENT_ICON_CONFIG[ann.iconType];
        return (
          <div key={ann.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <div
              className={`w-9 h-9 flex items-center justify-center rounded-xl ${bg} flex-shrink-0 text-base`}
            >
              {emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 leading-snug">
                {ann.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Published {getTimeAgo(ann.publishedAt)}
              </p>
            </div>
          </div>
        );
      })}

      {announcements.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6">No announcements</p>
      )}
    </div>

    {onViewAll && (
      <Button
        onClick={onViewAll}
        variant="ghost"
        className="mt-1 w-full text-center text-xs font-bold uppercase tracking-wider text-indigo-500 hover:text-indigo-700 transition-colors"
      >
        View All Announcements
      </Button>
    )}
  </div>
);

export default LatestAnnouncements;