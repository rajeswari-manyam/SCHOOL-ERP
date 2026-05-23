import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./dashboard/TeacherDashboardPage";
import { TeacherLayout } from "@/layouts/TeacherLayout";
import MyAttendancePage from "./attendance/Myattendancepage";
import MyStudentsPage from "./students/MyStudentsPage";
import HomeworkPage from "./homework/HomeworkPage";
import TimetablePage from "./timetable/TimetablePage";
import LeavePage from "./leave/LeavePage";
import ExamsPage from "./exam/ExamMarksPage";
import PayslipPage from "./payslips/PayslipPage";
export default function TeacherRouter() {
  return (
    <Routes>
          {/* Wrap all parent routes inside layout */}
          <Route element={<TeacherLayout />}>
            {/* Default redirect */}
            <Route index element={<Navigate to="dashboard" replace />} />
    
            {/* Pages */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="attendance" element={<MyAttendancePage />} />
            <Route path="students" element={<MyStudentsPage />} />
            <Route path="homework" element={<HomeworkPage />} />
            <Route path="timetable" element={<TimetablePage />} />
            <Route path="exams" element={<ExamsPage />} />
            <Route path="leave" element={<LeavePage />} />
            <Route path="payslip" element={<PayslipPage />} />
    
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
  );
}