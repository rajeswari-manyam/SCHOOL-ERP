
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

export default TeacherLayout;
