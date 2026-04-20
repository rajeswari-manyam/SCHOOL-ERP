import { Routes, Route, Navigate } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import StudentDashboard from "./dashboard/StudentDashBoard";
import DashboardPage from "./teachers/pages/DashBoardpage";
import AttendanceDashboard from "./attendance/AttendenceDashboard";
import HomeworkPage from "./homework/HomeWorkPage";
import ExamPage from "./exams/ExamPage";
import ClassTimetable from "./timetable/Classtimetable";
import ProfilePage from "./profile/ProfilePage";

export default function StudentRouter() {
  return (
    <Routes>
      <Route element={<StudentLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="attendance" element={<AttendanceDashboard />} />
        <Route path="homework" element={<HomeworkPage />} />
        <Route path="exams" element={<ExamPage />} />
        <Route path="timetable" element={<ClassTimetable />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="teachers" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}