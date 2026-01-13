import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");

  if (!token || role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
