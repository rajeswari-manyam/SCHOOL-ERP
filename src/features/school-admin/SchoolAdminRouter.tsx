import { Routes, Route, Navigate } from "react-router-dom";
// import DashboardPage from "./dashboard/DashboardPage";
import SchoolAdminLayout from "../../layouts/SchoolAdminLayout";
import DashboardPage from "./dashboard/DashboardPage";
import AttendancePage from "./attendance/AttendancePage";
export default function SchoolAdminRouter() {
  return (
     <Routes>
      {/* Wrap all parent routes inside layout */}
      <Route element={<SchoolAdminLayout />}>
        {/* Default redirect */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Pages */}
        <Route path="dashboard" element={<DashboardPage />} />
        

        <Route
          path="admissions"
          element={
           <div className="p-4 bg-white rounded shadow">mc mc m</div>
          }
        />
         <Route
          path="staff"
          element={
           <div className="p-4 bg-white rounded shadow">mc mc m</div>
          }
        />
         <Route
          path="attendance"
          element={
        <AttendancePage/>
          }
        />
         <Route
          path="students"
          element={
           <div className="p-4 bg-white rounded shadow">mc mc m</div>
          }
        />
         <Route
          path="timetable"
          element={
           <div className="p-4 bg-white rounded shadow">mc mc m</div>
          }
        />
         <Route
          path="fees"
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
         <Route
          path="settings"
          element={
           <div className="p-4 bg-white rounded shadow">settings</div>
          }
        />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}












     
 