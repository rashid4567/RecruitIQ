import type { AxiosError } from "axios";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { GoogleCredentialResponse } from "@react-oauth/google";
import { ZodError } from "zod";

import { login, googleLogin } from "../api/auth.api";
import type { GoogleRole } from "../types/google.types";
import type { SignInFormData } from "../types/auth.types";
import { signInSchema } from "../validation/signin.schema";
import type { AuthError } from "../types/auth.error";

export function useSignIn() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [success, setSuccess] = useState("");

  const [pendingGoogleCredential, setPendingGoogleCredential] = useState<
    string | null
  >(null);

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

    const code = axiosError.response?.data?.code;
    const backendMessage = axiosError.response?.data?.message ?? "";

    switch (code) {
      case "INVALID_CREDENTIALS":
      case "UNAUTHORIZED":
        return {
          message: "Invalid email or password.",
          type: "generic",
        };

      case "ACCOUNT_BLOCKED":
      case "ACCOUNT_DEACTIVATED":
      case "ACCOUNT_SUSPENDED":
        return {
          message:
            backendMessage ??
            "Your account has been blocked. Please contact support.",
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
          message: backendMessage ?? "Something went wrong. Please try again.",
          type: "generic",
        };
    }
  }, []);

  const navigateAfterLogin = useCallback(
    (role: string, profileCompleted: boolean) => {
      if (!profileCompleted) {
        navigate(
          role === "candidate"
            ? "/candidate/profile/complete"
            : "/recruiter/complete-profile",
        );
        return;
      }

      navigate(
        role === "candidate" ? "/candidate/home" : "/recruiter/dashboard",
      );
    },
    [navigate],
  );

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess("");
  }, []);

  const signIn = async (formData: SignInFormData): Promise<void> => {
    clearMessages();
    setIsLoading(true);

    try {
      signInSchema.parse(formData);

      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (formData.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      setSuccess("Successfully signed in!");

      setTimeout(() => {
        navigateAfterLogin(result.user.role, result.profileCompleted);
      }, 900);
    } catch (err) {
      setError(getAuthError(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleResponse = async (response: GoogleCredentialResponse) => {
    const credential = response.credential;

    if (!credential) {
      setError({
        message: "Google authentication failed.",
        type: "generic",
      });
      return;
    }

    clearMessages();
    setGoogleLoading(true);

    try {
      const result = await googleLogin({
        credential,
      });

      setSuccess("Google sign in successful!");

      setTimeout(() => {
        navigateAfterLogin(result.user.role, result.profileCompleted);
      }, 900);
    } catch (err) {
      const axiosErr = err as AxiosError<{
        code?: string;
      }>;

      if (axiosErr.response?.data?.code === "ROLE_REQUIRED") {
        setPendingGoogleCredential(credential);
        setShowRoleSelector(true);
      } else {
        setError(getAuthError(err));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleRoleSelect = async (role: GoogleRole) => {
    if (!pendingGoogleCredential) return;

    clearMessages();
    setGoogleLoading(true);

    try {
      const result = await googleLogin({
        credential: pendingGoogleCredential,
        role,
      });

      setSuccess("Welcome!");

      setTimeout(() => {
        navigateAfterLogin(result.user.role, result.profileCompleted);
      }, 900);
    } catch (err) {
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
