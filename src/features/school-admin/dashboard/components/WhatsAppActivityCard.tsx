import type { WAActivity } from "../types/sa-dashboard.types";

const typeIcon = (type: WAActivity["type"]) => {
  const icons: Record<WAActivity["type"], { bg: string; icon: React.ReactNode }> = {
    attendance: {
      bg: "bg-emerald-100",
      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
    },
    fee: {
      bg: "bg-amber-100",
      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    },
    broadcast: {
      bg: "bg-blue-100",
      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.16h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 6 6z"/></svg>,
    },
    staff: {
      bg: "bg-purple-100",
      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
    },
  };
  return icons[type];
};

const WhatsAppActivityCard = ({ activities = [] }: { activities?: WAActivity[] }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-extrabold text-gray-900">Recent WhatsApp Activity</h2>
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />LIVE
      </span>
    </div>

    <div className="flex flex-col gap-4">
      {activities.map((a) => {
        const { bg, icon } = typeIcon(a.type);
        return (
          <div key={a.id} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-snug">{a.message}</p>
              <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default WhatsAppActivityCard;
