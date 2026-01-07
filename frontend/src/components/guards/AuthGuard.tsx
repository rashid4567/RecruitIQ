import { Navigate } from "react-router-dom";
import type{ ReactNode} from "react"
import {useEffect, useState } from "react";
import api from "../../api/axios";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      setIsChecking(false);
      return;
    }

    try {
      // Check if token is valid by making a simple API call
      await api.get("/candidate/profile", {
        validateStatus: (status) => status < 500 // Allow 401/403/404
      });
      
      // Token is valid, redirect to appropriate page
      setShouldRedirect(true);
    } catch (error) {
      // Token is invalid, clear localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("profileCompleted");
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (shouldRedirect) {
    const userRole = localStorage.getItem("userRole");
    
    if (userRole === "candidate") {
      const profileCompleted = localStorage.getItem("profileCompleted") === "true";
      
      if (profileCompleted) {
        return <Navigate to="/candidate/home" replace />;
      } else {
        return <Navigate to="/candidate/profile" replace />;
      }
    } else if (userRole === "recruiter") {
      return <Navigate to="/recruiter/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default AuthGuard;