import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    
    setIsAuthenticated(!!token);
    setUserRole(role);
    setIsLoading(false);
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