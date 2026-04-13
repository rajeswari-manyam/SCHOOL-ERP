import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./dashboard/DashboardPage";
import AccountantLayout from "@/layouts/AccountantLayout";

export default function AccountantRouter() {
  return (
   <Routes>
      {/* Wrap all parent routes inside layout */}
      <Route element={<AccountantLayout/>}>
        {/* Default redirect */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Pages */}
        <Route path="dashboard" element={<DashboardPage />} />
         <Route
          path="fee management"
          element={
           <div className="p-4 bg-white rounded shadow">mc mc m</div>
          }
        />
         <Route
          path="expenses"
          element={
           <div className="p-4 bg-white rounded shadow">mc mc m</div>
          }
        />
         <Route
          path="reports"
          element={
           <div className="p-4 bg-white rounded shadow">mc mc m</div>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}