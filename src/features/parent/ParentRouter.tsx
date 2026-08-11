import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ParentLayout from "../../layouts/ParentLayout";

// Each route is its own lazy chunk — otherwise the very first page a parent
// sees (the dashboard) has to wait for every other page's code (fees,
// homework, exams, timetable, ...) to download too, since a static import
// bundles its module into the same chunk as whatever imports it.
const StudentSelectPage   = lazy(() => import("./studentSelect/pages/StudentSelectPage"));
const DashboardPage       = lazy(() => import("./dashboard/pages/ParentDashBoard"));
const AttendancePage      = lazy(() => import("./attendance/pages/AttendancePage"));
const FeesPage            = lazy(() => import("./fees/pages/FeePage"));
const HomeworkPage        = lazy(() => import("./homework/pages/HomeWorkPage"));
const ExamsPage           = lazy(() => import("./exams/pages/ExamPage"));
const ParentTimetablePage = lazy(() => import("./timetable/pages/ParentTimetablePage"));
const ProfilePage         = lazy(() => import("./profile/pages/ProfilePage"));
const SettingsPage        = lazy(() => import("./SettingsPage"));
const ComplaintsPage      = lazy(() => import("./complaints/pages/ComplaintsPage"));

const RouteLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
  </div>
);

export default function ParentRouter() {
  return (
    <Suspense fallback={<RouteLoader />}>
    <Routes>
      {/* Full-screen — no ParentLayout nav bar */}
      <Route path="select-student" element={<StudentSelectPage />} />

      <Route element={<ParentLayout />}>
        
        {/* Default redirect */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Pages */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="fees" element={<FeesPage />} />
        <Route path="homework" element={<HomeworkPage />} />
        <Route path="exams" element={<ExamsPage />} />
        <Route path="timetable" element={<ParentTimetablePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="complaints" element={<ComplaintsPage />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
        
      </Route>
    </Routes>
    </Suspense>
  );
}