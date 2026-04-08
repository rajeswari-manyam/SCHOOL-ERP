import { useUIStore } from "@/store/uiStore";
import { cn } from "@/utils/cn";

export const MobileNav = () => {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  return (
    <button
      className={cn(
        "md:hidden p-2 fixed top-4 left-4 z-50 bg-white rounded shadow",
        sidebarOpen && "bg-blue-100",
      )}
      onClick={() => setSidebarOpen(!sidebarOpen)}
      aria-label="Toggle sidebar"
    >
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-menu"
      >
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
};
