import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const ROLE_HOME: Record<string, string> = {
  admin: "/admin/dashboard",
  recruiter: "/recruiter",
  candidate: "/candidate/home",
};

const PublicRoute = () => {
  const { isAuthenticated, userRole, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (isAuthenticated && userRole) {
    return <Navigate to={ROLE_HOME[userRole] ?? "/"} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
