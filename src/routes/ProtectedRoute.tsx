// src/routes/ProtectedRoute.tsx
import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface Props {
  role?: string;       // expected lowercase role: "teacher" | "schooladmin" | ...
  children?: ReactNode;
}

const ProtectedRoute = ({ role, children }: Props) => {
  const token     = useAuthStore((s) => s.token);
  const storeRole = useAuthStore((s) => s.role);  // already lowercase
  const parent          = useAuthStore((s) => s.parent);
  const students        = useAuthStore((s) => s.students);
  const selectedStudent = useAuthStore((s) => s.selectedStudent);
  const location = useLocation();

  const loginPath = role === "superadmin" ? "/superadmin/login" : "/login";

  // Not authenticated
  if (!token) return <Navigate to={loginPath} replace />;

  // Role mismatch
  if (role && storeRole !== role) return <Navigate to={loginPath} replace />;

  // Parent Portal — requires a parent profile, and a student selected once
  // more than one is linked to the account.
  if (role === "parent") {
    if (!parent) return <Navigate to="/login" replace />;

    const onSelectPage = location.pathname.startsWith("/parent/select-student");
    if (students.length > 1 && !selectedStudent && !onSelectPage) {
      return <Navigate to="/parent/select-student" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
