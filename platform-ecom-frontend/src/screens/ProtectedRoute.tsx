import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  roles?: string[];
};

const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    // chưa login → quay về login
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.some((r) => user.roles.includes(r))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
