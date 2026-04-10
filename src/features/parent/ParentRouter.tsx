
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./dashboard/pages/ParentDashBoard";
import ParentLayout from "../../layouts/ParentLayout";

export default function ParentRouter() {
  return (
    <Routes>
      {/* Wrap all parent routes inside layout */}
      <Route element={<ParentLayout/>}>
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