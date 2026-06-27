import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  FaThLarge,
  FaMoneyBill,
  FaFileAlt,
  FaUsers,
  FaBook,
  FaChartBar,
} from "react-icons/fa";

import Sidebar from "@/components/common/Sidebar";
import Topbar from "@/components/common/Topbar";
import WhatsAppFAB from "@/components/ui/whatsappfab";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { getUserById } from "@/services/auth.api";

const NavItem = [
  { label: "Dashboard", to: "/accountant/dashboard", icon: <FaThLarge /> },
  { label: "Fee Management", to: "/accountant/fees", icon: <FaMoneyBill /> },
  { label: "Receipts & Invoices", to: "/accountant/receipts", icon: <FaFileAlt /> },
  { label: "Payroll", to: "/accountant/payroll", icon: <FaUsers /> },
  { label: "Ledger", to: "/accountant/ledger", icon: <FaBook /> },
  { label: "Reports", to: "/accountant/reports", icon: <FaChartBar /> },
];

export const AccountantLayout = () => {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const collapsed = useUIStore((s) => s.collapsed);
  const user = useAuthStore((s) => s.user);
  const setUserProfile = useAuthStore((s) => s.setUserProfile);

  // Fetch full profile on first load if name was never populated
  useEffect(() => {
    const userId = user?.id ?? localStorage.getItem("userId");
    if (!userId) return;
    if (user?.name && user.name !== "User") return;
    getUserById(userId)
      .then(profile => { if (profile?.status) setUserProfile(profile); })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  let mainPadding = "md:pl-[260px]";
  if (!sidebarOpen) mainPadding = "md:pl-0";
  else if (collapsed) mainPadding = "md:pl-16";

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#F4F6FA]">
      <Sidebar
        items={NavItem}
        user={{
          name: user?.name && user.name !== "User" ? user.name : "",
          role: user?.userType ?? user?.role?.name ?? "Accountant",
        }}
      />
      <div className={`flex-1 flex flex-col min-h-0 min-w-0 transition-all duration-300 ${mainPadding}`}>
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 mt-20">
          <Outlet />
        </main>
      </div>
      <WhatsAppFAB />
    </div>
  );
};

export default AccountantLayout;