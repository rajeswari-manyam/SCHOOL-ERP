import { Suspense, useEffect, useMemo, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaThLarge,
  FaUserFriends,
  FaUserCheck,
  FaUserTie,
  FaCalendarAlt,
  FaUmbrellaBeach,
  FaGraduationCap,
  FaUserClock,
  FaMoneyBill,
  FaBullhorn,
  FaCog,
  FaBook,
  FaClipboardList,
  FaTicketAlt,
  FaChartBar,
  FaCreditCard,
} from "react-icons/fa";

import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";
import { RouteErrorBoundary } from "../components/common/RouteErrorBoundary";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { getUserById } from "@/services/auth.api";
import { SkeletonStatGrid, SkeletonChartCard, SkeletonTableCard } from "@/components/common/skeletons";
// NOTE: intentionally NOT importing from "@/services/settings.api" — that
// file's fetchSchoolProfile() hits /organization/getschooldetails/:id, an
// org/super-admin-scoped endpoint. A school-admin's tenant token gets
// rejected by it (401), and since that call wasn't marked
// _skipLogoutOn401, the axios interceptor force-logged the user out on
// every page refresh. This is the tenant-scoped implementation
// (/tenant/school-profile) meant for this portal.
import { fetchSchoolProfile } from "@/features/school-admin/settings/api/settings.api";
import { useSetupStatus } from "@/features/school-admin/dashboard/hooks/useSetupStatus";

// ✅ Breadcrumb labels
const BreadcrumbLabels: Record<string, string> = {
  "/schooladmin/dashboard": "Dashboard",
  "/schooladmin/admissions": "Admissions",
  "/schooladmin/attendance": "Attendance",
  "/schooladmin/holidays": "Holidays",
  "/schooladmin/students": "Students",
  "/schooladmin/staff": "Staff",
  "/schooladmin/staff/leaves": "Leaves",
  "/schooladmin/classes": "Classes",
  "/schooladmin/timetable": "Timetable",
  "/schooladmin/timetable/exams": "Exam Timetable",
  "/schooladmin/fees": "Fee Collection",
  "/schooladmin/reports": "Reports",
  "/schooladmin/results": "Results",
  "/schooladmin/settings": "Settings",
  "/schooladmin/settings/billing": "Plan & Billing",
  "/schooladmin/profile": "My Profile",
  "/schooladmin/support": "Support Ticket",
  "/schooladmin/support/new": "Raise Ticket",
  "/schooladmin/announcements": "Announcements",
  "/schooladmin/announcements/new": "New Announcement",
};

const NavItem = [
  { label: "Dashboard",      to: "/schooladmin/dashboard",  icon: <FaThLarge />,      group: "Main" },
  { label: "Attendance",     to: "/schooladmin/attendance", icon: <FaUserCheck />,    group: "Academics" },
  { label: "Holidays",       to: "/schooladmin/holidays",   icon: <FaUmbrellaBeach />, group: "Academics" },
  { label: "Students",       to: "/schooladmin/students",   icon: <FaUserFriends />,  group: "Academics" },
  { label: "Staff",          to: "/schooladmin/staff",      icon: <FaUserTie />,      group: "Academics" },
  { label: "Leaves",         to: "/schooladmin/staff/leaves", icon: <FaUserClock />,  group: "Academics" },
  { label: "Classes",        to: "/schooladmin/classes",    icon: <FaBook />,         group: "Academics" },
  { label: "Timetable",      to: "/schooladmin/timetable",  icon: <FaCalendarAlt />,  group: "Academics" },
  { label: "Exam Timetable", to: "/schooladmin/timetable/exams", icon: <FaGraduationCap />, group: "Academics" },
  { label: "Results",        to: "/schooladmin/results",    icon: <FaClipboardList />, group: "Academics" },
  { label: "Fee Collection", to: "/schooladmin/fees",       icon: <FaMoneyBill />,    group: "Finance" },
  { label: "Admissions",     to: "/schooladmin/admissions", icon: <FaUserFriends />,  group: "Communication" },
  { label: "Announcements",  to: "/schooladmin/announcements", icon: <FaBullhorn />,  group: "Communication" },
  { label: "Support Ticket", to: "/schooladmin/support",    icon: <FaTicketAlt />,    group: "Communication" },
  { label: "Reports",        to: "/schooladmin/reports",    icon: <FaChartBar />,     group: "Reports & Settings" },
  { label: "Plan & Billing", to: "/schooladmin/settings/billing", icon: <FaCreditCard />, group: "Reports & Settings" },
  { label: "Settings",       to: "/schooladmin/settings",   icon: <FaCog />,          group: "Reports & Settings" },
];


const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

export const SchoolAdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement | null>(null);
  const sidebarOpen      = useUIStore((s) => s.sidebarOpen);
  const collapsed        = useUIStore((s) => s.collapsed);
  const pageTitle        = useUIStore((s) => s.pageTitle);
  const wizardDismissed  = useUIStore((s) => s.wizardDismissed);

  const user              = useAuthStore((s) => s.user);
  const setUserProfile    = useAuthStore((s) => s.setUserProfile);
  const setPrincipalName  = useAuthStore((s) => s.setPrincipalName);

  const { data: setupData } = useSetupStatus();

  // Use the sidebar access map from the API to lock/unlock nav items.
  // If wizard is dismissed or all steps complete → no locking.
  const navItemsWithLock = useMemo(() => {
    const sidebar = setupData?.sidebar;
    const allDone = setupData?.items ? setupData.items.every(s => s.done) : true;

    if (allDone || wizardDismissed || !sidebar) {
      return NavItem;
    }

    const SIDEBAR_MAP: Record<string, keyof typeof sidebar> = {
      '/schooladmin/dashboard':  'dashboard',
      '/schooladmin/settings':   'settings',
      '/schooladmin/staff':      'staff',
      '/schooladmin/classes':    'classes',
      '/schooladmin/admissions': 'admissions',
      '/schooladmin/students':   'students',
      '/schooladmin/attendance': 'attendance',
      '/schooladmin/fees':       'feeCollection',
      '/schooladmin/timetable':  'timetable',
      '/schooladmin/reports':    'reports',
    };

    return NavItem.map(item => {
      const key = SIDEBAR_MAP[item.to];
      const allowed = key ? (sidebar[key] ?? true) : true;
      return { ...item, locked: !allowed };
    });
  }, [setupData, wizardDismissed]);

  // Always refresh the full profile once per page load — name, avatar, and
  // school image/logo can change over time, so there's no reliable persisted
  // signal for "already up to date". The empty dep array keeps this to once.
  useEffect(() => {
    const userId = user?.id ?? localStorage.getItem("userId");
    if (!userId) return;
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
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#EFF4FF]">
      <Sidebar
        items={navItemsWithLock}
        user={{
          name: user?.principalName?.trim() || (user?.name && user.name !== "User" ? user.name : ""),
          avatar: user?.image ?? undefined,
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
        profilePath="/schooladmin/profile"
      />
      <div className={`flex-1 flex flex-col min-h-0 min-w-0 transition-all duration-300 ${mainPadding}`}>
        <Topbar breadcrumbs={breadcrumbs} onBreadcrumb={(href) => navigate(href)} />
        <main ref={mainRef} className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto px-4 md:px-6 lg:px-8 pt-3 md:pt-4 pb-8 mt-12 sm:mt-14">
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

export default SchoolAdminLayout;