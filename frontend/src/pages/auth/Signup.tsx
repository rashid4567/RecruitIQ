"use client";
import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/auth/auth.service";
import { linkedInService } from "../../services/auth/linkedIn.service";
import { GoogleLogin } from "@react-oauth/google";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  ArrowRight,
  AlertCircle,
  Briefcase,
  GraduationCap,
} from "lucide-react";

type RoleType = "candidate" | "recruiter";

interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: RoleType;
  termsAccepted: boolean;
}

interface PasswordRequirement {
  label: string;
  met: boolean;
}

const UnifiedSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const queryParams = new URLSearchParams(location.search);
  const roleFromQuery = queryParams.get("role") as RoleType;
  const roleFromState = location.state?.role as RoleType;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: roleFromQuery || roleFromState || "candidate",
    termsAccepted: false,
  });

  useEffect(() => {
    if (roleFromQuery && ["candidate", "recruiter"].includes(roleFromQuery)) {
      setFormData((prev) => ({
        ...prev,
        role: roleFromQuery as RoleType,
      }));
    }
  }, [roleFromQuery]);


  const handleGoogleResponse = async (response: any) => {
    try {
      setGoogleLoading(true);
      setError("");

      const credential = response?.credential;
      if (!credential) {
        throw new Error("No Google credential received");
      }

      const result = await authService.googleLogin(
        credential,
        formData.role
      );

      const user = result.data.user;

      if (user.role === "candidate") {
        navigate(
          user.profileComplete ? "/candidate/home" : "/candidate/profile"
        );
      } else if (user.role === "recruiter") {
        navigate(
          user.profileComplete ? "/recruiter/" : "/recruiter/complete-profile"
        );
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Google sign-in failed"
      );
    } finally {
      setGoogleLoading(false);
    }
  };


  const passwordRequirements: PasswordRequirement[] = useMemo(() => {
    const password = formData.password;
    return [
      { label: "At least 8 characters", met: password.length >= 8 },
      { label: "One uppercase letter", met: /[A-Z]/.test(password) },
      { label: "One lowercase letter", met: /[a-z]/.test(password) },
      { label: "One number", met: /\d/.test(password) },
      {
        label: "One special character",
        met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      },
    ];
  }, [formData.password]);

  const allRequirementsMet = passwordRequirements.every((req) => req.met);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleRoleChange = (role: RoleType) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation checks
    if (!formData.fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!formData.password) {
      setError("Please create a password");
      return;
    }

    if (!allRequirementsMet) {
      setError("Please meet all password requirements");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.termsAccepted) {
      setError("Please accept the terms and conditions");
      return;
    }

    try {
      setIsLoading(true);

   
      await authService.sendOTP(formData.email, formData.role);

    
      navigate("/verify-otp", {
        state: {
          email: formData.email,
          fullName: formData.fullName,
          password: formData.password,
          role: formData.role,
        },
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to send OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInSignup = () => {
    setError("");
    try {
      linkedInService.redirectToLinkedIn(formData.role);
    } catch (err: any) {
      setError("Failed to initiate LinkedIn signup. Please try again.");
      console.error("LinkedIn signup error:", err);
    }
  };

  const handleBack = () => {
    if (!roleFromQuery && !roleFromState) {
      navigate("/role-selection");
    } else {
      navigate(-1);
    }
  };

  const isAnyLoading = isLoading || googleLoading;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
  
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-5xl mx-auto relative z-10">
      
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="ml-3 text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              RecruitFlow AI
            </span>
          </div>

          <div className="mb-4">
            <p className="text-sm text-slate-600 mb-2">Step 2 of 5</p>
            <div className="w-64 h-2 bg-slate-200 rounded-full mx-auto overflow-hidden">
              <div className="w-2/5 h-full bg-linear-to-r from-blue-600 to-blue-700 rounded-full transition-all duration-500"></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">40% Complete</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-slate-600">
              Fill in your information to get started with RecruitFlow AI.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection Toggle */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleRoleChange("candidate")}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                    formData.role === "candidate"
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <GraduationCap
                    className={`w-6 h-6 ${
                      formData.role === "candidate"
                        ? "text-blue-600"
                        : "text-slate-600"
                    }`}
                  />
                  <span
                    className={`font-semibold ${
                      formData.role === "candidate"
                        ? "text-blue-700"
                        : "text-slate-700"
                    }`}
                  >
                    Candidate
                  </span>
                  <span className="text-xs text-slate-500">
                    Looking for jobs
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange("recruiter")}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                    formData.role === "recruiter"
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <Briefcase
                    className={`w-6 h-6 ${
                      formData.role === "recruiter"
                        ? "text-blue-600"
                        : "text-slate-600"
                    }`}
                  />
                  <span
                    className={`font-semibold ${
                      formData.role === "recruiter"
                        ? "text-blue-700"
                        : "text-slate-700"
                    }`}
                  >
                    Recruiter
                  </span>
                  <span className="text-xs text-slate-500">Hiring talent</span>
                </button>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="John Doe"
                  disabled={isAnyLoading}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="john@example.com"
                  disabled={isAnyLoading}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="Create a strong password"
                  disabled={isAnyLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={isAnyLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {formData.password && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs font-semibold text-slate-700 mb-2">
                    Password requirements:
                  </p>
                  <ul className="space-y-1">
                    {passwordRequirements.map((req) => (
                      <li
                        key={req.label}
                        className="flex items-center gap-2 text-xs"
                      >
                        {req.met && (
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        <span
                          className={
                            req.met ? "text-green-700" : "text-slate-600"
                          }
                        >
                          {req.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="Re-enter your password"
                  disabled={isAnyLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={isAnyLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {formData.password && formData.confirmPassword && (
                <p
                  className={`mt-2 text-xs ${
                    formData.password === formData.confirmPassword
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formData.password === formData.confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="w-5 h-5 border-2 border-slate-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  disabled={isAnyLoading}
                />
                {formData.termsAccepted && (
                  <svg
                    className="absolute w-3 h-3 text-white pointer-events-none left-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <label
                htmlFor="termsAccepted"
                className="text-sm text-slate-600 cursor-pointer"
              >
                I agree to the{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    // Add terms modal or navigation here
                  }}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Terms & Conditions
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    // Add privacy policy modal or navigation here
                  }}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 px-6 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isAnyLoading}
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-6 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isAnyLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating account...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">
                  or sign up with
                </span>
              </div>
            </div>

            {/* Social Auth */}
            <div className="grid grid-cols-2 gap-4">
              {/* ✅ UPDATED: Google Login Button */}
              <div className="relative">
                <GoogleLogin
                  onSuccess={(res) => {
                    if (res.credential) {
                      handleGoogleResponse({ credential: res.credential });
                    }
                  }}
                  onError={() => setError("Google sign-in failed")}
                  theme="outline"
                  size="large"
                  shape="rectangular"
                  width="100%"
                  useOneTap={false}
                />

                {googleLoading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* LinkedIn Button */}
              <button
                type="button"
                onClick={handleLinkedInSignup}
                className="flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isAnyLoading}
              >
                <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              disabled={isAnyLoading}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedSignup;
