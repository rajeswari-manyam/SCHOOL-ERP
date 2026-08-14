
import { Suspense, useEffect } from "react";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";
import { RouteErrorBoundary } from "../components/common/RouteErrorBoundary";
import { Outlet } from "react-router-dom";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { getUserById } from "@/services/auth.api";
import { FaThLarge, FaUserCheck, FaUserFriends, FaClipboard, FaCalendarAlt, FaCalendarTimes, FaCalendarCheck, FaGraduationCap, FaSignOutAlt, FaMoneyBill, FaBullhorn } from "react-icons/fa";
import { SkeletonStatGrid, SkeletonChartCard, SkeletonTableCard } from "@/components/common/skeletons";

// Shown in the content area while a route's code chunk downloads — the
// sidebar/topbar stay mounted so navigation doesn't flash a blank page. Can't
// know which specific page is about to render, so it approximates the common
// shape (stat row + two content blocks) rather than a blank/spinner screen.
const PageContentLoader = () => (
  <div className="flex flex-col gap-5" aria-busy="true" aria-label="Loading page">
    <SkeletonStatGrid count={4} cols={4} />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2">
        <SkeletonTableCard rows={4} />
      </div>
      <SkeletonChartCard height="h-56" />
    </div>
  </div>
);

const NavItem = [
  { label: "Dashboard", to: "/teacher/dashboard", icon: <FaThLarge /> },
  { label: "My Attendance", to: "/teacher/attendance", icon: <FaUserCheck /> },
  { label: "Holidays", to: "/teacher/holidays", icon: <FaCalendarTimes /> },
  { label: "My Students", to: "/teacher/students", icon: <FaUserFriends /> },
  { label: "Homework", to: "/teacher/homework", icon: <FaClipboard /> },
  { label: "Time Table", to: "/teacher/timetable", icon: <FaCalendarAlt /> },
  { label: "Exam Timetable", to: "/teacher/timetable/exams", icon: <FaCalendarCheck /> },
  { label: "Exam & Marks", to: "/teacher/exams", icon: <FaGraduationCap /> },
  { label: "Leave", to: "/teacher/leave", icon: <FaSignOutAlt /> },
  { label: "Payslip", to: "/teacher/payslip", icon: <FaMoneyBill /> },
  { label: "Announcements", to: "/teacher/announcements", icon: <FaBullhorn /> },
];



export const TeacherLayout = () => {
  const sidebarOpen    = useUIStore((s) => s.sidebarOpen);
  const collapsed      = useUIStore((s) => s.collapsed);
  const user           = useAuthStore((s) => s.user);
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
          avatar: user?.image ?? undefined,
        }}
        profilePath="/teacher/profile"
      />
      <div className={`flex-1 flex flex-col min-h-0 transition-all duration-300 ${mainPadding}`}>
        <Topbar />
        <main className="flex-1 overflow-y-auto px-4 pt-2 pb-4 md:px-6 md:pt-2 md:pb-6 lg:px-8 lg:pt-2 lg:pb-8 mt-12 sm:mt-14">
          <RouteErrorBoundary>
            <Suspense fallback={<PageContentLoader />}>
              <Outlet />
            </Suspense>
          </RouteErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
