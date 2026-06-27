import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { logout as logoutApi } from "../api/auth.api";

export function useLogout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    const role = localStorage.getItem("userRole");

    setIsLoading(true);

    try {
      await logoutApi();

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
