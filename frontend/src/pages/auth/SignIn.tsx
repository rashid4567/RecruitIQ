"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import type { SignInFormData } from "../../types/auth.types";
import { authService } from "../../services/auth.service";
import { linkedInService } from "../../services/linkedIn.service";
import { GoogleLogin } from "@react-oauth/google";

const SignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [linkedInLoading, setLinkedInLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // ✅ Google Response Handler
  const handleGoogleResponse = async (response: any) => {
    try {
      setGoogleLoading(true);
      setError("");

      const credential = response.credential;
      if (!credential) {
        throw new Error("No Google credential received");
      }

      const result = await authService.googleLogin(credential);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login(
        formData.email,
        formData.password
      );
      const { accessToken, user } = response.data;

      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userId", user.id);

      if (user.role === "candidate") {
        navigate("/candidate/home");
      } else if (user.role === "recruiter") {
        navigate("/recruiter/");
      }
    } catch (error: any) {
      console.error("❌ Login error:", error);
      console.error("❌ Error response:", error.response);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Invalid email or password";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // LinkedIn Sign In Handler
  const handleLinkedInSignIn = (userType: "candidate" | "recruiter") => {
    setError("");
    setLinkedInLoading(true);

    try {
      linkedInService.redirectToLinkedIn(userType);
    } catch (err: any) {
      setError("Failed to initiate LinkedIn sign in. Please try again.");
      setLinkedInLoading(false);
    }
  };

  const isAnyLoading = isLoading || linkedInLoading || googleLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/25 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-100/25 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl shadow-slate-100/50 backdrop-blur-sm">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-5">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/40">
                <span className="text-white font-bold text-base">R</span>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                RecruitFlow
              </h2>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Sign in to your account to access your dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white hover:border-slate-400"
                  required
                  disabled={isAnyLoading}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Enter your registered email address
              </p>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white hover:border-slate-400"
                  required
                  disabled={isAnyLoading}
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
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-5 h-5 cursor-pointer appearance-none border border-slate-300 rounded-lg checked:bg-gradient-to-br checked:from-blue-500 checked:to-blue-600 checked:border-blue-600 transition-all"
                    disabled={isAnyLoading}
                  />
                  {formData.rememberMe && (
                    <svg
                      className="absolute inset-0 m-auto w-3 h-3 text-white pointer-events-none"
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
                <span className="text-sm font-medium text-slate-700">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                disabled={isAnyLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isAnyLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/40 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs text-slate-500 font-medium">
              or continue with
            </span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Social Auth */}
          <div className="space-y-2.5">
            {/* Google Sign In - UPDATED */}
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
                text="signin_with"
                width="100%"
                useOneTap={false}
              />

              {googleLoading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* LinkedIn Sign In - Separate options for Candidate and Recruiter */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleLinkedInSignIn("candidate")}
                disabled={isAnyLoading}
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-blue-700/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
                {linkedInLoading ? "..." : "Candidate"}
              </button>
              <button
                type="button"
                onClick={() => handleLinkedInSignIn("recruiter")}
                disabled={isAnyLoading}
                className="bg-blue-900 hover:bg-blue-950 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-blue-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
                {linkedInLoading ? "..." : "Recruiter"}
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-slate-600 mt-6 text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/role-selection")}
              className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
              disabled={isAnyLoading}
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
