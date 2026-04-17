// TopBar.jsx
// Production-level topbar matching the Management Portal design
// Features: breadcrumb, notification bell with badge + dropdown,
//           help icon, divider, avatar with user dropdown

import { useState, useRef, useEffect, type RefObject } from "react";

// ─── Inline SVG Icons ────────────────────────────────────────────────────────
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const HelpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const SettingsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33
      1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06
      a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09
      A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06
      A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51
      1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9
      a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

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
        { icon: <UserIcon />, label: "My Profile", danger: false },
        { icon: <SettingsIcon />, label: "Settings", danger: false },
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
        <LogoutIcon />
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
    <header style={{
      display: "flex",
      alignItems: "center",
      height: 56,
    
      padding: "0 24px",
      background: "#FFFFFF",
      borderBottom: "0.5px solid #E2E8F0",
      gap: 8,
      fontFamily: "'Inter', sans-serif",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      {/* Breadcrumb */}
      <nav style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
        {breadcrumbs.map((crumb, i) => {
          const isLast = i === breadcrumbs.length - 1;
          return (
            <span key={crumb.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {/* {i > 0 && (
                <span style={{ color: "#CBD5E1", fontSize: 16, fontWeight: 300, lineHeight: 1 }}>›</span>
              )} */}
              {isLast ? (
                <span style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
                  {crumb.label}
                </span>
              ) : (
                <button
                  onClick={() => crumb.href && onBreadcrumb(crumb.href)}
                  style={{
                    border: "none", background: "none", cursor: "pointer",
                    fontSize: 14, color: "#94A3B8", padding: 0,
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#1E293B"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#94A3B8"}
                >
                  {/* {crumb.label} */}
                </button>
              )}
            </span>
          );
        })}
      </nav>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {/* Notification bell */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setNotifOpen((v) => !v); setUserOpen(false); }}
            style={{
              width: 36, height: 36, display: "flex", alignItems: "center",
              justifyContent: "center", border: "none", background: "none",
              borderRadius: "50%", cursor: "pointer", position: "relative",
              color: "#64748B", transition: "background 0.12s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#F8FAFC"}
            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
          >
            <BellIcon />
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: 3, right: 2,
                width: 18, height: 18, background: "#EF4444", color: "#fff",
                borderRadius: "50%", fontSize: 10, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid #fff",
              }}>
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <NotificationDropdown
              notifications={notifications}
              onMarkAllRead={markAllRead}
            />
          )}
        </div>

        {/* Help */}
        <button
          style={{
            width: 36, height: 36, display: "flex", alignItems: "center",
            justifyContent: "center", border: "none", background: "none",
            borderRadius: "50%", cursor: "pointer", color: "#64748B",
            transition: "background 0.12s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#F8FAFC"}
          onMouseLeave={(e) => e.currentTarget.style.background = "none"}
        >
          <HelpIcon />
        </button>

        {/* Divider */}
        <div style={{ width: "0.5px", height: 24, background: "#E2E8F0", margin: "0 8px" }} />

        {/* Avatar + Dropdown */}
        <div ref={userRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setUserOpen((v) => !v); setNotifOpen(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "4px 6px", borderRadius: 8,
              border: "none", background: "none", cursor: "pointer",
              transition: "background 0.12s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#F8FAFC"}
            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
          >
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: user.avatarColor ?? "#3B4EFF",
              color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 600, flexShrink: 0,
            }}>
              {user.initials}
            </div>
            <span style={{ color: "#94A3B8" }}>
              <ChevronDown />
            </span>
          </button>
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

