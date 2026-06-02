import {
  createContext,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

interface AuthState {
  isAuthenticated: boolean;
  userRole: string | null;
  isLoading: boolean;
  logout: () => void;
  login: (token: string, role: string, userId: string) => void;
}

 const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("authToken")
  );
  const [userRole, setUserRole] = useState<string | null>(
    () => localStorage.getItem("userRole")
  );
  const navigate = useNavigate();

  const login = (token: string, role: string, userId: string) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userId", userId);
    setIsAuthenticated(true);
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

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        isLoading: false, 
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};