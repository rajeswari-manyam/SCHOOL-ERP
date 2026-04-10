// src/App.tsx
import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient";
import ParentRouter from "./features/parent/ParentRouter";
import TeacherRouter from "./features/teacher/TeacherRouter";
import SuperAdminRouter from "./features/super-admin/SuperAdminRouter";
import AccountantRouter from "./features/accountant/AccountantRouter";
import StudentRouter from "./features/student/StudentRouter";
import SchoolAdminRouter from "./features/school-admin/SchoolAdminRouter";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./features/auth/pages/LoginPage";
import OtpPage from "./features/auth/pages/OtpPage";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/otp" element={<OtpPage />} />
            <Route path="/parent/*" element={
              <ProtectedRoute role="parent"><ParentRouter /></ProtectedRoute>
            } />
            <Route path="/teacher/*" element={
              <ProtectedRoute role="teacher"><TeacherRouter /></ProtectedRoute>
            } />
            <Route path="/superadmin/*" element={
              <ProtectedRoute role="superadmin"><SuperAdminRouter /></ProtectedRoute>
            } />
            <Route path="/schooladmin/*" element={
              <ProtectedRoute role="schooladmin"><SchoolAdminRouter /></ProtectedRoute>
            } />
            <Route path="/accountant/*" element={
              <ProtectedRoute role="accountant"><AccountantRouter /></ProtectedRoute>
            } />
            <Route path="/student/*" element={
              <ProtectedRoute role="student"><StudentRouter /></ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;