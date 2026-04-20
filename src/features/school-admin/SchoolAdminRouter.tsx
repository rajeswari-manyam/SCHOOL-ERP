import { Routes, Route, Navigate } from "react-router-dom";
// import DashboardPage from "./dashboard/DashboardPage";
import SchoolAdminLayout from "../../layouts/SchoolAdminLayout";
import DashboardPage from "./dashboard/SchoolAdminDashboardPage";
import AttendancePage from "./attendance/AttendancePage";
import TimetablePage from "./timetable/TimetablePage";

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
           <TimetablePage/>
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
 
 
 
 
 
 
 
 
 
 
 
 
     
 
 