import { useEffect, useMemo, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaThLarge,
  FaUserFriends,
  FaUserCheck,
  FaUserTie,
  FaCalendarAlt,
  FaMoneyBill,
  FaBullhorn,
  FaCog,
  FaBook
} from "react-icons/fa";

import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { getUserById } from "@/services/auth.api";
import { fetchSchoolProfile } from "@/services/school-settings.api";

// ✅ Breadcrumb labels
const BreadcrumbLabels: Record<string, string> = {
  "/schooladmin/dashboard": "Dashboard",
  "/schooladmin/admissions": "Admissions",
  "/schooladmin/attendance": "Attendance",
  "/schooladmin/students": "Students",
  "/schooladmin/staff": "Staff",
  "/schooladmin/classes": "Classes",
  "/schooladmin/timetable": "Timetable",
  "/schooladmin/fees": "Fee Collection",
  "/schooladmin/reports": "Reports",
  "/schooladmin/settings": "Settings",
};

const NavItem = [
  { label: "Dashboard", to: "/schooladmin/dashboard", icon: <FaThLarge /> },
  { label: "Admissions", to: "/schooladmin/admissions", icon: <FaUserFriends /> },
  { label: "Attendance", to: "/schooladmin/attendance", icon: <FaUserCheck /> },
  { label: "Students", to: "/schooladmin/students", icon: <FaUserFriends /> },
  { label: "Staff", to: "/schooladmin/staff", icon: <FaUserTie /> },
  { label: "Classes", to: "/schooladmin/classes", icon: <FaBook /> },
  { label: "Timetable", to: "/schooladmin/timetable", icon: <FaCalendarAlt /> },
  { label: "Fee Collection", to: "/schooladmin/fees", icon: <FaMoneyBill /> },
  { label: "Reports", to: "/schooladmin/reports", icon: <FaBullhorn /> },
  { label: "Settings", to: "/schooladmin/settings", icon: <FaCog /> },
];


const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const SchoolAdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement | null>(null);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const collapsed   = useUIStore((s) => s.collapsed);
  const pageTitle   = useUIStore((s) => s.pageTitle);

  const user              = useAuthStore((s) => s.user);
  const setUserProfile    = useAuthStore((s) => s.setUserProfile);
  const setPrincipalName  = useAuthStore((s) => s.setPrincipalName);

  // Fetch full profile on first load if name was never populated
  useEffect(() => {
    const userId = user?.id ?? localStorage.getItem("userId");
    if (!userId) return;
    if (user?.name && user.name !== "User") return;
    getUserById(userId)
      .then(profile => { if (profile?.status) setUserProfile(profile); })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch school details to get principal name
  useEffect(() => {
    if (user?.principalName) return;
    fetchSchoolProfile()
      .then(profile => { if (profile.principalName) setPrincipalName(profile.principalName); })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const breadcrumbs = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean).slice(1);
    const isKnown = BreadcrumbLabels[location.pathname];

    if (isKnown) {
      return [{ label: isKnown }];
    }

    const parts = segments.map((seg) =>
      UUID_RE.test(seg) ? (pageTitle ?? "Profile") : (seg.replace(/[-_]/g, " ").replace(/^\w/, (c) => c.toUpperCase()))
    );

    const label = parts.join(" / ") || "Dashboard";
    return [{ label }];
  }, [location.pathname, pageTitle]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  // Responsive left padding for main content (matches SIDEBAR_EXPANDED_W = 260px)
  let mainPadding = "md:pl-[260px]";
  if (!sidebarOpen) mainPadding = "md:pl-0";
  else if (collapsed) mainPadding = "md:pl-16";

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#F4F6FA]">
      <Sidebar
        items={NavItem}
        user={{
          name: user?.principalName?.trim() || (user?.name && user.name !== "User" ? user.name : ""),
          role: (() => {
            const ut = user?.userType ?? "";
            if (ut === "Admin" || ut === "SchoolAdmin") return "Principal";
            if (ut === "Teacher")    return "Teacher";
            if (ut === "Accountant") return "Accountant";
            if (ut === "Parent")     return "Parent";
            if (ut === "Student")    return "Student";
            return user?.role?.name ?? "Administrator";
          })(),
        }}
      />
      <div className={`flex-1 flex flex-col min-h-0 transition-all duration-300 ${mainPadding}`}>
        <Topbar breadcrumbs={breadcrumbs} onBreadcrumb={(href) => navigate(href)} />
        <main ref={mainRef} className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 pt-3 md:pt-4 pb-8 mt-12 sm:mt-14">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SchoolAdminLayout;
