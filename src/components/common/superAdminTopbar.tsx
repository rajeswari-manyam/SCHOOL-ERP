// TopBar.jsx
// Production-level topbar matching the Management Portal design
// Features: breadcrumb, notification bell with badge + dropdown,
//           help icon, divider, avatar with user dropdown

import { useState, useRef, useEffect, type RefObject } from "react";

// ─── Lucide React Icons ─────────────────────────────────────────────────────
import {
  Bell,
  HelpCircle,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";

// ─── useClickOutside hook ────────────────────────────────────────────────────
function useClickOutside(ref: RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

// ─── NotificationDropdown ────────────────────────────────────────────────────
function NotificationDropdown({ notifications, onMarkAllRead }: { notifications: NotificationItem[]; onMarkAllRead: () => void; }) {
  return (
    <div style={{
      position: "absolute",
      top: "calc(100% + 8px)",
      right: 60,
      width: 300,
      background: "#fff",
      border: "0.5px solid #E2E8F0",
      borderRadius: 12,
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      zIndex: 100,
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 14px 10px",
        borderBottom: "0.5px solid #F1F5F9",
      }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "#1E293B" }}>Notifications</span>
        <button
          onClick={onMarkAllRead}
          style={{
            border: "none", background: "none", cursor: "pointer",
            fontSize: 11, color: "#3B4EFF", fontWeight: 400,
          }}
        >
          Mark all read
        </button>
      </div>
      {/* Items */}
      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            display: "flex", gap: 10,
            padding: "10px 14px",
            borderBottom: "0.5px solid #F8FAFC",
            background: n.unread ? "#EFF6FF" : "#fff",
            cursor: "pointer",
            transition: "background 0.1s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = n.unread ? "#DBEAFE" : "#F8FAFC"}
          onMouseLeave={(e) => e.currentTarget.style.background = n.unread ? "#EFF6FF" : "#fff"}
        >
          <div style={{ paddingTop: 4, flexShrink: 0 }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: n.unread ? "#3B4EFF" : "transparent",
              marginTop: 2,
            }} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#1E293B", lineHeight: 1.4 }}>{n.text}</div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>{n.time}</div>
          </div>
        </div>
      ))}
      {notifications.length === 0 && (
        <div style={{ padding: "20px 14px", fontSize: 13, color: "#94A3B8", textAlign: "center" }}>
          No new notifications
        </div>
      )}
    </div>
  );
}

// ─── UserDropdown ────────────────────────────────────────────────────────────
function UserDropdown({ user, onLogout }: { user: UserProfile; onLogout: () => void; }) {
  return (
    <div style={{
      position: "absolute",
      top: "calc(100% + 8px)",
      right: 0,
      width: 210,
      background: "#fff",
      border: "0.5px solid #E2E8F0",
      borderRadius: 12,
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      zIndex: 100,
      padding: 6,
      overflow: "hidden",
    }}>
      {/* User info */}
      <div style={{
        padding: "8px 10px 10px",
        borderBottom: "0.5px solid #F1F5F9",
        marginBottom: 6,
      }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#1E293B" }}>{user.name}</div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
          {user.role} · {user.school}
        </div>
      </div>
      {[
        { icon: <User size={14} />, label: "My Profile", danger: false },
        { icon: <Settings size={14} />, label: "Settings", danger: false },
      ].map((item) => (
        <div
          key={item.label}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 10px", borderRadius: 6, fontSize: 13,
            color: "#64748B", cursor: "pointer", transition: "all 0.1s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#F8FAFC";
            e.currentTarget.style.color = "#1E293B";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#64748B";
          }}
        >
          {item.icon}
          {item.label}
        </div>
      ))}
      <div
        onClick={onLogout}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 10px", borderRadius: 6, fontSize: 13,
          color: "#DC2626", cursor: "pointer", transition: "background 0.1s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#FEF2F2"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <LogOut size={14} />
        Sign out
      </div>
    </div>
  );
}

type Breadcrumb = { label: string; href?: string };
type NotificationItem = { id: number; text: string; time: string; unread: boolean };
type UserProfile = { name: string; initials: string; role: string; school: string; avatarColor?: string };

// ─── TopBar (main export) ─────────────────────────────────────────────────────
/**
 * TopBar
 *
 * Props:
 *   breadcrumbs   – Array<{ label: string, href?: string }>
 *                   Last item is the current page (bold).
 *   user          – { name, initials, role, school, avatarColor? }
 *   notifications – Array<{ id, text, time, unread }>
 *   onLogout      – () => void
 *   onBreadcrumb  – (href: string) => void
 */
interface TopBarProps {
  breadcrumbs?: Breadcrumb[];
  user?: UserProfile;
  notifications?: NotificationItem[];
  onLogout?: () => void;
  onBreadcrumb?: (href: string) => void;
}

export default function TopBar({
  breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Management Portal" },
  ],
  user = {
    name: "Rajesh Kumar",
    initials: "RK",
    role: "School Admin",
    school: "Sunrise Academy",
    avatarColor: "#3B4EFF",
  },
  notifications: initialNotifications = [
    { id: 1, text: "New student admission request pending approval", time: "2 min ago", unread: true },
    { id: 2, text: "Fee payment overdue — 12 students", time: "1 hr ago", unread: true },
    { id: 3, text: "Timetable updated for Grade 10-A", time: "3 hr ago", unread: true },
  ],
  onLogout = () => {},
  onBreadcrumb = () => {},
}: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  useClickOutside(notifRef, () => setNotifOpen(false));
  useClickOutside(userRef, () => setUserOpen(false));

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    setNotifOpen(false);
  };

  return (
    <header className="flex items-center h-14 px-6 bg-white border-b border-gray-200 gap-2 font-sans sticky top-0 z-50">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 flex-1">
        {breadcrumbs.map((crumb, i) => {
          const isLast = i === breadcrumbs.length - 1;
          return (
            <span key={crumb.label} className="flex items-center gap-1">
              {/* {i > 0 && (
                <span style={{ color: "#CBD5E1", fontSize: 16, fontWeight: 300, lineHeight: 1 }}>›</span>
              )} */}
              {isLast ? (
                <span className="text-[15px] font-bold text-slate-900">
                  {crumb.label}
                </span>
              ) : (
                <Button
                  onClick={() => crumb.href && onBreadcrumb(crumb.href)}
                  variant="ghost"
                  className="text-[14px] text-slate-400 hover:text-slate-800 transition-colors px-0 font-sans"
                >
                  {crumb.label}
                </Button>
              )}
            </span>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Notification bell */}
        <div ref={notifRef} className="relative">
          <Button
            onClick={() => { setNotifOpen((v) => !v); setUserOpen(false); }}
            variant="ghost"
            className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer relative text-slate-400 hover:bg-slate-100 transition-colors"
            type="button"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-0 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </Button>
          {notifOpen && (
            <NotificationDropdown
              notifications={notifications}
              onMarkAllRead={markAllRead}
            />
          )}
        </div>

        {/* Help */}
        <Button
          variant="ghost"
          type="button"
          className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer text-slate-400 hover:bg-slate-100 transition-colors"
        >
          <HelpCircle size={18} />
        </Button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-2" />

        {/* Avatar + Dropdown */}
        <div ref={userRef} className="relative">
          <Button
            variant="ghost"
            type="button"
            onClick={() => { setUserOpen((v) => !v); setNotifOpen(false); }}
            className="flex items-center gap-1 px-1.5 py-1 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0"
              style={{ background: user.avatarColor ?? "#3B4EFF" }}
            >
              {user.initials}
            </div>
            <span className="text-slate-400">
              <ChevronDown size={14} />
            </span>
          </Button>
          {userOpen && (
            <UserDropdown
              user={user}
              onLogout={() => { setUserOpen(false); onLogout(); }}
            />
          )}
        </div>
      </div>
    </header>
  );
}

