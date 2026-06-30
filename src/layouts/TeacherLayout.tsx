
import { useEffect } from "react";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";
import { Outlet } from "react-router-dom";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { getUserById } from "@/services/auth.api";
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
  const sidebarOpen    = useUIStore((s) => s.sidebarOpen);
  const collapsed      = useUIStore((s) => s.collapsed);
  const user           = useAuthStore((s) => s.user);
  const setUserProfile = useAuthStore((s) => s.setUserProfile);

  // Fetch full profile on first load if name was never populated
  useEffect(() => {
    const userId = user?.id ?? localStorage.getItem("userId");
    if (!userId) return;
    if (user?.name && user.name !== "User") return;
    getUserById(userId)
      .then(profile => { if (profile?.status) setUserProfile(profile); })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Responsive left padding for main content (matches SIDEBAR_EXPANDED_W = 260px)
  let mainPadding = "md:pl-[260px]";
  if (!sidebarOpen) mainPadding = "md:pl-0";
  else if (collapsed) mainPadding = "md:pl-16";

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#F4F6FA]">
      <Sidebar
        items={NavItem}
        user={{
          name: user?.name && user.name !== "User" ? user.name : "",
          role: user?.userType ?? user?.role?.name ?? "Teacher",
        }}
      />
      <div className={`flex-1 flex flex-col min-h-0 transition-all duration-300 ${mainPadding}`}>
        <Topbar />
        <main className="flex-1 overflow-y-auto px-4 pt-2 pb-4 md:px-6 md:pt-2 md:pb-6 lg:px-8 lg:pt-2 lg:pb-8 mt-12 sm:mt-14">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
