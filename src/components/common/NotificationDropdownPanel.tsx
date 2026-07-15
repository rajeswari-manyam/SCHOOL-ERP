import { Bell } from "lucide-react";
import typography from "@/styles/typography";
import type { AppNotification } from "@/services/notifications.api";

function notificationTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

interface NotificationDropdownPanelProps {
  notifications: AppNotification[];
  isLoading: boolean;
  unreadCount: number;
  className?: string;
}

export function NotificationDropdownPanel({
  notifications,
  isLoading,
  unreadCount,
  className = "",
}: NotificationDropdownPanelProps) {
  return (
    <div
      className={`w-80 max-w-[calc(100vw-1rem)] bg-white border border-[#E8EBF2] rounded-xl shadow-lg py-2 z-[55] ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#F1F3F8]">
        <p className={`${typography.body.small} font-medium text-[#0B1C30]`}>
          Notifications
        </p>
        {unreadCount > 0 && (
          <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
            {unreadCount} new
          </span>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col gap-2 px-4 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-3 w-full rounded bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 gap-1">
            <Bell size={20} className="text-gray-300" />
            <p className={`${typography.body.xs} text-[#9CA3AF]`}>No notifications yet</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="flex gap-2.5 px-4 py-2.5 border-b border-[#F1F3F8] last:border-0 hover:bg-[#F9FAFC]"
            >
              <span
                className={`mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full ${item.is_read ? "bg-transparent" : "bg-[#3525CD]"}`}
              />
              <div className="min-w-0 flex-1">
                <p className={`${typography.body.small} font-semibold text-[#0B1C30] leading-tight truncate`}>
                  {item.title}
                </p>
                <p className={`${typography.body.xs} text-[#6B7280] mt-0.5 line-clamp-2`}>
                  {item.message}
                </p>
                <p className={`${typography.body.xs} text-[#9CA3AF] mt-1`}>
                  {notificationTimeAgo(item.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
