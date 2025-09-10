import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = () => {
  const { user } = useAuth();

  if (user) {
    if (user.roles.includes("ROLE_ADMIN")) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
