import type { ReactNode } from "react";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";
import type { NavItem } from "../types/NavItem.types";

import { useUIStore } from "@/store/uiStore";

interface Props {
  navItems: NavItem[];
  children: ReactNode;
}

const LayoutShell = ({ navItems, children }: Props) => {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar items={navItems} />

      {/* Main */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-0" : "ml-20"
        }`}
      >
        <Topbar />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutShell;