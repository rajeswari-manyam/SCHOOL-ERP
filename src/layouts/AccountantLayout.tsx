import type{ ReactNode } from "react";


import { Outlet } from "react-router-dom";
import Topbar from "@/components/common/Topbar";
import Sidebar from "@/components/common/Sidebar";
import { FaThLarge, FaUserFriends, FaUserCheck, FaUserTie, FaCalendarAlt, FaMoneyBill, FaBullhorn, FaCog } from "react-icons/fa";
const NavItem = [ 
  { label: "Dashboard", to: "/accountant/dashboard", icon: <FaThLarge /> },
  { label: "Fee Management", to: "/accountant/fees", icon: <FaMoneyBill /> },
  { label: "Expense Tracking", to: "/accountant/expenses", icon: <FaBullhorn /> },
  { label: "Financial Reports", to: "/accountant/reports", icon: <FaCog /> },
  { label: "Settings", to: "/accountant/settings", icon: <FaCog /> },
];

export const AccountantLayout = () => (
   <div className="min-h-screen flex bg-[#F4F6FA]">
    <Sidebar items={NavItem} />
    <div className="flex-1 flex flex-col">
      <Topbar />
      <main className="flex-1 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AccountantLayout;
