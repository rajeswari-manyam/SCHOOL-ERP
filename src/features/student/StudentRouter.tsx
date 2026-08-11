import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";

// Each route is its own lazy chunk — otherwise the very first page a student
// sees (the dashboard) has to wait for every other page's code (homework,
// exams, timetable, profile, ...) to download too, since a static import
// bundles its module into the same chunk as whatever imports it.
const Dashboard      = lazy(() => import("./dashboard/pages/DashboardPage").then(m => ({ default: m.Dashboard })));
const AttendancePage = lazy(() => import("./attendance/pages/AttendancePage"));
const HomeworkPage   = lazy(() => import("./homework/pages/HomeWorkPage").then(m => ({ default: m.HomeworkPage })));
const ExamsPage      = lazy(() => import("./exams/pages/ExamPage").then(m => ({ default: m.ExamsPage })));
const ClassTimetable = lazy(() => import("./timetable/pages/ClassTimetablePage"));
const ProfilePage    = lazy(() => import("./profile/pages/ProfilePage"));

const RouteLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
  </div>
);

export default function StudentRouter() {
  return (
    <Suspense fallback={<RouteLoader />}>
    <Routes>
      <Route element={<StudentLayout />}>
        
        {/* Default Redirect */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Main Pages */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="homework" element={<HomeworkPage />} />
        <Route path="exams" element={<ExamsPage />} />
        <Route path="timetable" element={<ClassTimetable />} />
        <Route path="profile" element={<ProfilePage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
        
      </Route>
    </Routes>
    </Suspense>
  );
}