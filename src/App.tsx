// src/App.tsx
import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient";

import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./features/auth/pages/LoginPage";
import OtpPage  from "./features/auth/pages/OtpPage";


import ParentRouter     from "./features/parent/ParentRouter";
import TeacherRouter    from "./features/teacher/TeacherRouter";
import SuperAdminRouter from "./features/super-admin/SuperAdminRouter";
import AccountantRouter from "./features/accountant/AccountantRouter";
import StudentRouter    from "./features/student/StudentRouter";
import SchoolAdminRouter from "./features/school-admin/SchoolAdminRouter";

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
      <p className="text-sm text-slate-500">Loading…</p>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "12px",
              background: "#1e293b",
              color: "#f8fafc",
              fontSize: "13px",
              padding: "12px 16px",
            },
            success: { iconTheme: { primary: "#4ade80", secondary: "#1e293b" } },
            error:   { iconTheme: { primary: "#f87171", secondary: "#1e293b" } },
          }}
        />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Public ── */}
            <Route path="/"      element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/otp"   element={<OtpPage />} />

            {/* ── Protected: Teacher ── */}
            <Route path="/teacher/*" element={
              <ProtectedRoute role="teacher"><TeacherRouter /></ProtectedRoute>
            } />

            {/* ── Protected: School Admin ── */}
            <Route path="/schooladmin/*" element={
              <ProtectedRoute role="schooladmin"><SchoolAdminRouter /></ProtectedRoute>
            } />

            {/* ── Protected: Super Admin ── */}
            <Route path="/superadmin/*" element={
              <ProtectedRoute role="superadmin"><SuperAdminRouter /></ProtectedRoute>
            } />

            {/* ── Protected: Accountant ── */}
            <Route path="/accountant/*" element={
              <ProtectedRoute role="accountant"><AccountantRouter /></ProtectedRoute>
            } />

            {/* ── Protected: Parent ── */}
            <Route path="/parent/*" element={
              <ProtectedRoute role="parent"><ParentRouter /></ProtectedRoute>
            } />

            {/* ── Protected: Student ── */}
            {/* <Route path="/student/*" element={
              <ProtectedRoute role="student"><StudentRouter /></ProtectedRoute>
            } /> */}

         <Route path="/student/*" element={<StudentRouter />} />
            {/* ── Catch-all ── */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
