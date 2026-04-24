import type { WhatsAppActivity } from "../types/dashboard.types";

interface Props {
  activities: WhatsAppActivity[];
}

export function AlertsFeed({ activities }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 text-base">Recent WhatsApp Activity</h2>
        <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
          LIVE
        </span>
      </div>

      <div className="space-y-4">
        {activities.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-base shrink-0">
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{item.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
