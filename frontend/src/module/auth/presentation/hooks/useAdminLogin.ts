import type { AxiosError } from "axios";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { adminLoginUC } from "../di/auth";
import type { AuthError } from "../types/auth.error";

export function useAdminLogin() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [success, setSuccess] = useState("");

  const getAuthError = useCallback((err: unknown): AuthError => {
    const axiosError = err as AxiosError<{
      code?: string;
      message?: string;
    }>;

    const code = axiosError?.response?.data?.code;
    const backendMessage = axiosError?.response?.data?.message ?? "";

    switch (code) {
      case "INVALID_CREDENTIALS":
      case "UNAUTHORIZED":
        return {
          message: "Invalid admin credentials.",
          type: "generic",
        };

      case "ACCOUNT_BLOCKED":
      case "ACCOUNT_DEACTIVATED":
      case "ACCOUNT_SUSPENDED":
        return {
          message:
            backendMessage ||
            "Your account has been blocked. Please contact support.",
          type: "blocked",
        };

      default:
        return {
          message:
            backendMessage ||
            "Something went wrong. Please try again.",
          type: "generic",
        };
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess("");
  }, []);

  const login = async (
    email: string,
    password: string,
  ) => {
    clearMessages();
    setIsLoading(true);

    try {
      const { user } = await adminLoginUC.execute(
        email,
        password,
      );

      setSuccess("Login successful!");

      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        }
      }, 500);

      return user;
    } catch (err: unknown) {
      setError(getAuthError(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    error,
    success,
    isLoading,
    clearMessages,
  };
}