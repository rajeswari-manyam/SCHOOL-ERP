
import  Sidebar  from "../components/common/Sidebar";
import Topbar  from "../components/common/Topbar";
import { Outlet } from "react-router-dom";
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


export const TeacherLayout = () => (
<div className="min-h-screen flex flex-col md:flex-row bg-[#F4F6FA]">
    <Sidebar items={NavItem} />
   <div className="flex-1 flex flex-col min-h-0 md:pl-72 ">
      <Topbar />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  </div>
);

export default TeacherLayout;
