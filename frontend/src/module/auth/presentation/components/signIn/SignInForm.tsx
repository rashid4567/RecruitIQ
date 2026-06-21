import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import type { SignInFormData } from "@/module/auth/Application/dto/auth.types";

interface SignInFormProps {
  formData: SignInFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignInFormData>>;
  onSubmit: (data: SignInFormData) => Promise<void>;
  isLoading: boolean;
  isAnyLoading: boolean;
  onGoogleResponse: (response: CredentialResponse) => Promise<void>;
  onError: (error: string) => void;
}

export function SignInForm({
  formData,
  setFormData,
  onSubmit,
  isLoading,
  isAnyLoading,
  onGoogleResponse,
  onError,
}: SignInFormProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [touchedFields, setTouchedFields] = useState<{
    email: boolean;
    password: boolean;
  }>({
    email: false,
    password: false,
  });
  const [passwordScore, setPasswordScore] = useState(0);

  const validateEmail = (
    email: string,
  ): { isValid: boolean; message?: string } => {
    if (!email.trim()) {
      return { isValid: false, message: "Email is required" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Please enter a valid email address" };
    }

    return { isValid: true };
  };

  const validatePassword = (
    password: string,
  ): { isValid: boolean; message?: string; score: number } => {
    if (!password) {
      return { isValid: false, message: "Password is required", score: 0 };
    }

    let score = 0;
    const messages: string[] = [];

    if (password.length >= 8) score += 1;
    else messages.push("At least 8 characters");

    if (/[A-Z]/.test(password)) score += 1;
    else messages.push("One uppercase letter");

    if (/[a-z]/.test(password)) score += 1;
    else messages.push("One lowercase letter");

    if (/\d/.test(password)) score += 1;
    else messages.push("One number");

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else messages.push("One special character");

    setPasswordScore(score);

    if (score >= 4) {
      return { isValid: true, score };
    }

    return {
      isValid: false,
      message: `Password needs: ${messages.slice(0, 2).join(", ")}${messages.length > 2 ? "..." : ""}`,
      score,
    };
  };

  const validateForm = (): boolean => {
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);

    const newErrors: typeof fieldErrors = {};

    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    }

    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: keyof typeof touchedFields) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));

    if (field === "email") {
      const validation = validateEmail(formData.email);
      setFieldErrors((prev) => ({
        ...prev,
        email: validation.isValid ? undefined : validation.message,
      }));
    }

    if (field === "password") {
      const validation = validatePassword(formData.password);
      setFieldErrors((prev) => ({
        ...prev,
        password: validation.isValid ? undefined : validation.message,
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (name === "password" && touchedFields.password) {
      const validation = validatePassword(value);
      setFieldErrors((prev) => ({
        ...prev,
        password: validation.isValid ? undefined : validation.message,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouchedFields({ email: true, password: true });

    if (!validateForm()) {
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) {
        (firstError as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    await onSubmit(formData);
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score >= 4) return "bg-green-500";
    if (score >= 3) return "bg-yellow-500";
    if (score >= 2) return "bg-orange-500";
    return "bg-red-500";
  };

  const getPasswordStrengthText = (score: number) => {
    if (score >= 4) return "Strong";
    if (score >= 3) return "Good";
    if (score >= 2) return "Fair";
    return "Weak";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            name="email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur("email")}
            data-error={!!fieldErrors.email}
            className={`w-full pl-10 pr-4 py-3.5 border ${
              fieldErrors.email ? "border-red-300 bg-red-50" : "border-gray-300"
            } rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all duration-200`}
            disabled={isAnyLoading}
            autoComplete="username"
          />
        </div>
        {fieldErrors.email && touchedFields.email && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-2 animate-slide-down">
            <AlertCircle className="w-4 h-4" />
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            Password
          </label>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            disabled={isAnyLoading}
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleBlur("password")}
            data-error={!!fieldErrors.password}
            className={`w-full pl-10 pr-12 py-3.5 border ${
              fieldErrors.password
                ? "border-red-300 bg-red-50"
                : "border-gray-300"
            } rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all duration-200`}
            disabled={isAnyLoading}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isAnyLoading}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {formData.password && (
          <div className="mt-3 space-y-2 animate-slide-down">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">
                Password strength: {getPasswordStrengthText(passwordScore)}
              </span>
              <span className="text-xs font-semibold text-gray-700">
                {passwordScore}/5
              </span>
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getPasswordStrengthColor(passwordScore)}`}
                style={{ width: `${(passwordScore / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {fieldErrors.password && touchedFields.password && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-2 animate-slide-down">
            <AlertCircle className="w-4 h-4" />
            {fieldErrors.password}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="rememberMe"
            id="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            disabled={isAnyLoading}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 block text-sm text-gray-700"
          >
            Remember me for 30 days
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isAnyLoading}
        className="w-full py-4 px-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg group"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Signing in...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <span>Sign In to Your Account</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </button>

      <div className="my-8 flex items-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-sm text-gray-500 font-medium">
          Or continue with
        </span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <div className="space-y-4">
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={onGoogleResponse}
            onError={() => onError("Google sign-in failed. Please try again.")}
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="pill"
            logo_alignment="center"
          />
        </div>
      </div>
    </form>
  );
}
