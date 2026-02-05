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
  ChevronRight,
  Shield,
  Building2,
  Linkedin,
  Key,
  User,
  Briefcase,
  GraduationCap,
  Loader2,
  Check,
  X,
} from "lucide-react";
import {
  GoogleLogin,
  type GoogleCredentialResponse,
} from "@react-oauth/google";

import type { SignInFormData } from "@/types/auth/auth.types";
import { getError } from "@/utils/getError";

import { SignInUC, googleAuthUseCase } from "../../di/auth";
import type { GoogleRoles } from "@/module/auth/domain/constants/google-role";

const SignIn = () => {
  const navigate = useNavigate();


  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingGoogleCredential, setPendingGoogleCredential] = useState<
    string | null
  >(null);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

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

    const validDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "company.com",
    ];
    const domain = email.split("@")[1];
    if (domain && !validDomains.some((d) => domain.includes(d))) {
      return { isValid: true, message: "Uncommon email domain detected" };
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
      message: `Password needs: ${messages.slice(0, 2).join(", ")}`,
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
      if (!validation.isValid) {
        setFieldErrors((prev) => ({ ...prev, email: validation.message }));
      } else {
        setFieldErrors((prev) => ({ ...prev, email: undefined }));
      }
    }

    if (field === "password") {
      const validation = validatePassword(formData.password);
      if (!validation.isValid) {
        setFieldErrors((prev) => ({ ...prev, password: validation.message }));
      } else {
        setFieldErrors((prev) => ({ ...prev, password: undefined }));
      }
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
      if (!validation.isValid) {
        setFieldErrors((prev) => ({ ...prev, password: validation.message }));
      }
    }

    setError("");
    setSuccess("");
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

    try {
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
      }, 800);
    } catch (err) {
      const errorMessage = getError(
        err,
        "Invalid email or password. Please try again.",
      );
      setError(errorMessage);

      setFormData((prev) => ({ ...prev, password: "" }));
      setPasswordScore(0);
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

      const { user } = await googleAuthUseCase.execute(credential);

      setSuccess("Google authentication successful! Redirecting...");

      setTimeout(() => {
        if (user.role === "candidate") {
          navigate("/candidate/home");
        } else {
          navigate("/recruiter/");
        }
      }, 500);
    } catch (err: any) {
      if (err?.response?.data?.code === "ROLE_REQUIRED") {
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

      setSuccess(
        `Welcome ${role === "candidate" ? "Candidate" : "Recruiter"}! Redirecting...`,
      );

      setTimeout(() => {
        if (user.role === "candidate") {
          navigate("/candidate/home");
        } else {
          navigate("/recruiter/");
        }
      }, 500);
    } catch (err) {
      setError(getError(err, "Failed to complete sign-in. Please try again."));
    } finally {
      setGoogleLoading(false);
      setPendingGoogleCredential(null);
      setShowRoleSelector(false);
    }
  };

  const isAnyLoading = isLoading || googleLoading;

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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-blue-50/50 p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="md:w-1/2 bg-linear-to-br from-indigo-600 via-blue-600 to-purple-700 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-white"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <Key className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                CareerConnect Pro
              </h1>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                  Welcome Back to Your
                  <br />
                  <span className="text-blue-200">Career Journey</span>
                </h2>
                <p className="text-blue-100/90 text-lg leading-relaxed">
                  Sign in to access personalized job matches, career insights,
                  and professional networking opportunities.
                </p>
              </div>

              <div className="space-y-6 mt-10">
                <div className="flex items-center gap-5 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="p-3 bg-white/20 rounded-full">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Job Seekers</h3>
                    <p className="text-sm text-blue-100/80 mt-1">
                      AI-powered job matching & career guidance
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Recruiters</h3>
                    <p className="text-sm text-blue-100/80 mt-1">
                      Smart candidate matching & hiring tools
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100/80">
                  Don't have an account?
                </p>
                <p className="text-blue-200 font-semibold mt-1">
                  Join 50,000+ professionals
                </p>
              </div>
              <button
                onClick={() => navigate("/role-selection")}
                disabled={isAnyLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-semibold transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Sign Up Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - SIGN IN FORM */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Enter your credentials to access your account
              </p>
            </div>

            {/* ALERTS */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in">
                <div className="p-1.5 bg-red-100 rounded-lg">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-red-800">Sign In Failed</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
                <button
                  onClick={() => setError("")}
                  className="text-red-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-fade-in">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-green-800">Success!</p>
                  <p className="text-sm text-green-600 mt-1">{success}</p>
                </div>
              </div>
            )}

            {/* ROLE SELECTOR */}
            {showRoleSelector && (
              <div className="mb-6 p-5 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Complete Your Sign Up
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tell us how you plan to use CareerConnect
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleGoogleRoleSelect("candidate")}
                    disabled={googleLoading}
                    className="p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 group hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-300">
                        <GraduationCap className="w-7 h-7 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">
                          Candidate
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Looking for jobs & career growth
                        </p>
                      </div>
                      {googleLoading && (
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => handleGoogleRoleSelect("recruiter")}
                    disabled={googleLoading}
                    className="p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all duration-300 group hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-purple-50 rounded-full group-hover:bg-purple-100 transition-colors duration-300">
                        <Briefcase className="w-7 h-7 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">
                          Recruiter
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Hiring talent for companies
                        </p>
                      </div>
                      {googleLoading && (
                        <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* SIGN IN FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
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
                    className={`w-full pl-10 pr-4 py-3.5 border ${fieldErrors.email ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all duration-200`}
                    disabled={isAnyLoading}
                  />
                </div>
                {fieldErrors.email && touchedFields.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-2 animate-slide-down">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
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
                    className={`w-full pl-10 pr-12 py-3.5 border ${fieldErrors.password ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all duration-200`}
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3 space-y-2 animate-slide-down">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">
                        Password strength:{" "}
                        {getPasswordStrengthText(passwordScore)}
                      </span>
                      <span className="text-xs font-semibold text-gray-700">
                        {passwordScore}/5
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getPasswordStrengthColor(passwordScore)} transition-all duration-300`}
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

              {/* Remember Me & Submit */}
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
            </form>

            {/* SEPARATOR */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500 font-medium">
                Or continue with
              </span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* SOCIAL SIGN IN */}
            <div className="space-y-4">
              <GoogleLogin
                onSuccess={handleGoogleResponse}
                onError={() =>
                  setError("Google sign-in failed. Please try again.")
                }
                width="100%"
                theme="filled_blue"
                size="large"
                text="signin_with"
                shape="pill"
                logo_alignment="center"
              />

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    /* Add LinkedIn auth */
                  }}
                  disabled={isAnyLoading}
                  className="p-3.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <Linkedin className="w-5 h-5 text-[#0077B5]" />
                  <span className="text-sm font-semibold text-gray-700">
                    LinkedIn
                  </span>
                </button>
                <button
                  onClick={() => {
                    /* Add SSO auth */
                  }}
                  disabled={isAnyLoading}
                  className="p-3.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <Building2 className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    Company SSO
                  </span>
                </button>
              </div>
            </div>

            {/* SECURITY INFO */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <p className="text-sm font-semibold text-gray-700">
                  Secure Sign In
                </p>
              </div>
              <p className="text-xs text-gray-500">
                Your credentials are protected with end-to-end encryption and
                never stored in plain text.
              </p>
            </div>

            {/* SIGN UP LINK */}
            <div className="text-center pt-8 mt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-6">
                New to CareerConnect?{" "}
                <button
                  onClick={() => navigate("/role-selection")}
                  className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-2 group transition-colors"
                  disabled={isAnyLoading}
                >
                  Create an account
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </p>
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{" "}
                <button className="text-blue-600 hover:underline font-medium">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button className="text-blue-600 hover:underline font-medium">
                  Privacy Policy
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
