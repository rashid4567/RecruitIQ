// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    setIsAuthenticated(!!token);
    setUserRole(role);
    setIsLoading(false);
  }, []);

  const login = (token: string, role: string, userId: string) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userId", userId);
    setIsAuthenticated(true);   // ← shared state, ALL consumers re-render
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);  // ← shared state, ALL consumers re-render
    setUserRole(null);
    navigate("/signin");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Same hook name, same API — your existing components need zero changes
export const useAuth = (): AuthState => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};