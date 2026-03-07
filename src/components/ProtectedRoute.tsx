import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteComponentProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteComponentProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}
