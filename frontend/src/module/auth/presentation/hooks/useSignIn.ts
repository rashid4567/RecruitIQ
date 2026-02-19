import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { GoogleCredentialResponse } from "@react-oauth/google";
import { ZodError } from "zod";

import { SignInUC, googleAuthUseCase } from "../di/auth";
import { getError } from "@/utils/getError";
import type { GoogleRoles } from "@/module/auth/domain/constants/google-role";
import type { SignInFormData } from "@/types/auth/auth.types";
import { signInSchema } from "../validation/signin.schema";

export function useSignIn() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [pendingGoogleCredential, setPendingGoogleCredential] = useState<
    string | null
  >(null);

  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const isAnyLoading = isLoading || googleLoading;

  const signIn = async (formData: SignInFormData) => {
    try {
      signInSchema.parse(formData);

      setIsLoading(true);
      setError("");
      setSuccess("");

      const { user } = await SignInUC.execute(
        formData.email,
        formData.password,
      );

      setSuccess("Successfully signed in! Redirecting...");

      if (formData.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      setTimeout(() => {
        if (user.role === "candidate") {
          navigate("/candidate/home");
        } else {
          navigate("/recruiter/");
        }
      }, 600);
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const firstError = err.issues[0]?.message;
        setError(firstError ?? "Invalid input");
        return;
      }

      setError(getError(err, "Invalid email or password. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleResponse = async (response: GoogleCredentialResponse) => {
    const credential = response.credential;

    if (!credential) {
      setError("Google authentication failed. Please try again.");
      return;
    }

    try {
      setGoogleLoading(true);
      setError("");

      const result = await googleAuthUseCase.execute(credential);

      setSuccess("Google authentication successful! Redirecting...");

      setTimeout(() => {
        if (result.user.role === "candidate") {
          navigate("/candidate/home");
        } else {
          navigate("/recruiter/");
        }
      }, 500);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        (err as any)?.response?.data?.code === "ROLE_REQUIRED"
      ) {
        setPendingGoogleCredential(credential);
        setShowRoleSelector(true);
        return;
      }

      setError(getError(err, "Google sign-in failed. Please try again."));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleRoleSelect = async (role: GoogleRoles) => {
    if (!pendingGoogleCredential) return;

    try {
      setGoogleLoading(true);
      setError("");

      const { user } = await googleAuthUseCase.execute(
        pendingGoogleCredential,
        role,
      );

      setSuccess("Welcome! Redirecting...");

      setTimeout(() => {
        if (user.role === "candidate") {
          navigate("/candidate/home");
        } else {
          navigate("/recruiter/");
        }
      }, 500);
    } catch (err: unknown) {
      setError(getError(err, "Failed to complete sign-in. Please try again."));
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
    setError,
  };
}
