"use client";

import { GoogleLogin } from "@react-oauth/google";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  Building2,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { useSignUp } from "../../hooks/useSignUp";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate()
  const {
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
    isLoading,
    error,
    success,
  } = useSignUp();

  const handleGoogleResponse = async (credentialResponse: any) => {
    await googleSignUp(credentialResponse.credential);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-blue-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/30 grid lg:grid-cols-2">

        {/* Left – Branding Panel with Glassmorphism vibe */}
        <div className="relative hidden lg:flex flex-col justify-center p-12 xl:p-16 bg-linear-to-br from-indigo-600/90 to-purple-600/90 text-white overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 bg-white/15 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                <ShieldCheck className="w-9 h-9" />
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-md">CareerConnect</h1>
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-8 drop-shadow">
              {formData.role === "candidate" ? "Launch Your Career" : "Discover Top Talent"}
            </h2>

            <p className="text-indigo-100/95 text-xl leading-relaxed mb-12 max-w-lg drop-shadow">
              {formData.role === "candidate"
                ? "Connect with dream opportunities, showcase your skills, and accelerate your professional journey."
                : "Access verified professionals, AI-driven matching, and streamlined hiring — all in one place."}
            </p>

            <ul className="space-y-5 text-lg">
              {[
                { icon: CheckCircle2, text: "Bank-level encryption & privacy" },
                { icon: CheckCircle2, text: "Instant OTP verification" },
                { icon: CheckCircle2, text: "Intelligent role-based matching" },
                { icon: CheckCircle2, text: "24/7 support & career resources" },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4">
                  <item.icon className="w-6 h-6 text-emerald-300" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Subtle glass-like floating elements */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute -left-40 top-20 w-125 h-125 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute right-0 bottom-0 w-100 h-100 bg-purple-300/20 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Right – Form with Glassmorphism card */}
        <div className="p-6 sm:p-10 lg:p-14 flex flex-col bg-white/40 backdrop-blur-xl border-l border-white/20">
          <div className="max-w-md mx-auto w-full space-y-8">

            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Create Account</h2>
              <p className="mt-3 text-gray-600 text-lg">Join in seconds — it's free</p>
            </div>

            {/* Role Cards – Glassmorphic style */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { value: "candidate" as const, label: "Candidate", icon: GraduationCap, desc: "Find jobs" },
                { value: "recruiter" as const, label: "Recruiter", icon: Building2, desc: "Hire talent" },
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setFormData((p: any) => ({ ...p, role: r.value }))}
                  className={`group relative p-6 rounded-2xl backdrop-blur-lg border border-white/30 transition-all duration-300 shadow-lg
                    ${formData.role === r.value
                      ? "bg-white/60 border-indigo-400/50 shadow-indigo-200/40 scale-[1.03]"
                      : "bg-white/30 hover:bg-white/50 hover:border-white/50 hover:shadow-xl"}`}
                >
                  <r.icon className={`w-10 h-10 mx-auto mb-4 transition-colors ${formData.role === r.value ? "text-indigo-600" : "text-gray-500 group-hover:text-indigo-500"}`} />
                  <div className="font-semibold text-gray-900 text-lg">{r.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{r.desc}</div>

                  {formData.role === r.value && (
                    <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md ring-2 ring-white/80">
                      Active
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Alerts */}
            {(error || success) && (
              <div className={`p-5 rounded-2xl flex items-start gap-4 backdrop-blur-sm border ${
                error ? "bg-rose-100/70 border-rose-300/50 text-rose-800" : "bg-emerald-100/70 border-emerald-300/50 text-emerald-800"
              }`}>
                {error ? <AlertCircle className="w-6 h-6 mt-0.5 shrink-0" /> : <CheckCircle2 className="w-6 h-6 mt-0.5 shrink-0" />}
                <p className="text-base">{error || success}</p>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-6">

              {/* Floating label inputs */}
              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full px-5 pt-7 pb-3 bg-white/60 backdrop-blur-sm border border-gray-300/70 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300/50 outline-none transition-all shadow-sm"
                />
                <label
                  htmlFor="fullName"
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600 peer-placeholder-shown:text-base transition-all duration-200 pointer-events-none"
                >
                  Full Name
                </label>
                <User className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full px-5 pt-7 pb-3 bg-white/60 backdrop-blur-sm border border-gray-300/70 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300/50 outline-none transition-all shadow-sm"
                />
                <label
                  htmlFor="email"
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600 peer-placeholder-shown:text-base transition-all duration-200 pointer-events-none"
                >
                  Email Address
                </label>
                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              {/* Password with checklist */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full px-5 pt-7 pb-3 bg-white/60 backdrop-blur-sm border border-gray-300/70 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300/50 outline-none transition-all shadow-sm"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600 peer-placeholder-shown:text-base transition-all duration-200 pointer-events-none"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                {formData.password && (
                  <>
                    <div className="h-1.5 bg-gray-200/70 rounded-full overflow-hidden shadow-inner">
                      <div className={`h-full bg-linear-to-r ${strengthColor} transition-all duration-500`} style={{ width: `${passwordStrength}%` }} />
                    </div>
                    <ul className="space-y-1.5 text-sm">
                      {passwordChecks.map((check, i) => (
                        <li key={i} className="flex items-center gap-2">
                          {check.ok ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <X className="w-4 h-4 text-rose-500" />
                          )}
                          <span className={check.ok ? "text-emerald-700" : "text-gray-600"}>{check.label}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full px-5 pt-7 pb-3 bg-white/60 backdrop-blur-sm border border-gray-300/70 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300/50 outline-none transition-all shadow-sm"
                />
                <label
                  htmlFor="confirmPassword"
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600 peer-placeholder-shown:text-base transition-all duration-200 pointer-events-none"
                >
                  Confirm Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="mt-1.5 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 bg-white/70"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                  I accept the{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium underline-offset-2 hover:underline">Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium underline-offset-2 hover:underline">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 ring-1 ring-indigo-500/30"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white/40 border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200/70" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white/80 backdrop-blur-sm px-6 py-1.5 rounded-full text-sm text-gray-500 border border-gray-200/50 shadow-sm">or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleResponse}
                onError={() => {}} // Error is handled in the hook
                useOneTap={false}
                theme="outline"
                size="large"
                text="signup_with"
                shape="rectangular"
                width="100%"
              />
            </div>

            <p className="text-center text-gray-600 mt-10">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline inline-flex items-center gap-1.5"
                disabled={isLoading}
              >
                Sign in now
                <ChevronRight className="w-5 h-5" />
              </button>
            </p>

            <div className="mt-8 p-5 bg-white/40 backdrop-blur-lg rounded-2xl border border-white/30 text-center shadow-inner">
              <div className="flex justify-center items-center gap-3 mb-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <p className="font-semibold text-gray-800">Your security is our priority</p>
              </div>
              <p className="text-sm text-gray-600">
                End-to-end encryption • GDPR compliant • No plain-text passwords stored
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}