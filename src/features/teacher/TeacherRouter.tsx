import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./dashboard/pages/DashboardPage";
import { TeacherLayout } from "@/layouts/TeacherLayout";

export default function TeacherRouter() {
  return (
    <Routes>
          {/* Wrap all parent routes inside layout */}
          <Route element={<TeacherLayout />}>
            {/* Default redirect */}
            <Route index element={<Navigate to="dashboard" replace />} />
    
            {/* Pages */}
            <Route path="dashboard" element={<DashboardPage />} />
    
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
  );
}