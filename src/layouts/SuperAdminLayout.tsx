
import { useEffect, useMemo, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaThLarge, FaSchool, FaCreditCard, FaCog, FaComment, FaTicketAlt, FaUsers, FaFileAlt, FaChartBar } from "react-icons/fa";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";

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
  { label: "Dashboard", to: "/superadmin/dashboard", icon: <FaThLarge /> },
  { label: "Schools", to: "/superadmin/schools", icon: <FaSchool /> },
  { label: "Billing & Plans", to: "/superadmin/billing", icon: <FaCreditCard /> },
  { label: "Platform Config", to: "/superadmin/config", icon: <FaCog /> },
  { label: "WhatsApp Templates", to: "/superadmin/whatsapp", icon: <FaComment /> },
  { label: "Support Tickets", to: "/superadmin/support", icon: <FaTicketAlt /> },
  { label: "Marketing Team", to: "/superadmin/marketing", icon: <FaUsers /> },
  { label: "Audit Logs", to: "/superadmin/audit", icon: <FaFileAlt /> },
  { label: "Reports", to: "/superadmin/reports", icon: <FaChartBar /> },
];

export const SuperAdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement | null>(null);

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

  return (
    <div className="min-h-screen w-full bg-[#F4F6FA]">
      <Sidebar items={NavItem} />
      <Topbar breadcrumbs={breadcrumbs} onBreadcrumb={(href) => navigate(href)} />
      
      <main 
        ref={mainRef} 
        className="overflow-y-auto bg-[#F4F6FA] pt-16 sm:pt-20 md:pt-20 md:ml-[280px]"
      >
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;
