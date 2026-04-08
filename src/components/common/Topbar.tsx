import { useUIStore } from "@/store/uiStore";
import { cn } from "@/utils/cn";

export const Topbar = () => {
  const theme = useUIStore((s) => s.theme);
  return (
    <header
      className={cn(
        "w-full h-16 flex items-center px-6 bg-white border-b shadow-sm",
        theme === "dark" && "bg-gray-900 text-white",
      )}
    >
      <div className="font-bold text-lg">School ERP</div>
      {/* Add user menu, notifications, etc. here */}
    </header>
  );
};
