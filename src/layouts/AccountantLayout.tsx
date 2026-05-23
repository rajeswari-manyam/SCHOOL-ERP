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


const NavItem = [
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
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const collapsed = useUIStore((s) => s.collapsed);

  // Responsive left padding for main content
  let mainPadding = "md:pl-72";
  if (!sidebarOpen) mainPadding = "md:pl-0";
  else if (collapsed) mainPadding = "md:pl-16";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F6FA]">
      <Sidebar items={NavItem} />
      <div className={`flex-1 flex flex-col min-h-0 transition-all duration-300 ${mainPadding}`}>
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 mt-20">
          <Outlet />
        </main>
      </div>
      <WhatsAppFAB />
    </div>
  );
};

export default AccountantLayout;