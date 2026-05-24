import type { AxiosError } from "axios";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { GoogleCredentialResponse } from "@react-oauth/google";
import { ZodError } from "zod";

import { SignInUC, googleAuthUc } from "../di/auth";
import type { GoogleRoles } from "@/module/auth/domain/constants/google-role";
import type { SignInFormData } from "@/types/auth/auth.types";
import { signInSchema } from "../validation/signin.schema";

import type { AuthError } from "../types/auth.error"

export function useSignIn() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [success, setSuccess] = useState<string>("");

  const [pendingGoogleCredential, setPendingGoogleCredential] = useState<string | null>(null);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const isAnyLoading = isLoading || googleLoading;

  const getAuthError = useCallback((err: unknown): AuthError => {
    if (err instanceof ZodError) {
      return {
        message: err.issues[0]?.message ?? "Please check your input",
        type: "generic",
      };
    }

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
          message: "Invalid email or password. Please try again.",
          type: "generic",
        };

      case "ACCOUNT_BLOCKED":
      case "ACCOUNT_DEACTIVATED":
      case "ACCOUNT_SUSPENDED":
        return {
          message: backendMessage || "Your account has been blocked. Please contact support.",
          type: "blocked",
        };

      case "EMAIL_NOT_VERIFIED":
        return {
          message: "Please verify your email before signing in.",
          type: "generic",
        };

      case "WEAK_PASSWORD":
        return {
          message: "Password does not meet security requirements.",
          type: "generic",
        };

      default:
        return {
          message: backendMessage || "Something went wrong. Please try again.",
          type: "generic",
        };
    }
  }, []);

  const navigateBasedOnRole = useCallback((role: string) => {
    if (role === "candidate") navigate("/candidate/home");
    else if (role === "recruiter") navigate("/recruiter/");
    else navigate("/");
  }, [navigate]);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess("");
  }, []);

  const signIn = async (formData: SignInFormData) => {
    clearMessages();
    setIsLoading(true);

    try {
      signInSchema.parse(formData);

      const { user } = await SignInUC.execute(formData.email, formData.password);

      if (formData.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      setSuccess("Successfully signed in! Redirecting...");
      setTimeout(() => navigateBasedOnRole(user.role), 900);
    } catch (err: unknown) {
      setError(getAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleResponse = async (response: GoogleCredentialResponse) => {
    const credential = response.credential;
    if (!credential) {
      setError({
        message: "Google authentication failed. Please try again.",
        type: "generic",
      });
      return;
    }

    clearMessages();
    setGoogleLoading(true);

    try {
      const result = await googleAuthUc.execute(credential);
      setSuccess("Google sign in successful! Redirecting...");
      setTimeout(() => navigateBasedOnRole(result.user.role), 900);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{
  code?: string;
  message?: string;
}>;

      if (axiosErr?.response?.data?.code === "ROLE_REQUIRED") {
        setPendingGoogleCredential(credential);
        setShowRoleSelector(true);
      } else {
        setError(getAuthError(err));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleRoleSelect = async (role: GoogleRoles) => {
    if (!pendingGoogleCredential) return;

    clearMessages();
    setGoogleLoading(true);

    try {
      const { user } = await googleAuthUc.execute(pendingGoogleCredential, role);
      setSuccess("Welcome! Redirecting...");
      setTimeout(() => navigateBasedOnRole(user.role), 900);
    } catch (err: unknown) {
      setError(getAuthError(err));
    } finally {
      setGoogleLoading(false);
      setPendingGoogleCredential(null);
      setShowRoleSelector(false);
    }
  };

  return {
    signIn,
    handleGoogleResponse,
    handleGoogleRoleSelect,
    error,
    success,
    isLoading,
    googleLoading,
    isAnyLoading,
    showRoleSelector,
    clearMessages,
  };
}