import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/admin/sideBar";
import { logoutUC } from "../di/auth";

export function useLogout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const logout = async () => {
    const role = localStorage.getItem("userRole");
    setIsLoading(true);
    try {
      await logoutUC.execute();
      switch (role) {
        case "admin":
          navigate("/admin/login");
          break;
        case "candidate":
        case "recruiter":
          navigate("/signin");
          break;

        default:
          navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading,
  };
}
