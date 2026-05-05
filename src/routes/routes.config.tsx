import { lazy } from "react";
import type { ReactNode } from "react";

const TeacherMarks = lazy(() => import("../features/teacher/TeacherRouter"));
const TeacherLeave = lazy(() => import("../features/teacher/leave/LeavePage"));
const TeacherHomework = lazy(() => import("../features/teacher/homework/HomeworkPage"));
const TeacherTimetable = lazy(() => import("../features/teacher/timetable/TimetablePage"));
const TeacherAttendance = lazy(() => import("../features/teacher/attendance/Myattendancepage"));
const TeacherDashboard = lazy(() => import("../features/teacher/dashboard/TeacherDashboardPage"));
const AccountantFees = lazy(() => import("../features/accountant/fees/pages/FeeManagementPage"));
const AccountantDashboard = lazy(() => import("../features/accountant/dashboard/pages/DashboardPage"));
const AccountantReports = lazy(() => import("../features/accountant/reports/pages/ReportsPage"));
const AccountantSettings = lazy(() => import("../features/accountant/settings/pages/SettingsPage"));
const AccountantReceipts = lazy(() => import("../features/accountant/receipts/pages/ReceiptsPage"));
const AccountantPayroll = lazy(() => import("../features/accountant/payroll/pages/PayrollPage"));
const SchoolAdminSettings = lazy(() => import("../features/school-admin/settings").then(m => ({ default: m.SettingsPage })));
const SchoolAdminReports = lazy(() => import("../features/school-admin/reports").then(m => ({ default: m.ReportsPage })));
const SchoolAdminTimetable = lazy(() => import("../features/school-admin/timetable"));
const SchoolAdminStaff = lazy(() => import("../features/school-admin/staff/pages/StaffPage"));


const SchoolAdminDashboard = lazy(() => import("../features/school-admin/dashboard").then(m => ({ default: m.DashboardPage })));
const SchoolAdminAttendance = lazy(() => import("../features/school-admin/attendance").then(m => ({ default: m.AttendancePage })));
const SchoolAdminFees = lazy(() => import("../features/school-admin/fees").then(m => ({ default: m.FeesPage })));
const SchoolAdminStudents = lazy(() => import("../features/school-admin/students").then(m => ({ default: m.StudentsPage })));
const SchoolAdminAdmissions = lazy(() => import("../features/school-admin/admissions").then(m => ({ default: m.AdmissionsPage })));
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
    roles: ["schooladmin"],
  },
  {
    path: "/school-admin/attendance",
    element: <SchoolAdminAttendance />,
    roles: ["schooladmin"],
  },
  {
    path: "/school-admin/fees",
    element: <SchoolAdminFees />,
    roles: ["schooladmin"],
  },
  {
    path: "/school-admin/students",
    element: <SchoolAdminStudents />,
    roles: ["schooladmin"],
  },
  {
    path: "/school-admin/admissions",
    element: <SchoolAdminAdmissions />,
    roles: ["schooladmin"],
  },
  {
    path: "/school-admin/staff",
    element: <SchoolAdminStaff />,
    roles: ["schooladmin"],
  },
  {
    path: "/school-admin/timetable",
    element: <SchoolAdminTimetable />,
    roles: ["schooladmin"],
  },
  {
    path: "/school-admin/reports",
    element: <SchoolAdminReports />,
    roles: ["schooladmin"],
  },
  {
    path: "/school-admin/settings",
    element: <SchoolAdminSettings />,
    roles: ["schooladmin"],
  },
];
