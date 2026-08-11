import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { TeacherLayout } from "@/layouts/TeacherLayout";

// Each route is its own lazy chunk — otherwise the very first page a teacher
// sees (the dashboard) has to wait for every other page's code (students,
// homework, timetable, exams, payslip, ...) to download too, since a static
// import bundles its module into the same chunk as whatever imports it.
const DashboardPage      = lazy(() => import("./dashboard/TeacherDashboardPage"));
const MyAttendancePage   = lazy(() => import("./attendance/Myattendancepage"));
const HolidaysPage       = lazy(() => import("./attendance/HolidaysPage"));
const MyStudentsPage     = lazy(() => import("./students/MyStudentsPage"));
const HomeworkPage       = lazy(() => import("./homework/HomeworkPage"));
const TimetablePage      = lazy(() => import("./timetable/TimetablePage"));
const ExamTimetablePage  = lazy(() => import("./timetable/ExamTimetablePage"));
const LeavePage          = lazy(() => import("./leave/LeavePage"));
const ApplyLeavePage     = lazy(() => import("./leave/ApplyLeavePage"));
const ExamsPage          = lazy(() => import("./exam/ExamMarksPage"));
const PayslipPage        = lazy(() => import("./payslips/PayslipPage"));
const AnnouncementsPage  = lazy(() => import("./announcements/AnnouncementsPage"));
const ProfilePage        = lazy(() => import("./profile/TeacherProfilePage"));

const RouteLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
  </div>
);

export default function TeacherRouter() {
  return (
    <Suspense fallback={<RouteLoader />}>
    <Routes>
          {/* Wrap all parent routes inside layout */}
          <Route element={<TeacherLayout />}>
            {/* Default redirect */}
            <Route index element={<Navigate to="dashboard" replace />} />
    
            {/* Pages */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="attendance" element={<MyAttendancePage />} />
            <Route path="holidays" element={<HolidaysPage />} />
            <Route path="students" element={<MyStudentsPage />} />
            <Route path="homework" element={<HomeworkPage />} />
            <Route path="timetable" element={<TimetablePage />} />
            <Route path="timetable/exams" element={<ExamTimetablePage />} />
            <Route path="exams" element={<ExamsPage />} />
            <Route path="leave" element={<LeavePage />} />
            <Route path="leave/apply" element={<ApplyLeavePage />} />
            <Route path="payslip" element={<PayslipPage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="profile" element={<ProfilePage />} />
    
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
    </Suspense>
  );
}