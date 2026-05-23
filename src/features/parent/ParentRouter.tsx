import { Routes, Route, Navigate } from "react-router-dom";

import ParentLayout from "../../layouts/ParentLayout";

import DashboardPage from "./dashboard/pages/ParentDashBoard";
import AttendancePage from "./attendance/pages/AttendeancePage";
import FeesPage from "./fees/pages/FeePage";
import HomeworkPage from "./homework/pages/HomeWorkPage";
import ExamsPage from "./exams/pages/ExamPage";
import ProfilePage from "./profile/pages/ProfilePage";
import SettingsPage from "./SettingsPage";
import ComplaintsPage from "./complaints/pages/ComplaintsPage";
import ExamsLayout from "./exams/components/ExamLayout";
export default function ParentRouter() {
  return (
    <Routes>
      <Route element={<ParentLayout />}>

        {/* Default redirect */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Pages */}
        <Route path="dashboard"   element={<DashboardPage />} />
        <Route path="attendance"  element={<AttendancePage />} />
        <Route path="fees"        element={<FeesPage />} />
        <Route path="homework"    element={<HomeworkPage />} />
        <Route path="exams"       element={<ExamsPage />} />
        <Route path="profile"     element={<ProfilePage />} />
        <Route path="settings"    element={<SettingsPage />} />
        <Route path="complaints"  element={<ComplaintsPage />} />
<Route path="exams" element={<ExamsLayout />}></Route>
        {/* Catch all */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />

      </Route>
    </Routes>
  );
}