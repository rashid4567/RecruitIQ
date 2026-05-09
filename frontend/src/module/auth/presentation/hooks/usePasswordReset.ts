import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { resetPasswordUC } from "../di/auth";

export interface PasswordRequirement {
  label: string;
  met: boolean;
}

export type StrengthLevel =
  | "empty"
  | "very-weak"
  | "weak"
  | "fair"
  | "strong"
  | "excellent";

export interface StrengthConfig {
  level: StrengthLevel;
  label: string;
  pct: number;
  color: string;
  barColor: string;
}

export interface UsePasswordResetReturn {
  token: string | null;
  validatingToken: boolean;
  password: string;
  confirmPassword: string;
  setPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  showPassword: boolean;
  showConfirmPassword: boolean;
  toggleShowPassword: () => void;
  toggleShowConfirmPassword: () => void;
  requirements: PasswordRequirement[];
  strength: StrengthConfig;
  errors: { password?: string; confirm?: string };
  isSubmitEnabled: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}


const REQUIREMENT_DEFINITIONS: Array<{ label: string; test: (p: string) => boolean }> = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Uppercase letter",       test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter",       test: (p) => /[a-z]/.test(p) },
  { label: "Number",                 test: (p) => /\d/.test(p) },
  {
    label: "Special character",
    test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(p),
  },
];


function calcStrength(password: string): StrengthConfig {
  if (!password) {
    return {
      level: "empty",
      label: "",
      pct: 0,
      color: "text-slate-400",
      barColor: "bg-slate-200",
    };
  }

  const met = REQUIREMENT_DEFINITIONS.filter((r) => r.test(password)).length;

  if (met <= 1)   return { level: "very-weak", label: "Very weak",  pct: 20,  color: "text-rose-600",    barColor: "bg-rose-500"    };
  if (met === 2)  return { level: "weak",       label: "Weak",       pct: 40,  color: "text-amber-600",   barColor: "bg-amber-400"   };
  if (met === 3)  return { level: "fair",        label: "Fair",       pct: 60,  color: "text-amber-700",   barColor: "bg-amber-500"   };
  if (met === 4)  return { level: "strong",      label: "Strong",     pct: 80,  color: "text-indigo-600",  barColor: "bg-indigo-500"  };
  return           { level: "excellent",          label: "Excellent",  pct: 100, color: "text-emerald-600", barColor: "bg-emerald-500" };
}

export function usePasswordReset(): UsePasswordResetReturn {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const token     = params.get("token");

  const [password,            setPasswordRaw]  = useState("");
  const [confirmPassword,     setConfirmRaw]   = useState("");
  const [showPassword,        setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirm]  = useState(false);
  const [loading,             setLoading]      = useState(false);
  const [validatingToken,     setValidating]   = useState(!!token);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});


  useEffect(() => {
    if (!token) { setValidating(false); return; }
    const id = setTimeout(() => setValidating(false), 1000);
    return () => clearTimeout(id);
  }, [token]);


  useEffect(() => {
    if (!confirmPassword) {
      setErrors((prev) => ({ ...prev, confirm: undefined }));
      return;
    }
    setErrors((prev) => ({
      ...prev,
      confirm: password !== confirmPassword ? "Passwords do not match" : undefined,
    }));
  }, [password, confirmPassword]);


  const strength     = calcStrength(password);
  const requirements = REQUIREMENT_DEFINITIONS.map((r) => ({
    label: r.label,
    met:   r.test(password),
  }));

  const isSubmitEnabled =
    !!password &&
    !!confirmPassword &&
    password === confirmPassword &&
    strength.level !== "empty" &&
    strength.level !== "very-weak" &&
    strength.level !== "weak";


  const setPassword        = useCallback((v: string) => setPasswordRaw(v), []);
  const setConfirmPassword = useCallback((v: string) => setConfirmRaw(v),  []);

  const toggleShowPassword        = useCallback(() => setShowPassword((p) => !p), []);
  const toggleShowConfirmPassword = useCallback(() => setShowConfirm((p)  => !p), []);


  const validateForm = (): boolean => {
    const next: typeof errors = {};

    if (!password) {
      next.password = "Password is required";
    } else if (strength.level === "very-weak" || strength.level === "weak") {
      next.password = "Password is too weak — meet at least 4 requirements";
    }

    if (!confirmPassword) {
      next.confirm = "Please confirm your password";
    } else if (password !== confirmPassword) {
      next.confirm = "Passwords do not match";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await resetPasswordUC.execute(token!, password.trim());
    
      toast.success("Password reset successful!", {
        description: "Redirecting you to sign in…",
      });
      setTimeout(() => navigate("/signin"), 1800);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Link may be invalid or expired.";
      toast.error("Reset failed", { description: message });
    } finally {
      setLoading(false);
    }
  };

  return {
    token,
    validatingToken,
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    showPassword,
    showConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    requirements,
    strength,
    errors,
    isSubmitEnabled,
    handleSubmit,
    loading,
  };
}