import { lazy } from "react";
import type { ReactNode } from "react";

const TeacherMarks = lazy(() => import("@/features/teacher/marks/pages/MarksPage"));
const TeacherLeave = lazy(() => import("@/features/teacher/leave/pages/LeavePage"));
const TeacherHomework = lazy(() => import("@/features/teacher/homework/pages/HomeworkPage"));
const TeacherTimetable = lazy(() => import("@/features/teacher/timetable/pages/TimetablePage"));
const TeacherAttendance = lazy(() => import("@/features/teacher/attendance/pages/AttendancePage"));
const TeacherDashboard = lazy(() => import("@/features/teacher/dashboard/pages/DashboardPage"));
const AccountantFees = lazy(() => import("@/features/accountant/fees").then(m => ({ default: m.FeesPage })));
const AccountantDashboard = lazy(() => import("@/features/accountant/dashboard").then(m => ({ default: m.DashboardPage })));
const AccountantReports = lazy(() => import("@/features/accountant/reports/pages/ReportsPage"));
const AccountantSettings = lazy(() => import("@/features/accountant/settings/pages/SettingsPage"));
const AccountantReceipts = lazy(() => import("@/features/accountant/receipts/pages/ReceiptsPage"));
const AccountantPayroll = lazy(() => import("@/features/accountant/payroll/pages/PayrollPage"));
const SchoolAdminSettings = lazy(() => import("@/features/school-admin/settings").then(m => ({ default: m.SettingsPage })));
const SchoolAdminReports = lazy(() => import("@/features/school-admin/reports").then(m => ({ default: m.ReportsPage })));
const SchoolAdminTimetable = lazy(() => import("@/features/school-admin/timetable").then(m => ({ default: m.TimetablePage })));
const SchoolAdminStaff = lazy(() => import("@/features/school-admin/staff").then(m => ({ default: m.StaffPage })));


const SchoolAdminDashboard = lazy(() => import("@/features/school-admin/dashboard").then(m => ({ default: m.DashboardPage })));
const SchoolAdminAttendance = lazy(() => import("@/features/school-admin/attendance").then(m => ({ default: m.AttendancePage })));
const SchoolAdminFees = lazy(() => import("@/features/school-admin/fees").then(m => ({ default: m.FeesPage })));
const SchoolAdminStudents = lazy(() => import("@/features/school-admin/students").then(m => ({ default: m.StudentsPage })));
const SchoolAdminAdmissions = lazy(() => import("@/features/school-admin/admissions").then(m => ({ default: m.AdmissionsPage })));
import type { Role } from "../types/api.types";

export interface RouteConfig {
  path: string;
  element: ReactNode;
  roles?: Role[];
  children?: RouteConfig[];
}


export const ROUTES: RouteConfig[] = [
  {
    path: "/teacher/marks",
    element: <TeacherMarks />,
    roles: ["teacher"],
  },
  {
    path: "/teacher/leave",
    element: <TeacherLeave />,
    roles: ["teacher"],
  },
  {
    path: "/teacher/homework",
    element: <TeacherHomework />,
    roles: ["teacher"],
  },
  {
    path: "/teacher/timetable",
    element: <TeacherTimetable />,
    roles: ["teacher"],
  },
  {
    path: "/teacher/attendance",
    element: <TeacherAttendance />,
    roles: ["teacher"],
  },
  {
    path: "/teacher/dashboard",
    element: <TeacherDashboard />,
    roles: ["teacher"],
  },
  {
    path: "/accountant/dashboard",
    element: <AccountantDashboard />,
    roles: ["accountant"],
  },
  {
    path: "/accountant/fees",
    element: <AccountantFees />,
    roles: ["accountant"],
  },
  {
    path: "/accountant/reports",
    element: <AccountantReports />,
    roles: ["accountant"],
  },
  {
    path: "/accountant/settings",
    element: <AccountantSettings />,
    roles: ["accountant"],
  },
  {
    path: "/accountant/receipts",
    element: <AccountantReceipts />,
    roles: ["accountant"],
  },
  {
    path: "/accountant/payroll",
    element: <AccountantPayroll />,
    roles: ["accountant"],
  },
  {
    path: "/school-admin/dashboard",
    element: <SchoolAdminDashboard />,
    roles: ["school_admin"],
  },
  {
    path: "/school-admin/attendance",
    element: <SchoolAdminAttendance />,
    roles: ["school_admin"],
  },
  {
    path: "/school-admin/fees",
    element: <SchoolAdminFees />,
    roles: ["school_admin"],
  },
  {
    path: "/school-admin/students",
    element: <SchoolAdminStudents />,
    roles: ["school_admin"],
  },
  {
    path: "/school-admin/admissions",
    element: <SchoolAdminAdmissions />,
    roles: ["school_admin"],
  },
  {
    path: "/school-admin/staff",
    element: <SchoolAdminStaff />,
    roles: ["school_admin"],
  },
  {
    path: "/school-admin/timetable",
    element: <SchoolAdminTimetable />,
    roles: ["school_admin"],
  },
  {
    path: "/school-admin/reports",
    element: <SchoolAdminReports />,
    roles: ["school_admin"],
  },
  {
    path: "/school-admin/settings",
    element: <SchoolAdminSettings />,
    roles: ["school_admin"],
  },
];
