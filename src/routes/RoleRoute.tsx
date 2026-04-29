import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";
import type { Role } from "../types/api.types";

interface RoleRouteProps {
  allowedRoles: Role[];
}

export const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { user } = useAuthStore();
  const role = user?.role;
  if (!role) return <Navigate to="/unauthorized" replace />;
  return allowedRoles.includes(role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};
