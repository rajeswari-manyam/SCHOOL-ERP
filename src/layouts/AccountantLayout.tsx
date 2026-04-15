


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

/* ---------------------------------- */
/* Sidebar Navigation (Accountant Only) */
/* ---------------------------------- */
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

/* ---------------------------------- */
/* Layout */
/* ---------------------------------- */
export const AccountantLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F6FA]">
      
      {/* Sidebar */}
      <Sidebar items={NavItem} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 md:pl-72">
        
        {/* Topbar (UNCHANGED) */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AccountantLayout;