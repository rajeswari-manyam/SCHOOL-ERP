import { useUIStore } from "@/store/uiStore";
import { cn } from "@/utils/cn";

export const ThemeSwitcher = () => {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  return (
    <button
      className={cn(
        "ml-4 p-2 rounded",
        theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200",
      )}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
};
