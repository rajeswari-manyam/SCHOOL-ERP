import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import type { NavItem } from "@/types/NavItem.types";

interface SidebarProps {
  items: NavItem[];
  className?: string;
}

const Sidebar = ({ items }: SidebarProps) => {
  const { pathname } = useLocation();

  return (
    <aside className="flex flex-col h-screen w-72 bg-[#232b39] text-white justify-between">
      <div>
        {/* Logo and App Name */}
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="bg-[#6c63ff] rounded-xl w-12 h-12 flex items-center justify-center text-2xl font-bold">M</div>
          <div>
            <div className="font-bold text-xl leading-5">Manyam<br />SchoolERP</div>
            <div className="text-xs text-[#b0b8c1]">ACADEMIC MANAGEMENT</div>
          </div>
        </div>
        {/* Navigation */}
        <nav className="mt-6 flex flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition",
             pathname.startsWith(item.to)
                  ? "bg-[#6c63ff] text-white"
                  : "text-[#b0b8c1] hover:bg-[#2e3748] hover:text-white"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      {/* Bottom Section */}
      <div className="px-6 pb-6">
        <button className="w-full bg-[#25d366] text-white py-3 rounded-xl font-semibold mb-6 flex items-center justify-center gap-2">
          <span className="text-xl">💬</span> WhatsApp Support
        </button>
        <div className="flex items-center gap-3">
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
      </div>
    </aside>
  );
};

export default Sidebar;