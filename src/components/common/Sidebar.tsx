



import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut, Settings } from "lucide-react";
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

const Sidebar = ({ items, className, user }: SidebarProps) => {
  const { pathname }            = useLocation();
  const navigate                = useNavigate();
  const sidebarOpen             = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen          = useUIStore((s) => s.setSidebarOpen);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef                 = useRef<HTMLDivElement | null>(null);
  const sidebarRef              = useRef<HTMLDivElement | null>(null);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpenMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Responsive: open on desktop, closed on mobile ── */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setSidebarOpen(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSidebarOpen(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [setSidebarOpen]);

  /* ── Escape closes mobile sidebar ── */
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
      {/* Mobile hamburger */}
      {!sidebarOpen && (
        <Button
          variant="ghost"
          onClick={() => setSidebarOpen(true)}
          className="fixed left-3 top-3 z-[60] h-10 w-10 rounded-xl border border-slate-200/80 bg-white shadow-lg hover:bg-slate-50 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5 text-slate-700" />
        </Button>
      )}

      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[1px] md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/*
        ┌─────────────────────────────────────────┐
        │  SIDEBAR                                │
        │                                         │
        │  fixed inset-y-0   → full screen height │
        │  flex flex-col     → 3-row stack        │
        │  NO overflow here  → each row owns it   │
        └─────────────────────────────────────────┘
      */}
      <aside
        ref={sidebarRef}
        role="navigation"
        aria-label="Navigation sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50",
          "w-[260px] lg:w-[280px]",
          // ↓ Three-row column. NO overflow-hidden on this element.
          "flex flex-col",
          "bg-[#232B39] text-white",
          "border-r border-white/10 shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        {/* ROW 1 — Header: fixed height, never shrinks */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Link to="/dashboard" className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6C63FF] text-sm font-bold shadow-lg">
              M
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold tracking-wide">Manyam ERP</p>
              <p className="text-[11px] text-slate-400">School Management</p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="shrink-0 text-white hover:bg-white/10 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* ROW 2 — Nav: flex-1 fills all remaining height, scrolls internally */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-2 ">
          <div className="space-y-0.5">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                className={cn(
                  "group relative flex min-h-[46px] items-center gap-3 overflow-hidden rounded-xl px-4 py-2",
                  "text-sm font-medium transition-all duration-200",
                  item.isActive
                    ? "bg-[#6C63FF] text-white shadow-[0_8px_24px_-8px_rgba(108,99,255,0.7)]"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.isActive && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-white"
                  />
                )}
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center text-base transition-colors",
                    item.isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                  )}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* ROW 3 — Footer: fixed height, always pinned to bottom, never pushed off */}
        <div ref={menuRef} className="shrink-0 border-t border-white/10 p-3">
          <button
            onClick={() => setOpenMenu((v) => !v)}
            className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all hover:bg-white/10"
          >
            <img
              src={user?.avatar || "https://i.pravatar.cc/100"}
              alt="profile"
              className="h-9 w-9 shrink-0 rounded-full border-2 border-white/10 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.name || "Ramesh Kumar"}</p>
              <p className="truncate text-xs text-slate-400">{user?.role || "Administrator"}</p>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200",
                openMenu && "rotate-180"
              )}
            />
          </button>

          {/* Dropdown opens upward */}
          <AnimatePresence>
            {openMenu && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="mt-2 overflow-hidden rounded-xl border border-slate-200/10 bg-white/95 shadow-xl backdrop-blur"
              >
                <Button
                  variant="ghost"
                  onClick={() => navigate("/account/settings")}
                  className="flex h-11 w-full items-center justify-start gap-3 rounded-none px-4 text-sm text-slate-700 hover:bg-slate-100"
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex h-11 w-full items-center justify-start gap-3 rounded-none px-4 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Logout
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;