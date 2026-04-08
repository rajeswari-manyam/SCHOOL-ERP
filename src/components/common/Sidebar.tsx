import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";

interface NavItem {
  label: string;
  to: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  items: NavItem[];
}

export const Sidebar = ({ items }: SidebarProps) => {
  const { pathname } = useLocation();
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <nav className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center px-3 py-2 rounded hover:bg-blue-50 transition",
              pathname === item.to && "bg-blue-100 font-semibold",
            )}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
