import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_HOME } from "../constants/roleHome";

const PublicRoute = () => {
  const { isAuthenticated, userRole, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (isAuthenticated && userRole) {
    return <Navigate to={ROLE_HOME[userRole] ?? "/"} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;