import { Routes, Route, Navigate } from "react-router-dom";
// import DashboardPage from "./dashboard/DashboardPage";
import SchoolAdminLayout from "../../layouts/SchoolAdminLayout";
import DashboardPage from "../school-admin/dashboard/DashboardPage";
import AttendancePage from "../school-admin/attendance/AttendancePage";
import StaffManagementPage from "../school-admin/staff/pages/StaffPage";
import StudentsPage from "../school-admin/students/StudentsPage";
import AdmissionsPage from "../school-admin/admissions/AdmissionsPage";
import { FeesPage as FeeCollectionPage } from "../school-admin/fees";
import { ReportsPage } from "../school-admin/reports";
import { SettingsPage } from "./settings";

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
          element={<AdmissionsPage />}
        />
      <Route path="staff" element={<StaffManagementPage />} />
         <Route
          path="attendance"
          element={
        <AttendancePage/>
          }
        />
         <Route
          path="students"
          element={ <StudentsPage/> }/>
         
       
          
        
         <Route
          path="timetable"
          element={
           <div className="p-4 bg-white rounded shadow">mc mc m</div>
          }
        />
         <Route
          path="fees"
          element={<FeeCollectionPage />}
        />
         <Route
          path="reports"
          element={<ReportsPage />}
        />
         <Route
          path="settings"
          element={<SettingsPage />}
        />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}
 
 
 
 
 
 
 
 
 
 
 
 
     
 
 