
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";
import { Outlet } from "react-router-dom";
import { useUIStore } from "@/store/uiStore";
import { FaThLarge, FaUserCheck, FaUserFriends, FaClipboard, FaCalendarAlt, FaGraduationCap, FaSignOutAlt, FaMoneyBill } from "react-icons/fa";

const NavItem = [
  { label: "Dashboard", to: "/teacher/dashboard", icon: <FaThLarge /> },
  { label: "My Attendance", to: "/teacher/attendance", icon: <FaUserCheck /> },
  { label: "My Students", to: "/teacher/students", icon: <FaUserFriends /> },
  { label: "Homework", to: "/teacher/homework", icon: <FaClipboard /> },
  { label: "Time Table", to: "/teacher/timetable", icon: <FaCalendarAlt /> },
  { label: "Exam & Marks", to: "/teacher/exams", icon: <FaGraduationCap /> },
  { label: "Leave", to: "/teacher/leave", icon: <FaSignOutAlt /> },
  { label: "Payslip", to: "/teacher/payslip", icon: <FaMoneyBill /> },
];



export const TeacherLayout = () => {
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
    </div>
  );
};

export default TeacherLayout;
