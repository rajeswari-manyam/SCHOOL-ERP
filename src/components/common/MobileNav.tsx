import { Menu } from "lucide-react";
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
      <Menu className="h-6 w-6" />
    </button>
  );
};
