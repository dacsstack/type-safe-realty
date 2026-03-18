import { Navigate } from "react-router-dom";

interface RoleProtectedRouteProps {
  role: string | null;
  allowedRoles: string[];
  children: React.ReactElement;
}

export default function RoleProtectedRoute({
  role,
  allowedRoles,
  children,
}: RoleProtectedRouteProps) {
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/project" replace />;
  }

  return children;
}
