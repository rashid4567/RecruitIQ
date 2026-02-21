import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import type { UserRole } from "@/module/auth/domain/constants/user-role";
import { googleAuthUc, sentOtpUc } from "../di/auth";
import { SignUpSchema } from "../validation/signup.schema";

export type RoleType = UserRole;

export interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: RoleType;
  termsAccepted: boolean;
}

export function useSignUp() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryRole = new URLSearchParams(location.search).get(
    "role",
  ) as RoleType | null;

  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: queryRole || "candidate",
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const passwordChecks = useMemo(() => {
    const pwd = formData.password;

    return [
      { label: "At least 8 characters", ok: pwd.length >= 8 },
      { label: "Contains uppercase letter", ok: /[A-Z]/.test(pwd) },
      { label: "Contains lowercase letter", ok: /[a-z]/.test(pwd) },
      { label: "Contains a number", ok: /\d/.test(pwd) },
      { label: "Contains special character", ok: /[^A-Za-z0-9]/.test(pwd) },
    ];
  }, [formData.password]);

  const passwordStrength = useMemo(() => {
    return (
      (passwordChecks.filter((c) => c.ok).length / passwordChecks.length) * 100
    );
  }, [passwordChecks]);

  const strengthColor =
    passwordStrength >= 80
      ? "from-emerald-500 to-teal-500"
      : passwordStrength >= 50
        ? "from-amber-500 to-yellow-500"
        : "from-rose-500 to-pink-500";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submit = async () => {
    setError(null);
    setSuccess(null);

    const result = SignUpSchema.safeParse(formData);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);

    try {
      await sentOtpUc.execute(formData.email, formData.role);

      setSuccess("OTP sent successfully! Check your inbox.");

      navigate("/verify-otp", { state: formData });
    } catch (err: any) {
      setError(err?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  

  const googleSignUp = async (credential: string) => {
    setGoogleLoading(true);
    setError(null);

    try {
      await googleAuthUc.execute(credential, formData.role);

      navigate(
        formData.role === "candidate"
          ? "/candidate/home"
          : "/recruiter/dashboard",
      );
    } catch (err: any) {
      setError(err?.message || "Google sign-up failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    submit,
    googleSignUp,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
    passwordChecks,
    passwordStrength,
    strengthColor,
    isSubmitting,
    googleLoading,
    isLoading: isSubmitting || googleLoading,
    error,
    success,
  };
}
