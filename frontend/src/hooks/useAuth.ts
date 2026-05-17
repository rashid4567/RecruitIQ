import { useState } from "react";
import { useNavigate } from "react-router-dom";

function readAuthFromStorage() {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  return {
    isAuthenticated: !!token,
    userRole: role,
  };
}

export const useAuth = () => {
  const initial = readAuthFromStorage();
  const [isAuthenticated, setIsAuthenticated] = useState(initial.isAuthenticated);
  const [userRole, setUserRole] = useState<string | null>(initial.userRole);

  const navigate = useNavigate();

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
    isLoading: false,
    logout,
  };
};