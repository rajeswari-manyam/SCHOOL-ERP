import type { ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  role?: string;
  children?: ReactNode;
}

const ProtectedRoute = ({ role, children }: Props) => {
  const { token, user } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;

  // Optional: redirect if role doesn't match
  if (role && user?.role !== role) return <Navigate to="/login" replace />;

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;