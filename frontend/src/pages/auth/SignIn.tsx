import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Shield,
  Sparkles,
  Building2,
  UserCircle,
  Linkedin,
  Globe,
} from "lucide-react";
import type { SignInFormData } from "../../types/auth/auth.types";
import { authService } from "../../services/auth/auth.service";
import { linkedInService } from "../../services/auth/linkedIn.service";
import {
  GoogleLogin,
  type GoogleCredentialResponse,
} from "@react-oauth/google";
import { getError } from "@/utils/getError";

const SignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [linkedInLoading, setLinkedInLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [pendingGoogleCredential, setPendingGoogleCredential] = useState<
    string | null
  >(null);

  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

 const handleGoogleResponse = async (response: GoogleCredentialResponse) => {
  const credential = response.credential;

  try {
    setGoogleLoading(true);
    setError("");
    setSuccess("");
    setFieldErrors({});

    if (!credential) {
      throw new Error("No Google credential received");
    }

    const result = await authService.googleLogin(credential);

    const { role, userId, accessToken } = result.data;

    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userId", userId);

    if (role === "candidate") {
      navigate("/candidate/home");
    } else {
      navigate("/recruiter/");
    }
  } catch (err: unknown) {
    const errorMessage = getError(
      err,
      "Google sign-in failed. Please try again",
    );

    if (
      credential &&
      typeof err === "object" &&
      err &&
      "response" in err &&
      (err as any).response?.data?.code === "ROLE_REQUIRED"
    ) {
      setPendingGoogleCredential(credential);
      setShowRoleSelector(true);
      setError("");
      return;
    }

    setError(errorMessage);
  } finally {
    setGoogleLoading(false);
  }
};


  const handleGoogleRoleSelect = async (role: "candidate" | "recruiter") => {
    if (!pendingGoogleCredential) return;

    try {
      setGoogleLoading(true);

      const result = await authService.googleLogin(
        pendingGoogleCredential,
        role,
      );

      const { role: userRole, userId, accessToken } = result.data;

      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("userId", userId);

      if (userRole === "candidate") {
        navigate("/candidate/home");
      } else {
        navigate("/recruiter/");
      }
    } catch (err) {
      setError(getError(err));
    } finally {
      setGoogleLoading(false);
      setPendingGoogleCredential(null);
      setShowRoleSelector(false);
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

    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    let hasError = false;
    const newFieldErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      newFieldErrors.email = "Email is required";
      hasError = true;
    } else if (!validateEmail(formData.email)) {
      newFieldErrors.email = "Please enter a valid email address";
      hasError = true;
    }

    if (!formData.password) {
      newFieldErrors.password = "Password is required";
      hasError = true;
    } else if (!validatePassword(formData.password)) {
      newFieldErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }

    setFieldErrors(newFieldErrors);
    if (hasError) return;

    setIsLoading(true);

    try {
      const response = await authService.login(
        formData.email,
        formData.password,
      );
      const { accessToken, user } = response.data;

      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userFullName", user.fullName);

      setSuccess("Successfully signed in! Redirecting...");
      setTimeout(() => {
        if (user.role === "candidate") {
          navigate("/candidate/home");
        } else if (user.role === "recruiter") {
          navigate("/recruiter/");
        }
      }, 1000);
    } catch (error: unknown) {
      console.error(" Login error:", error);
      const errorMessage = getError(
        error,
        "Invalid email or password. Please try again.",
      );
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInSignIn = (userType?: "candidate" | "recruiter") => {
    if (!userType) {
      setShowRoleSelector(true);
      return;
    }

    setError("");
    setSuccess("");
    setFieldErrors({});
    setLinkedInLoading(true);

    try {
      linkedInService.redirectToLinkedIn(userType);
    } catch (err: unknown) {
      const errorMessage = getError(
        err,
        "Failed to initiate LinkedIn sign in. Please try again.",
      );
      setError(errorMessage);
      setLinkedInLoading(false);
    }
  };

  const isAnyLoading = isLoading || linkedInLoading || googleLoading;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-radial from-transparent via-transparent to-blue-100/20"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100/50 mask-[linear-linear(0deg,white,transparent)]"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl shadow-blue-500/10 p-8 md:p-10">
          {/* Logo/Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <div className="w-14 h-14 bg-linear-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40">
                  <span className="text-white font-bold text-xl">RI</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-linear-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-md">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  RecruitIQ
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Smart Hiring Platform
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Welcome Back 👋
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
              Sign in to continue to your dashboard and manage your recruitment
              journey.
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 animate-fade-in">
              <div className="p-4 bg-linear-to-r from-red-50/90 to-red-50/70 border border-red-200 rounded-xl flex items-start gap-3">
                <div className="shrink-0 w-5 h-5">
                  <AlertCircle className="w-full h-full text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800">{error}</p>
                  <p className="text-xs text-red-600 mt-1">
                    Please check your credentials and try again.
                  </p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 animate-fade-in">
              <div className="p-4 bg-linear-to-r from-emerald-50/90 to-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-3">
                <div className="shrink-0 w-5 h-5">
                  <CheckCircle className="w-full h-full text-emerald-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald-800">
                    {success}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LinkedIn Role Selector Modal */}
          {showRoleSelector && (
            <div className="mb-6 animate-fade-in">
              <div className="p-5 bg-linear-to-br from-blue-50 to-indigo-50/50 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Select your role to continue
                  </h3>
                  <button
                    onClick={() => setShowRoleSelector(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      pendingGoogleCredential
                        ? handleGoogleRoleSelect("candidate")
                        : handleLinkedInSignIn("candidate")
                    }
                    className="group p-4 bg-white border border-blue-200 rounded-xl hover:border-blue-400 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <UserCircle className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-900">
                        Candidate
                      </span>
                      <span className="text-xs text-slate-500">Job Seeker</span>
                    </div>
                  </button>
                  <button
                    onClick={() =>
  pendingGoogleCredential
    ? handleGoogleRoleSelect("recruiter")
    : handleLinkedInSignIn("recruiter")
}

                    className="group p-4 bg-white border border-blue-200 rounded-xl hover:border-blue-400 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-900">
                        Recruiter
                      </span>
                      <span className="text-xs text-slate-500">
                        Hiring Manager
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  Email Address
                </div>
              </label>
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3.5 border ${
                    fieldErrors.email
                      ? "border-red-300 bg-red-50/50"
                      : "border-slate-300 bg-white/50"
                  } rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 placeholder:text-slate-400`}
                  disabled={isAnyLoading}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={
                    fieldErrors.email ? "email-error" : undefined
                  }
                />
              </div>
              {fieldErrors.email && (
                <p
                  id="email-error"
                  className="text-sm text-red-600 flex items-center gap-2 animate-slide-down"
                >
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-900">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-400" />
                    Password
                  </div>
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:underline underline-offset-2"
                  disabled={isAnyLoading}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 pr-12 py-3.5 border ${
                    fieldErrors.password
                      ? "border-red-300 bg-red-50/50"
                      : "border-slate-300 bg-white/50"
                  } rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 placeholder:text-slate-400`}
                  disabled={isAnyLoading}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={
                    fieldErrors.password ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isAnyLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p
                  id="password-error"
                  className="text-sm text-red-600 flex items-center gap-2 animate-slide-down"
                >
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-5 h-5 cursor-pointer appearance-none border-2 border-slate-300 rounded-lg checked:bg-linear-to-br checked:from-blue-500 checked:to-blue-600 checked:border-blue-600 transition-all group-hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isAnyLoading}
                  />
                  {formData.rememberMe && (
                    <svg
                      className="absolute inset-0 m-auto w-3.5 h-3.5 text-white pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                  Keep me signed in
                </span>
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isAnyLoading}
              className="w-full py-4 px-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-linear-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-xs text-slate-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Auth */}
          <div className="space-y-4">
            {/* Google Sign In */}
            <div className="relative group">
              <div
                className={`${
                  googleLoading ? "opacity-50" : "group-hover:scale-[1.02]"
                } transition-transform duration-300`}
              >
                <GoogleLogin
                  onSuccess={(res) => {
                    if (res.credential) {
                      handleGoogleResponse({ credential: res.credential });
                    }
                  }}
                  onError={() =>
                    setError("Google sign-in failed. Please try again.")
                  }
                  theme="outline"
                  size="large"
                  shape="rectangular"
                  text="continue_with"
                  width="100%"
                  useOneTap={false}
                  logo_alignment="center"
                />
              </div>
              {googleLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* LinkedIn Sign In - Unified Button */}
            <button
              type="button"
              onClick={() => handleLinkedInSignIn()}
              disabled={linkedInLoading || isAnyLoading}
              className="w-full py-3.5 px-4 bg-linear-to-r from-[#0077B5] to-[#006699] hover:from-[#006699] hover:to-[#005587] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-700/30 hover:shadow-xl hover:shadow-blue-700/40 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {linkedInLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Linkedin className="w-5 h-5" />
                )}
                <span>
                  {linkedInLoading ? "Connecting..." : "Continue with LinkedIn"}
                </span>
              </div>
              <div className="absolute inset-0 bg-linear-to-r from-[#006699] to-[#005587] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-10 pt-6 border-t border-slate-200">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">New to RecruitIQ?</p>
              <button
                onClick={() => navigate("/role-selection")}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isAnyLoading}
              >
                <span>Create your account</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Security & Trust Badges */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Secure</span>
            </div>
            <div className="w-px h-3 bg-slate-300"></div>
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span>Trusted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated CSS */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
        
        .bg-grid-slate-100\/50 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(226 232 240 / 0.2)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
        
        .bg-linear-radial {
          background: radial-linear(ellipse at center, transparent 0%, transparent 50%, rgba(219, 234, 254, 0.1) 100%);
        }
      `}</style>
    </div>
  );
};

export default SignIn;
