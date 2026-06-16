import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("authToken"),
  );

  const [userRole, setUserRole] = useState<string | null>(
    () => localStorage.getItem("userRole"),
  );

  const [isLoading] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    setIsAuthenticated(!!token);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");

    setIsAuthenticated(false);
    setUserRole(null);

    navigate("/signin");
  };

  return {
    isAuthenticated,
    userRole,
    isLoading,
    checkAuth,
    logout,
  };
};