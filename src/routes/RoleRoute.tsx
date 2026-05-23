// src/routes/RoleRoute.tsx
import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";
import type { Role } from "../types/api.types";

interface RoleRouteProps {
  allowedRoles: Role[];
}

export const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const role = useAuthStore((s) => s.role);  // already lowercase e.g. "teacher"
  if (!role) return <Navigate to="/login" replace />;
  return allowedRoles.includes(role as Role)
    ? <Outlet />
    : <Navigate to="/login" replace />;
};
