import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  role: string;
}

const ProtectedRoute = ({ children, role }: Props) => {
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
