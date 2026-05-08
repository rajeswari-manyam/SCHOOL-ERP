import { Routes, Route, Navigate } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";

import { Dashboard } from "./dashboard/pages/DashboardPage";
import AttendancePage from "./attendance/pages/AttendancePage";
import { HomeworkPage } from "./homework/pages/HomeWorkPage";
import { ExamsPage } from "./exams/pages/ExamPage";
import ClassTimetable from "../student/timetable/pages/ClassTimetablePage";
import ProfilePage from "../student/profile/pages/ProfilePage";

export default function StudentRouter() {
  return (
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
  );
}