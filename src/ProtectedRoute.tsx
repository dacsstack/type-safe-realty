import { Navigate } from "react-router-dom";
import type { ProtectedRouteProps } from "./types";

export default function ProtectedRoute({ token, children }: ProtectedRouteProps) {
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
