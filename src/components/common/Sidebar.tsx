// src/components/common/Sidebar.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X, ChevronDown, LogOut, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { useUIStore } from "@/store/uiStore";
import type { NavItem } from "@/types/NavItem.types";

interface SidebarProps {
  items: NavItem[];
  className?: string;
  user?: { name: string; role: string; avatar?: string };
}

export const SIDEBAR_EXPANDED_W  = 260;
export const SIDEBAR_COLLAPSED_W = 64;

const Sidebar = ({ items, className, user }: SidebarProps) => {
  const { pathname }   = useLocation();
  const navigate       = useNavigate();

  const sidebarOpen    = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const collapsed      = useUIStore((s) => s.collapsed);
  const setCollapsed   = useUIStore((s) => s.setCollapsed);

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  /* ── Close profile dropdown on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpenMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Sync open state with viewport ── */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setSidebarOpen(mq.matches);
    const handler = (e: MediaQueryListEvent) => {
      setSidebarOpen(e.matches);
      if (!e.matches) setCollapsed(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [setSidebarOpen, setCollapsed]);

  /* ── Escape → close mobile sidebar ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen && window.innerWidth < 768)
        setSidebarOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [sidebarOpen, setSidebarOpen]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const navItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        isActive: pathname === item.to || pathname.startsWith(item.to + "/"),
      })),
    [items, pathname]
  );

  return (
    <>
      {/* ════════════════════════════════════════════
          MOBILE BACKDROP
      ════════════════════════════════════════════ */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════
          SIDEBAR SHELL
      ════════════════════════════════════════════ */}
      <motion.aside
        role="navigation"
        aria-label="Navigation sidebar"
        animate={{ width: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        style={{ height: "100vh", top: 0, bottom: 0 }}
        className={cn(
          "fixed left-0 z-50 flex flex-col overflow-hidden",
          "bg-[#232B39] text-white",
          "border-r border-white/[0.08] shadow-[4px_0_24px_rgba(0,0,0,0.3)]",
          "transition-transform duration-300 ease-in-out md:transition-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ROW 1 — HEADER
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-white/[0.08]",
            collapsed ? "justify-center px-0" : "justify-between px-4"
          )}
        >
          {/* Expanded: full logo + mobile-only X close button */}
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                key="logo-block"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden flex items-center justify-between flex-1 min-w-0"
              >
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6C63FF] text-sm font-bold shadow-lg shadow-[#6C63FF]/30">
                    V
                  </div>
                  <div className="whitespace-nowrap">
                    <p className="text-[13px] font-bold tracking-wide leading-tight">VidyaTracker</p>
                    <p className="text-[10px] text-slate-400 leading-tight">School Management</p>
                  </div>
                </Link>

                {/* X — mobile only, closes the overlay */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close navigation"
                  className="flex md:hidden shrink-0 h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]"
                >
                  <X className="h-[18px] w-[18px]" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsed: app icon only, no button */}
          {collapsed && (
            <Link
              to="/dashboard"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6C63FF] text-sm font-bold shadow-lg shadow-[#6C63FF]/30 outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]"
              title="School ERP"
            >
              S
            </Link>
          )}
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ROW 2 — NAV
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <nav
          className="min-h-0 flex-1 px-2 py-3"
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.15) transparent",
          }}
          aria-label="Main menu"
        >
          <style>{`
            aside[aria-label="Navigation sidebar"] nav::-webkit-scrollbar { width: 4px; }
            aside[aria-label="Navigation sidebar"] nav::-webkit-scrollbar-track { background: transparent; }
            aside[aria-label="Navigation sidebar"] nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 999px; }
            aside[aria-label="Navigation sidebar"] nav::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.28); }
          `}</style>

          <ul className="m-0 list-none space-y-0.5 p-0">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => {
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  title={collapsed ? String(item.label) : undefined}
                  aria-current={item.isActive ? "page" : undefined}
                  className={cn(
                    "group relative flex min-h-[46px] items-center overflow-hidden rounded-xl",
                    "text-sm font-medium transition-all duration-200",
                    "outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]",
                    collapsed ? "justify-center px-0 py-2" : "gap-3 px-4 py-2",
                    item.isActive
                      ? "bg-[#6C63FF] text-white shadow-[0_6px_20px_-6px_rgba(108,99,255,0.65)]"
                      : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
                  )}
                >
                  {item.isActive && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute left-0 top-[6px] bottom-[6px] w-[3px] rounded-r-full bg-white/80"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center text-[17px] transition-colors",
                      item.isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                    )}
                  >
                    {item.icon}
                  </span>

                  <AnimatePresence initial={false}>
                    {!collapsed && (
                      <motion.span
                        key="nav-label"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.18, ease: "easeInOut" }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ROW 3 — PROFILE / FOOTER
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div ref={menuRef} className="shrink-0 border-t border-white/[0.08] p-2">

          {/* Collapsed: avatar only, no interaction */}
          {collapsed ? (
            <div
              title={user?.name ?? "Ramesh Kumar"}
              className="flex w-full items-center justify-center rounded-xl p-2"
            >
              <img
                src={user?.avatar ?? "https://i.pravatar.cc/100"}
                alt="Profile"
                className="h-9 w-9 rounded-full border-2 border-white/10 object-cover"
              />
            </div>
          ) : (
            <>
              <button
                onClick={() => setOpenMenu((v) => !v)}
                aria-expanded={openMenu}
                aria-haspopup="menu"
                className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-white/10 outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]"
              >
                <img
                  src={user?.avatar ?? "https://i.pravatar.cc/100"}
                  alt="Profile"
                  className="h-9 w-9 shrink-0 rounded-full border-2 border-white/10 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold leading-tight">
                    {user?.name ?? "Ramesh Kumar"}
                  </p>
                  <p className="truncate text-[11px] text-slate-400 leading-tight">
                    {user?.role ?? "Administrator"}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
                    openMenu && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {openMenu && (
                  <motion.div
                    key="profile-dropdown"
                    role="menu"
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="mt-1.5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1a2130] shadow-2xl"
                  >
                    <Button
                      variant="ghost"
                      role="menuitem"
                      onClick={() => { navigate("/account/settings"); setOpenMenu(false); }}
                      className="flex h-11 w-full items-center justify-start gap-3 rounded-none px-4 text-[13px] font-medium text-slate-200 hover:bg-white/10 hover:text-white"
                    >
                      <Settings className="h-4 w-4 shrink-0 text-slate-400" />
                      Settings
                    </Button>
                    <div className="mx-3 border-t border-white/[0.06]" />
                    <Button
                      variant="ghost"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex h-11 w-full items-center justify-start gap-3 rounded-none px-4 text-[13px] font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      Logout
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;