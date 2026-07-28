import { Routes, Route, Navigate } from "react-router-dom";

import ParentLayout from "../../layouts/ParentLayout";

import StudentSelectPage from "./studentSelect/pages/StudentSelectPage";
import DashboardPage from "./dashboard/pages/ParentDashBoard";
import AttendancePage from "./attendance/pages/AttendeancePage";
import FeesPage from "./fees/pages/FeePage";
import HomeworkPage from "./homework/pages/HomeWorkPage";
import ExamsPage from "./exams/pages/ExamPage";
import ParentTimetablePage from "./timetable/pages/ParentTimetablePage";
import ProfilePage from "./profile/pages/ProfilePage";
import SettingsPage from "./SettingsPage";
import ComplaintsPage from "./complaints/pages/ComplaintsPage";

export default function ParentRouter() {
  return (
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
  );
}