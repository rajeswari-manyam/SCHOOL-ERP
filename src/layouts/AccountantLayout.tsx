import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  FaThLarge,
  FaMoneyBill,
  FaFileAlt,
  FaUsers,
  FaBook,
  FaCalendarCheck,
  FaSignOutAlt,
} from "react-icons/fa";

import Sidebar from "@/components/common/Sidebar";
import Topbar from "@/components/common/Topbar";
import { RouteErrorBoundary } from "@/components/common/RouteErrorBoundary";
import WhatsAppFAB from "@/components/ui/whatsappfab";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { getUserById } from "@/services/auth.api";

// Thin fallback while a route's own chunk downloads — Sidebar/Topbar render
// outside this boundary (see below) so they never unmount/flash during
// navigation; once a page's chunk is cached (see usePrefetchOtherPages in
// AccountantRouter) this never shows at all — the content just swaps.
const PageContentLoader = () => (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
  </div>
);

const NavItem = [
  { label: "Dashboard", to: "/accountant/dashboard", icon: <FaThLarge /> },
  { label: "Fee Management", to: "/accountant/fees", icon: <FaMoneyBill /> },
  { label: "Receipts & Invoices", to: "/accountant/receipts", icon: <FaFileAlt /> },
  { label: "Payroll", to: "/accountant/payroll", icon: <FaUsers /> },
  { label: "Attendance", to: "/accountant/attendance", icon: <FaCalendarCheck /> },
  { label: "Leave", to: "/accountant/leave", icon: <FaSignOutAlt /> },
  { label: "Ledger", to: "/accountant/ledger", icon: <FaBook /> },
];

export const AccountantLayout = () => {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const collapsed = useUIStore((s) => s.collapsed);
  const user = useAuthStore((s) => s.user);
  const setUserProfile = useAuthStore((s) => s.setUserProfile);

  // Always refresh the full profile once per page load — name and avatar
  // can change over time, so there's no reliable persisted signal for
  // "already up to date". The empty dep array keeps this to once.
  useEffect(() => {
    const userId = user?.id ?? localStorage.getItem("userId");
    if (!userId) return;
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
          avatar: user?.image ?? undefined,
        }}
      />
      <div className={`flex-1 flex flex-col min-h-0 min-w-0 transition-all duration-300 ${mainPadding}`}>
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 mt-12 sm:mt-14">
          <RouteErrorBoundary>
            <Suspense fallback={<PageContentLoader />}>
              <Outlet />
            </Suspense>
          </RouteErrorBoundary>
        </main>
      </div>
      <WhatsAppFAB />
    </div>
  );
};

export default AccountantLayout;