
import { FaSearch, FaBell } from "react-icons/fa";
import { cn } from "@/utils/cn";

type Breadcrumb = { label: string; href?: string };

interface TopbarProps {
  breadcrumbs?: Breadcrumb[];
  onBreadcrumb?: (href: string) => void;
}

const Topbar = ({ breadcrumbs = [{ label: "Dashboard" }], onBreadcrumb = () => {} }: TopbarProps) => {
  
  return (
    <header className={cn(
      "fixed top-0 right-0 z-40 h-16 sm:h-20 bg-white border-b border-slate-200 shadow-sm transition-all duration-300 ease-in-out",
      "left-0 md:left-[280px]"
    )}>
      <div className="h-full flex items-center px-3 sm:px-4 md:px-6 lg:px-8 w-full">
        <div className="flex flex-1 min-w-0 items-center gap-2 sm:gap-3 md:gap-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <div key={i} className="flex items-center gap-1 sm:gap-2 min-w-0">
                  {i > 0 && <span className="text-slate-300 hidden sm:inline">/</span>}
                  {crumb.href && !isLast ? (
                    <button
                      onClick={() => onBreadcrumb(crumb.href!)}
                      className="text-xs sm:text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors truncate hover:underline"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-xs sm:text-base md:text-lg font-semibold text-slate-700 truncate">{crumb.label}</span>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 rounded-lg sm:rounded-2xl bg-[#f4f7fd] px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5">
            <FaSearch className="text-[#b0b8c1] text-xs sm:text-sm flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="min-w-0 flex-1 bg-transparent outline-none text-xs sm:text-sm text-slate-700 placeholder-[#b0b8c1]"
            />
          </div>
        </div>

        <div className="flex flex-nowrap items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0 ml-2 sm:ml-3 md:ml-4">
          <span className="hidden md:flex items-center gap-2 rounded-lg md:rounded-xl bg-[#f4f7fd] px-3 md:px-4 py-1.5 md:py-2 font-semibold text-xs md:text-sm text-[#6c7380] whitespace-nowrap">
            <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#3fe0b0] inline-block" />
            <span className="hidden lg:inline">WhatsApp Connected</span>
            <span className="lg:hidden">Connected</span>
          </span>

          <button className="relative rounded-lg sm:rounded-xl bg-[#f4f7fd] p-1.5 sm:p-2 text-[#6c7380] transition hover:bg-[#e9eef8] flex-shrink-0">
            <FaBell className="text-sm sm:text-base md:text-lg" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="hidden md:block h-5 sm:h-6 border-l border-[#e5e7eb]" />

          <button className="hidden md:flex items-center gap-1 rounded-lg md:rounded-xl bg-[#f4f7fd] px-2 md:px-4 py-1.5 md:py-2 font-semibold text-xs md:text-sm text-[#2d3748] whitespace-nowrap">
            2024-25 <span className="text-[#6c7380]">▼</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;