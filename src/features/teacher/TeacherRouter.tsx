import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./dashboard/pages/DashboardPage";

export default function TeacherRouter() {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}