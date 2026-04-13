
import { Outlet } from "react-router-dom";
import { FaThLarge, FaUserFriends, FaUserCheck, FaUserTie, FaCalendarAlt, FaMoneyBill, FaBullhorn, FaCog } from "react-icons/fa";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";
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
const SchoolAdminLayout = () => (
  <div className="min-h-screen flex bg-[#F4F6FA]">
    <Sidebar items={NavItem}  />
    <div className="flex-1 flex flex-col">
      <Topbar />
      <main className="flex-1 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  </div>




);

export default SchoolAdminLayout;






