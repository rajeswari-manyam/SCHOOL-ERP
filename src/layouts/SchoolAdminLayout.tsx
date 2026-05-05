 
// import { Outlet } from "react-router-dom";
// import { FaThLarge, FaUserFriends, FaUserCheck, FaUserTie, FaCalendarAlt, FaMoneyBill, FaBullhorn, FaCog } from "react-icons/fa";
// import Sidebar from "../components/common/Sidebar";
// import Topbar from "../components/common/Topbar";
// const NavItem = [
//   { label: "Dashboard", to: "/schooladmin/dashboard", icon: <FaThLarge /> },
//   { label: "Admissions", to: "/schooladmin/admissions", icon: <FaUserFriends /> },
//   { label: "Attendance", to: "/schooladmin/attendance", icon: <FaUserCheck /> },
//   { label: "Students", to: "/schooladmin/students", icon: <FaUserFriends /> },
//   { label: "Staff", to: "/schooladmin/staff", icon: <FaUserTie /> },
//   { label: "Timetable", to: "/schooladmin/timetable", icon: <FaCalendarAlt /> },
//   { label: "Fee Collection", to: "/schooladmin/fees", icon: <FaMoneyBill /> },
//   { label: "Reports", to: "/schooladmin/reports", icon: <FaBullhorn /> },
//   { label: "Settings", to: "/schooladmin/settings", icon: <FaCog /> },
// ];
// const SchoolAdminLayout = () => (
//   <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F6FA]">
//     <Sidebar items={NavItem}  />
    
//       <div className="flex-1 flex flex-col min-h-0 md:pl-72 ">
//       <Topbar />
//      <main  className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
//         <Outlet />
//       </main>
//     </div>
//   </div>
 
 
 
 
// );
 
// export default SchoolAdminLayout;
 
 
 
 
 
 
 
 


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
  FaCog
} from "react-icons/fa";

import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";

// ✅ Breadcrumb labels
const BreadcrumbLabels: Record<string, string> = {
  "/schooladmin/dashboard": "Dashboard",
  "/schooladmin/admissions": "Admissions",
  "/schooladmin/attendance": "Attendance",
  "/schooladmin/students": "Students",
  "/schooladmin/staff": "Staff",
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
  { label: "Timetable", to: "/schooladmin/timetable", icon: <FaCalendarAlt /> },
  { label: "Fee Collection", to: "/schooladmin/fees", icon: <FaMoneyBill /> },
  { label: "Reports", to: "/schooladmin/reports", icon: <FaBullhorn /> },
  { label: "Settings", to: "/schooladmin/settings", icon: <FaCog /> },
];


export const SchoolAdminLayout = () => {
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

    if (location.pathname === "/schooladmin/dashboard" || location.pathname === "/schooladmin") {
      return [{ label: current }];
    }

    return [
      { label: "Dashboard", href: "/schooladmin/dashboard" },
      { label: current },
    ];
  }, [location.pathname]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F6FA]">
      <Sidebar items={NavItem} />
      
      <div className="flex-1 flex flex-col min-h-0 md:pl-72 ">
        <Topbar breadcrumbs={breadcrumbs} onBreadcrumb={(href) => navigate(href)} />
        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SchoolAdminLayout;
