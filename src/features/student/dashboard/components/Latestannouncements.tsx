import type { Announcement } from "../types/dashboard.types";

interface Props {
  data: Announcement[];
}

export const LatestAnnouncements = ({ data }: Props) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Latest Announcements</h3>
      </div>

      <div className="space-y-0">
        {data.map((ann, idx) => (
          <div
            key={ann.id}
            className={`flex items-start gap-3 py-3 ${
              idx < data.length - 1 ? "border-b border-gray-50" : ""
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                ann.type === "info"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {ann.type === "info" ? "📢" : "📅"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-gray-800 leading-snug">{ann.title}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{ann.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-2 text-center text-xs text-blue-600 hover:text-blue-700 transition-colors">
        View All Announcements
      </button>
    </div>
  );
};
