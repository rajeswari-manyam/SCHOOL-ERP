// src/routes/ProtectedRoute.tsx
import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface Props {
  role?: string;       // expected lowercase role: "teacher" | "schooladmin" | ...
  children?: ReactNode;
}

const ProtectedRoute = ({ role, children }: Props) => {
  const token     = useAuthStore((s) => s.token);
  const storeRole = useAuthStore((s) => s.role);  // already lowercase

  // Not authenticated
  if (!token) return <Navigate to="/login" replace />;

  // Role mismatch
  if (role && storeRole !== role) return <Navigate to="/login" replace />;

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
