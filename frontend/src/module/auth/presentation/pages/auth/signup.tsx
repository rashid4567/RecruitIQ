"use client";
import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  ArrowRight,
  AlertCircle,
  Check,
  X,
  Briefcase,
  GraduationCap,
  Shield,
  ChevronLeft,
} from "lucide-react";

import { googleAuthUseCase, sentOtpUc } from "../../di/auth";
import type { UserRole } from "@/module/auth/domain/constants/user-role";

type RoleType = UserRole;

interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: RoleType;
  termsAccepted: boolean;
}

interface ValidationErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  termsAccepted?: string;
  general?: string;
}

const UnifiedSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* -------------------- ROLE FROM ROUTE -------------------- */
  const queryParams = new URLSearchParams(location.search);
  const roleFromQuery = queryParams.get("role") as RoleType | null;
  const roleFromState = location.state?.role as RoleType | undefined;

  /* -------------------- STATE -------------------- */
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: roleFromQuery || roleFromState || "candidate",
    termsAccepted: false,
  });

  /* -------------------- EFFECTS -------------------- */
  useEffect(() => {
    if (roleFromQuery === "candidate" || roleFromQuery === "recruiter") {
      setFormData((prev) => ({ ...prev, role: roleFromQuery }));
    }
  }, [roleFromQuery]);

  useEffect(() => {
    validateField("password", formData.password);
    validateField("confirmPassword", formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);

  /* -------------------- VALIDATION -------------------- */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { isValid: boolean; requirements: PasswordRequirement[] } => {
    const requirements = [
      { label: "At least 8 characters", met: password.length >= 8 },
      { label: "One uppercase letter", met: /[A-Z]/.test(password) },
      { label: "One lowercase letter", met: /[a-z]/.test(password) },
      { label: "One number", met: /\d/.test(password) },
      { label: "One special character", met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) },
    ];
    return { isValid: requirements.every(r => r.met), requirements };
  };

  const validateField = (field: string, value: any) => {
    const errors: ValidationErrors = { ...validationErrors };
    
    switch (field) {
      case "fullName":
        if (!value.trim()) {
          errors.fullName = "Full name is required";
        } else if (value.trim().length < 2) {
          errors.fullName = "Full name must be at least 2 characters";
        } else {
          delete errors.fullName;
        }
        break;
      
      case "email":
        if (!value.trim()) {
          errors.email = "Email is required";
        } else if (!validateEmail(value)) {
          errors.email = "Please enter a valid email address";
        } else {
          delete errors.email;
        }
        break;
      
      case "password":
        if (!value) {
          errors.password = "Password is required";
        } else if (!validatePassword(value).isValid) {
          errors.password = "Password does not meet requirements";
        } else {
          delete errors.password;
        }
        break;
      
      case "confirmPassword":
        if (!value) {
          errors.confirmPassword = "Please confirm your password";
        } else if (value !== formData.password) {
          errors.confirmPassword = "Passwords do not match";
        } else {
          delete errors.confirmPassword;
        }
        break;
    }
    
    setValidationErrors(errors);
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof SignUpFormData]);
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    const passwordValidation = validatePassword(formData.password);
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!passwordValidation.isValid) {
      errors.password = "Password does not meet requirements";
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.termsAccepted) {
      errors.termsAccepted = "You must accept the terms and conditions";
    }
    
    setValidationErrors(errors);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      termsAccepted: true,
    });
    
    return Object.keys(errors).length === 0;
  };

  /* -------------------- GOOGLE AUTH -------------------- */
  const handleGoogleResponse = async (response: any) => {
    try {
      setGoogleLoading(true);
      setValidationErrors({});

      const credential = response?.credential;
      if (!credential) {
        throw new Error("Google credential missing");
      }

      const { user } = await googleAuthUseCase.execute(
        credential,
        formData.role
      );

      if (user.role === "candidate") {
        navigate("/candidate/home");
      } else {
        navigate("/recruiter/");
      }
    } catch (err: any) {
      setValidationErrors({ general: err.message || "Google sign-in failed" });
    } finally {
      setGoogleLoading(false);
    }
  };

  /* -------------------- PASSWORD REQUIREMENTS -------------------- */
  interface PasswordRequirement {
    label: string;
    met: boolean;
  }

  const passwordValidation = useMemo(() => {
    return validatePassword(formData.password);
  }, [formData.password]);

  /* -------------------- HANDLERS -------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (touched[name]) {
      validateField(name, newValue);
    }
  };

  const handleRoleChange = (role: RoleType) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  /* -------------------- SUBMIT (SEND OTP) -------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      await sentOtpUc.execute(formData.email, formData.role);

      navigate("/verify-otp", {
        state: {
          email: formData.email,
          fullName: formData.fullName,
          password: formData.password,
          role: formData.role,
        },
      });
    } catch (err: any) {
      setValidationErrors({ general: err.message || "Failed to send OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------- LINKEDIN -------------------- */
  const handleLinkedInSignup = () => {
    window.location.href = `/auth/linkedin?role=${formData.role}`;
  };

  const handleBack = () => {
    if (!roleFromQuery && !roleFromState) {
      navigate("/role-selection");
    } else {
      navigate(-1);
    }
  };

  const isAnyLoading = isLoading || googleLoading;

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Create Your Account
          </h1>
          <p className="text-slate-600">
            Join as a {formData.role === "candidate" ? "candidate" : "recruiter"} and get started
          </p>
        </div>

        {/* General Error */}
        {validationErrors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <p className="text-red-700 text-sm">{validationErrors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleRoleChange("candidate")}
              className={`p-4 border-2 rounded-xl transition-all duration-200 flex flex-col items-center gap-2 ${
                formData.role === "candidate"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 hover:border-slate-300 text-slate-700"
              }`}
            >
              <div className={`p-3 rounded-full ${
                formData.role === "candidate" ? "bg-blue-100" : "bg-slate-100"
              }`}>
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-medium">Candidate</span>
              <span className="text-xs text-slate-500">Looking for jobs</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("recruiter")}
              className={`p-4 border-2 rounded-xl transition-all duration-200 flex flex-col items-center gap-2 ${
                formData.role === "recruiter"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 hover:border-slate-300 text-slate-700"
              }`}
            >
              <div className={`p-3 rounded-full ${
                formData.role === "recruiter" ? "bg-blue-100" : "bg-slate-100"
              }`}>
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="font-medium">Recruiter</span>
              <span className="text-xs text-slate-500">Hiring talent</span>
            </button>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={() => handleBlur("fullName")}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  validationErrors.fullName && touched.fullName
                    ? "border-red-500"
                    : "border-slate-300"
                }`}
              />
            </div>
            {validationErrors.fullName && touched.fullName && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  validationErrors.email && touched.email
                    ? "border-red-500"
                    : "border-slate-300"
                }`}
              />
            </div>
            {validationErrors.email && touched.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur("password")}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  validationErrors.password && touched.password
                    ? "border-red-500"
                    : "border-slate-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {validationErrors.password && touched.password && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          {formData.password && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Password Requirements
              </p>
              <div className="space-y-1">
                {passwordValidation.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {req.met ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm ${req.met ? 'text-green-600' : 'text-red-600'}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur("confirmPassword")}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  validationErrors.confirmPassword && touched.confirmPassword
                    ? "border-red-500"
                    : formData.confirmPassword && formData.confirmPassword === formData.password
                    ? "border-green-500"
                    : "border-slate-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {validationErrors.confirmPassword && touched.confirmPassword && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.confirmPassword}
              </p>
            )}
            {formData.confirmPassword && formData.confirmPassword === formData.password && (
              <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Passwords match
              </p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              name="termsAccepted"
              id="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              onBlur={() => handleBlur("termsAccepted")}
              className="mt-1 w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="termsAccepted" className="text-sm text-slate-600">
              I agree to the{" "}
              <button
                type="button"
                onClick={() => window.open("/terms", "_blank")}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Terms & Conditions
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => window.open("/privacy", "_blank")}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Privacy Policy
              </button>
            </label>
          </div>
          {validationErrors.termsAccepted && touched.termsAccepted && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {validationErrors.termsAccepted}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isAnyLoading}
            className="w-full py-3.5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending OTP...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center">
          <div className="grow border-t border-slate-200"></div>
          <span className="mx-4 text-sm text-slate-500">Or continue with</span>
          <div className="grow border-t border-slate-200"></div>
        </div>

        {/* Social Logins */}
        <div className="space-y-4">
          <GoogleLogin
            onSuccess={handleGoogleResponse}
            onError={() => setValidationErrors({ general: "Google sign-in failed" })}
            width="100%"
            theme="outline"
            shape="rectangular"
            text="signup_with"
            size="large"
          />

          <button
            onClick={handleLinkedInSignup}
            disabled={isAnyLoading}
            className="w-full py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Continue with LinkedIn
          </button>
        </div>

        {/* Sign In Link */}
        <p className="mt-8 text-center text-slate-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/signin")}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default UnifiedSignup;