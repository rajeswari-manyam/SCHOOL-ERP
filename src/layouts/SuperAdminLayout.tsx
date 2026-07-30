
import { useEffect, useMemo, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaThLarge, FaSchool, FaCreditCard, FaCog, FaComment, FaTicketAlt, FaUsers, FaFileAlt, FaChartBar } from "react-icons/fa";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";

const BreadcrumbLabels: Record<string, string> = {
  "/superadmin/dashboard": "Dashboard",
  "/superadmin/schools": "Schools",
  "/superadmin/billing": "Billing & Plans",
  "/superadmin/config": "Platform Config",
  "/superadmin/whatsapp": "WhatsApp Templates",
  "/superadmin/support": "Support Tickets",
  "/superadmin/marketing": "Marketing Team",
  "/superadmin/audit": "Audit Logs",
  "/superadmin/reports": "Reports",
};

const NavItem = [
  { label: "Dashboard", to: "/superadmin/dashboard", icon: <FaThLarge />, group: "Overview" },
  { label: "Schools", to: "/superadmin/schools", icon: <FaSchool />, group: "Management" },
  { label: "Billing & Plans", to: "/superadmin/billing", icon: <FaCreditCard />, group: "Management" },
  { label: "Platform Config", to: "/superadmin/config", icon: <FaCog />, group: "Management" },
  { label: "WhatsApp Templates", to: "/superadmin/whatsapp", icon: <FaComment />, group: "Management" },
  { label: "Support Tickets", to: "/superadmin/support", icon: <FaTicketAlt />, group: "Operations" },
  { label: "Marketing Team", to: "/superadmin/marketing", icon: <FaUsers />, group: "Operations" },
  { label: "Reports", to: "/superadmin/reports", icon: <FaChartBar />, group: "Operations" },
  { label: "Audit Logs", to: "/superadmin/audit", icon: <FaFileAlt />, group: "Operations" },
];

export const SuperAdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement | null>(null);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const collapsed = useUIStore((s) => s.collapsed);
  const user = useAuthStore((s) => s.user);

  const breadcrumbs = useMemo(() => {
    const current = BreadcrumbLabels[location.pathname] ?? (
      location.pathname
        .split("/")
        .filter(Boolean)
        .slice(1)
        .map((segment) => segment.replace(/[-_]/g, " "))
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" / ") || "Dashboard"
    );

    if (location.pathname === "/superadmin/dashboard" || location.pathname === "/superadmin") {
      return [{ label: current }];
    }

    return [
      // { label: "Dashboard", href: "/superadmin/dashboard" },
      { label: current },
    ];
  }, [location.pathname]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  // Responsive left margin for main content and topbar
  let mainMargin = "md:ml-[280px]";
  if (!sidebarOpen) mainMargin = "md:ml-0";
  else if (collapsed) mainMargin = "md:ml-16";

  return (
    <div className="min-h-screen w-full bg-[#F4F6FA]">
      <Sidebar
        items={NavItem}
        user={{
          name: user?.name && user.name !== "User" ? user.name : "",
          role: user?.userType ?? user?.role?.name ?? "Super Admin",
          avatar: user?.image ?? undefined,
        }}
      />
      <Topbar breadcrumbs={breadcrumbs} onBreadcrumb={(href) => navigate(href)} />
      <main
        ref={mainRef}
        className={`overflow-y-auto bg-[#F4F6FA] pt-12 sm:pt-14 md:pt-14 transition-all duration-300 ${mainMargin}`}
      >
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 pt-3 sm:pt-3 md:pt-4 pb-3 sm:pb-4 md:pb-6 lg:pb-8 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;
