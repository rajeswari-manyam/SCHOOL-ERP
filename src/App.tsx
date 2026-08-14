// src/App.tsx

import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient";

import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuthStore } from "./store/authStore";
import { RouteErrorBoundary } from "./components/common/RouteErrorBoundary";

// Lazy-loaded pages
const LoginPage = lazy(() => import("./features/auth/pages/LoginPage"));
const OtpPage = lazy(() => import("./features/auth/pages/OtpPage"));
const SuperAdminLoginPage = lazy(() => import("./features/auth/pages/SuperAdminLoginPage"));
const FeePaymentPage = lazy(() => import("./features/public/feePayment/FeePaymentPage"));

// Lazy-loaded routers
const ParentRouter = lazy(() => import("./features/parent/ParentRouter"));
const TeacherRouter = lazy(() => import("./features/teacher/TeacherRouter"));
const SuperAdminRouter = lazy(() => import("./features/super-admin/SuperAdminRouter"));
const AccountantRouter = lazy(() => import("./features/accountant/AccountantRouter"));
const StudentRouter = lazy(() => import("./features/student/StudentRouter"));
const SchoolAdminRouter = lazy(() => import("./features/school-admin/SchoolAdminRouter"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
      <p className="text-sm text-slate-500">Loading...</p>
    </div>
  </div>
);

function App() {

  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  if (!hasHydrated) {
    return <PageLoader />;
  }

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
            success: {
              iconTheme: {
                primary: "#4ade80",
                secondary: "#1e293b",
              },
            },
            error: {
              iconTheme: {
                primary: "#f87171",
                secondary: "#1e293b",
              },
            },
          }}
        />
        {/* Many components call sonner's `toast(...)` — mount its Toaster too, or those calls render nothing */}
        <SonnerToaster position="top-right" richColors closeButton />

        <RouteErrorBoundary>
        <Suspense fallback={ <div className="p-4 text-sm text-slate-500"> Loading module... </div> } >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/otp" element={<OtpPage />} />
            <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />
            {/* Parent fee payment — no login, the token in the URL is the credential (see PAYMENTS_INTEGRATION_GUIDE.md §3.2) */}
            <Route path="/pay/:token" element={<FeePaymentPage />} />

            {/* Teacher */}
            <Route
              path="/teacher/*"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherRouter />
                </ProtectedRoute>
              }
            />

            {/* School Admin */}
            <Route
              path="/schooladmin/*"
              element={
                <ProtectedRoute role="schooladmin">
                  <SchoolAdminRouter />
                </ProtectedRoute>
              }
            />

            {/* Super Admin */}
            <Route
              path="/superadmin/*"
              element={
                <ProtectedRoute role="superadmin">
                  <SuperAdminRouter />
                </ProtectedRoute>
              }
            />

            {/* Accountant */}
            <Route
              path="/accountant/*"
              element={
                <ProtectedRoute role="accountant">
                  <AccountantRouter />
                </ProtectedRoute>
              }
            />

            {/* Parent */}
            <Route
              path="/parent/*"
              element={
                <ProtectedRoute role="parent">
                  <ParentRouter />
                </ProtectedRoute>
              }
            />

            {/* Student */}
            <Route
              path="/student/*"
              element={
                <ProtectedRoute role="student">
                  <StudentRouter />
                </ProtectedRoute>
              }
            />

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
        </RouteErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;