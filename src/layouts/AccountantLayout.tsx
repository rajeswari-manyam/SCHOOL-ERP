import { Outlet } from "react-router-dom";
import { useUIStore } from "@/store/uiStore";
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

const NavItems = [
  {
    label: "Dashboard",
    to: "/accountant/dashboard",
    icon: <FaThLarge />,
  },
  {
    label: "Fee Management",
    to: "/accountant/fees",
    icon: <FaMoneyBill />,
  },
  {
    label: "Receipts & Invoices",
    to: "/accountant/receipts",
    icon: <FaFileAlt />,
  },
  {
    label: "Payroll",
    to: "/accountant/payroll",
    icon: <FaUsers />,
  },
  {
    label: "Ledger",
    to: "/accountant/ledger",
    icon: <FaBook />,
  },
  {
    label: "Reports",
    to: "/accountant/reports",
    icon: <FaChartBar />,
  },
];

export const AccountantLayout = () => {
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

  return (
    <div className="min-h-screen flex bg-[#F4F6FA] overflow-hidden">

      {/* Single Sidebar — manages its own mobile open/close via uiStore */}
      <Sidebar items={NavItems} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-72 w-full">

        {/* Topbar — hamburger opens sidebar via uiStore */}
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 md:px-6 lg:px-8 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* WhatsApp FAB */}
      <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
        <WhatsAppFAB />
      </div>
    </div>
  );
};

export default AccountantLayout;