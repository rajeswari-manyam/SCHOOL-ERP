import { useState,useEffect,useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import { useUIStore } from "@/store/uiStore";
import type { NavItem } from "@/types/NavItem.types";

import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaCog } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
interface SidebarProps {
  items: NavItem[];
  className?: string;
}

const Sidebar = ({ items, className }: SidebarProps) => {
  const { pathname } = useLocation();
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
const [openMenu, setOpenMenu] = useState(false);
const menuRef = useRef<HTMLDivElement | null>(null);
const navigate = useNavigate();

useEffect(() => {
  const handleClick = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpenMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClick);
  return () => document.removeEventListener("mousedown", handleClick);
}, []);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const handleResize = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setSidebarOpen(true);
      }
    };

    if (!media.matches && sidebarOpen) {
      setSidebarOpen(false);
    }

    media.addEventListener("change", handleResize);
    return () => media.removeEventListener("change", handleResize);
  }, [sidebarOpen, setSidebarOpen]);
const handleLogout = () => {
  localStorage.clear();
  navigate("/login", { replace: true });
};
  return (
    <>
      <Button
        variant="ghost"
        type="button"
        className="md:hidden fixed top-4 left-4 z-50 h-11 w-11 rounded-2xl bg-white text-slate-900 shadow-lg flex items-center justify-center transition-colors duration-200"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </Button>

      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 md:hidden",
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-y-auto bg-[#232b39] text-white transition-transform duration-300 ease-in-out md:translate-x-0 md:h-screen",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex items-center justify-between gap-3 px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="bg-[#6c63ff] rounded-xl w-8 h-8 flex items-center justify-center text-2xl font-bold">M</div>
            <div>
              <div className="font-bold text-md leading-5">Manyam<br />SchoolERP</div>
              
              {/* <div className="text-xs text-[#b0b8c1]">ACADEMIC MANAGEMENT</div> */}
            </div>
          </div>
          <Button
            variant="ghost"
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
       

        <nav className=" flex flex-col  px-0">
          {items.map((item) => {
            const isActive = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative flex min-h-[3rem] items-center gap-3 px-6 py-3 rounded-xl font-medium text-base transition-all duration-200",
                  isActive
                    ? "bg-[#6c63ff]  text-white shadow-[0_10px_30px_-18px_rgba(108,99,255,0.9)]"
                    : "text-[#b0b8c1] hover:bg-[#2e3748] hover:text-white"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <span className={cn("flex h-5 w-5 min-w-[1.5rem] items-center justify-center rounded-2xl text-xl transition-colors duration-200", isActive ? "text-white" : "text-[#b0b8c1]")}>{item.icon}</span>
                <span className="min-w-0 text-sm sm:text-base leading-5">{item.label}</span>
                {isActive && <span className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-[#ffffff] opacity-90" />}
              </Link>
            );
          })}
        </nav>

        <div ref={menuRef} className="mt-auto px-6 pb-6 relative">

  {/* Profile */}
  <div
    onClick={() => setOpenMenu(!openMenu)}
    className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-[#2e3748]"
  >
    <img
      src="/path/to/profile.jpg"
      alt="Profile"
      className="w-10 h-10 rounded-full object-cover"
    />
    <div>
      <div className="font-semibold">Ramesh Kumar</div>
      <div className="text-xs text-[#b0b8c1]">Administrator</div>
    </div>
  </div>

  {/* Dropdown */}
  {openMenu && (
    <div className="absolute bottom-16 left-6 right-6 bg-white text-black rounded-xl shadow-lg overflow-hidden z-50">

      {/* Settings */}
      <Button
        variant="ghost"
        onClick={() => navigate("/accountant/settings")}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
      >
        <FaCog />
        Settings
      </Button>

      {/* Logout */}
      <Button
        variant="ghost"
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-red-600"
      >
        <FaSignOutAlt />
        Logout
      </Button>

    </div>
  )}
</div>
      </aside>
    </>
  );
};

export default Sidebar;