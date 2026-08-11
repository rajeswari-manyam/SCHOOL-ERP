import { useState, useRef, useEffect } from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import { Menu, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { useUIStore } from "@/store/uiStore";
import { useAcademicYears } from "./hooks/useAcademicYears";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationDropdownPanel } from "@/components/common/NotificationDropdownPanel";

type Breadcrumb = { label: string; href?: string };

interface TopbarProps {
  breadcrumbs?: Breadcrumb[];
  onBreadcrumb?: (href: string) => void;
}

const Topbar = ({
  breadcrumbs = [{ label: "Dashboard" }],
  onBreadcrumb = () => {},
}: TopbarProps) => {
  const sidebarOpen    = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const collapsed      = useUIStore((s) => s.collapsed);
  const setCollapsed   = useUIStore((s) => s.setCollapsed);
  const { years, activeYear, loading, switching, error, switchYear, retry } = useAcademicYears();
  const [yearOpen, setYearOpen] = useState(false);
  const yearRef = useRef<HTMLDivElement>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { notifications, isLoading: isLoadingNotifications, unreadCount, refetch: refetchNotifications } = useNotifications();

  let leftOffset = "left-0 md:left-[260px]";
  if (!sidebarOpen) leftOffset = "left-0 md:left-0";
  else if (collapsed) leftOffset = "left-0 md:left-16";

  const handleToggle = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setCollapsed((prev: boolean) => !prev);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (yearRef.current && !yearRef.current.contains(e.target as Node)) {
        setYearOpen(false);
      }
    };
    if (yearOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [yearOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-40 h-10 sm:h-12",
        "bg-white border-b border-slate-200 shadow-sm",
        "transition-all duration-300 ease-in-out",
        leftOffset
      )}
    >
      <div className="h-full flex items-center px-1 sm:px-2 md:px-3 lg:px-6 w-full gap-1 sm:gap-2 md:gap-3">

        {/* ── Sidebar toggle button ── */}
        <button
          onClick={handleToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex shrink-0 items-center justify-center",
            "h-7 w-7 rounded-lg",
            "bg-[#f4f7fd] text-[#6c7380]",
            "hover:bg-[#e9eef8] hover:text-slate-800",
            "transition-colors duration-150",
            "outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          )}
        >
          <Menu className="h-3.5 w-3.5" />
        </button>

        {/* ── Left: breadcrumb + search ── */}
        <div className="flex flex-1 min-w-0 items-center gap-1 sm:gap-2 md:gap-3">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 shrink-0">
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <div key={i} className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                  {i > 0 && <span className="text-slate-300 hidden sm:inline text-xs">/</span>}
                  {crumb.href && !isLast ? (
                    <button
                      onClick={() => onBreadcrumb(crumb.href!)}
                      className="text-[11px] sm:text-xs text-slate-500 hover:text-slate-700 font-medium transition-colors truncate hover:underline"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-xs sm:text-sm md:text-base font-semibold text-slate-700 truncate">
                      {crumb.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Search */}
          <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg bg-[#f4f7fd] px-2 sm:px-2.5 py-1">
            <FaSearch className="text-[#b0b8c1] text-[10px] sm:text-xs flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="min-w-0 flex-1 bg-transparent outline-none text-[11px] sm:text-xs text-slate-700 placeholder-[#b0b8c1]"
            />
          </div>
        </div>

        {/* ── Right: status + bell + year ── */}
        <div className="flex flex-nowrap items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
          <span className="flex items-center gap-1.5 rounded-lg bg-[#f4f7fd] px-2 sm:px-2.5 py-1 font-semibold text-[11px] text-[#6c7380] whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3fe0b0] inline-block" />
            <span className="hidden lg:inline">WhatsApp Connected</span>
            <span className="hidden sm:inline lg:hidden">Connected</span>
          </span>

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                const opening = !notifOpen;
                setNotifOpen(opening);
                setYearOpen(false);
                if (opening) refetchNotifications();
              }}
              className="relative rounded-lg bg-[#f4f7fd] p-1 text-[#6c7380] transition hover:bg-[#e9eef8] flex-shrink-0"
            >
              <FaBell className="text-xs sm:text-sm" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
              )}
            </button>

            {notifOpen && (
              <NotificationDropdownPanel
                className="absolute right-0 top-full mt-2"
                notifications={notifications}
                isLoading={isLoadingNotifications}
                unreadCount={unreadCount}
              />
            )}
          </div>

          <div className="hidden md:block h-4 border-l border-[#e5e7eb]" />

          <div className="relative hidden md:block" ref={yearRef}>
            <button
              onClick={() => !loading && !switching && setYearOpen(!yearOpen)}
              disabled={(loading && years.length === 0) || switching}
              className="flex items-center gap-1 rounded-lg bg-[#f4f7fd] px-2.5 py-1 font-semibold text-[11px] text-[#2d3748] whitespace-nowrap hover:bg-[#e9eef8] transition-colors min-w-0 disabled:opacity-60"
            >
              {loading || switching ? (
                <Loader2 size={12} className="animate-spin text-[#6c7380]" />
              ) : error && years.length === 0 ? (
                <span className="text-red-500 text-[9px]">Year unavailable</span>
              ) : (
                <>
                  <span className="truncate max-w-[80px]">{activeYear?.yearName || "Select Year"}</span>
                  <span className="text-[#6c7380] text-[9px]">▼</span>
                </>
              )}
            </button>

            {yearOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
                {error && (
                  <div className="px-3 py-1.5 text-[10px] text-red-500 border-b border-gray-100 flex items-center gap-2">
                    <span className="flex-1 truncate">{error}</span>
                    <button onClick={retry} className="text-indigo-600 hover:text-indigo-700 font-semibold shrink-0">Retry</button>
                  </div>
                )}
                <div className="max-h-40 overflow-y-auto">
                  {years.map((year) => {
                    const isActive = activeYear?.id === year.id;
                    return (
                      <button
                        key={year.id}
                        onClick={() => {
                          void switchYear(year);
                          setYearOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] transition-colors text-left ${
                          isActive
                            ? "bg-indigo-50 text-indigo-700 font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isActive ? "border-indigo-500" : "border-gray-300"
                        }`}>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                        </span>
                        <span className="flex-1 truncate">{year.yearName}</span>
                        {year.active && (
                          <span className="text-[9px] bg-green-100 text-green-700 px-1 py-0.5 rounded-full font-medium">Active</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {years.length === 0 && !loading && !error && (
                  <div className="px-3 py-3 text-center text-[10px] text-gray-400">No academic years found</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
