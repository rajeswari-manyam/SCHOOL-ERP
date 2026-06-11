import { Routes, Route, Navigate } from "react-router-dom";
// import DashboardPage from "./dashboard/DashboardPage";
import SchoolAdminLayout from "../../layouts/SchoolAdminLayout";
import{ DashboardPage }from "../school-admin/dashboard/DashboardPage";
import AttendancePage from "../school-admin/attendance/AttendancePage";
import StaffManagementPage from "../school-admin/staff/pages/StaffPage";
import StaffProfilePage from "../school-admin/staff/pages/StaffProfilePage";
import StudentsPage from "../school-admin/students/StudentsPage";
import StudentProfilePage from "../school-admin/students/components/StudentProfilePage";
import {AdmissionsPage} from "../school-admin/admissions/AdmissionsPage";
import { FeesPage as FeeCollectionPage } from "../school-admin/fees";
import { ReportsPage } from "../school-admin/reports";
import { SettingsPage } from "./settings";
import TimetablePage from "../school-admin/timetable/TimetablePage";
import ClassesPage from "../school-admin/classes/ClassesPage";

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
       <Route path="classes" element={<ClassesPage />} />
       <Route path="staff" element={<StaffManagementPage />} />
       <Route path="staff/:id" element={<StaffProfilePage />} />
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
          path="students/:id"
          element={ <StudentProfilePage/> }/>
         
       
          
        
         <Route
          path="timetable"
          element={ <TimetablePage/>
          
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
 
 
 
 
 
 
 
 
 
 
 
 
     
 
 