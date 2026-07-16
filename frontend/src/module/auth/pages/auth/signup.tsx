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
  Sparkles,
  BadgeCheck,
  Zap,
} from "lucide-react";
import { useSignUp } from "../../hooks/useSignUp";
import { useNavigate } from "react-router-dom";

interface RoleCopy {
  headline: string;
  sub: string;
  stats: { value: string; label: string }[];
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
}

const ROLE_COPY: Record<string, RoleCopy> = {
  candidate: {
    headline: "Launch Your Career",
    sub: "Connect with dream opportunities, showcase your skills, and accelerate your professional journey.",
    stats: [
      { value: "50K+", label: "Active jobs" },
      { value: "12K+", label: "Companies" },
      { value: "98%", label: "Match rate" },
    ],
    accentColor: "text-violet-200",
    gradientFrom: "from-indigo-600",
    gradientTo: "to-violet-600",
  },
  recruiter: {
    headline: "Discover Top Talent",
    sub: "Access verified professionals, AI-driven matching, and a streamlined hiring pipeline — all in one place.",
    stats: [
      { value: "200K+", label: "Candidates" },
      { value: "4.8★", label: "Avg rating" },
      { value: "72h", label: "Avg hire time" },
    ],
    accentColor: "text-purple-200",
    gradientFrom: "from-violet-600",
    gradientTo: "to-purple-600",
  },
};

const TRUST_ITEMS = [
  { icon: ShieldCheck, text: "Bank-level encryption & privacy" },
  { icon: BadgeCheck, text: "Instant OTP verification" },
  { icon: Zap, text: "Intelligent role-based matching" },
  { icon: CheckCircle2, text: "24/7 support & career resources" },
];

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];

interface FloatInputProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  rightSlot?: React.ReactNode;
  autoComplete?: string;
}

function FloatInput({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  icon,
  rightSlot,
  autoComplete,
}: FloatInputProps) {
  const hasValue = value.length > 0;
  return (
    <div className="relative group">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        autoComplete={autoComplete}
        className={[
          "peer w-full px-4 pt-6 pb-2.5 rounded-xl text-sm text-gray-900",
          "bg-white/70 border transition-all duration-200 outline-none",
          "placeholder-transparent",
          rightSlot ? "pr-20" : "pr-11",
          hasValue
            ? "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/60"
            : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/60",
          "shadow-sm focus:shadow-md focus:bg-white/90",
        ].join(" ")}
      />
      <label
        htmlFor={id}
        className={[
          "absolute left-4 pointer-events-none transition-all duration-200 font-medium",
          "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400",
          "peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-indigo-600 peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wide",
          hasValue
            ? "top-2.5 translate-y-0 text-[10px] text-gray-500 font-semibold uppercase tracking-wide"
            : "",
        ].join(" ")}
      >
        {label}
      </label>

    
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {rightSlot}
        <span className="text-gray-300">{icon}</span>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  const navigate = useNavigate();

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
    isLoading,
    error,
    success,
  } = useSignUp();

  const copy =
    (ROLE_COPY as Record<string, RoleCopy>)[formData.role] ??
    ROLE_COPY.candidate;

  const strengthIndex = Math.round((passwordStrength / 100) * 5);
  const strengthLabel = STRENGTH_LABELS[strengthIndex] ?? "";

  const handleGoogleResponse = async (credentialResponse: {
    credential?: string;
  }) => {
    if (credentialResponse.credential) {
      await googleSignUp(credentialResponse.credential);
    }
  };

  const toggleRole = (role: "candidate" | "recruiter") =>
    setFormData((p: typeof formData) => ({ ...p, role }));

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50/60 to-purple-50/40 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-3xl rounded-3xl shadow-2xl shadow-indigo-200/30 overflow-hidden border border-white/60 grid lg:grid-cols-[1fr_1.1fr]">
        <div
          className={`relative hidden lg:flex flex-col justify-between p-10 xl:p-14 bg-linear-to-br ${copy.gradientFrom} ${copy.gradientTo} text-white overflow-hidden transition-all duration-700`}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="mesh"
                  x="0"
                  y="0"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 60 0 L 0 0 0 60"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mesh)" />
            </svg>
          </div>

          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 -left-20 w-72 h-72 rounded-full bg-white/8 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                Career<span className="opacity-60">Connect</span>
              </span>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white/80 text-[10px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              Step 2 of 5 · Create account
            </div>

            <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight mb-4 tracking-tight">
              {copy.headline}
            </h2>
            <p
              className={`text-base leading-relaxed mb-10 ${copy.accentColor} max-w-xs`}
            >
              {copy.sub}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-10">
              {copy.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-3 py-4 text-center"
                >
                  <div className="text-xl font-extrabold">{stat.value}</div>
                  <div
                    className={`text-[11px] font-medium mt-0.5 ${copy.accentColor}`}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <ul className="space-y-3">
              {TRUST_ITEMS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm">
                  <span className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-emerald-300" />
                  </span>
                  <span className={copy.accentColor}>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 mt-10 border-t border-white/15 pt-6">
            <p className="text-xs text-white/50 italic leading-relaxed">
              "CareerConnect helped me land a senior role in 3 weeks — the
              matching is genuinely impressive."
            </p>
            <div className="flex items-center gap-2.5 mt-3">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                A
              </div>
              <div>
                <div className="text-xs font-semibold text-white/80">
                  Anjali M.
                </div>
                <div className={`text-[10px] ${copy.accentColor}`}>
                  Senior Engineer · Hired 2024
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-9 lg:p-10 xl:p-12 flex flex-col overflow-y-auto bg-white/50 backdrop-blur-xl">
          <div className="max-w-105 mx-auto w-full space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Create your account
              </h1>
              <p className="mt-1.5 text-sm text-gray-500">
                Free forever · No credit card required
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2.5">
                I want to
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    {
                      value: "candidate" as const,
                      label: "Find a job",
                      icon: GraduationCap,
                      sub: "I'm a job seeker",
                    },
                    {
                      value: "recruiter" as const,
                      label: "Hire talent",
                      icon: Building2,
                      sub: "I'm a recruiter",
                    },
                  ] as const
                ).map((r) => {
                  const isActive = formData.role === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => toggleRole(r.value)}
                      aria-pressed={isActive}
                      className={[
                        "relative flex items-center gap-3 p-4 rounded-2xl border-2 text-left",
                        "transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                        isActive
                          ? "border-indigo-500 bg-indigo-50/80 shadow-md shadow-indigo-100"
                          : "border-gray-200/80 bg-white/60 hover:border-gray-300 hover:bg-white/80",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                          isActive ? "bg-indigo-100" : "bg-gray-100",
                        ].join(" ")}
                      >
                        <r.icon
                          className={`w-4.5 h-4.5 transition-colors ${isActive ? "text-indigo-600" : "text-gray-500"}`}
                          strokeWidth={1.8}
                        />
                      </span>
                      <div className="min-w-0">
                        <div
                          className={`text-sm font-bold leading-tight ${isActive ? "text-indigo-700" : "text-gray-700"}`}
                        >
                          {r.label}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {r.sub}
                        </div>
                      </div>

                      {isActive && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                          <Check
                            className="w-2.5 h-2.5 text-white"
                            strokeWidth={3}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {(error || success) && (
              <div
                className={[
                  "flex items-start gap-3 p-4 rounded-xl border text-sm leading-snug",
                  error
                    ? "bg-rose-50 border-rose-200 text-rose-700"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700",
                ].join(" ")}
              >
                {error ? (
                  <AlertCircle className="w-4.5 h-4.5 mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4.5 h-4.5 mt-0.5 shrink-0" />
                )}
                {error || success}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="space-y-4"
              noValidate
            >
              <FloatInput
                id="fullName"
                name="fullName"
                label="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                icon={<User className="w-4 h-4" />}
              />

              <FloatInput
                id="email"
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                icon={<Mail className="w-4 h-4" />}
              />

              <div className="space-y-2.5">
                <FloatInput
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  icon={<Lock className="w-4 h-4" />}
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-0.5"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />

                {formData.password && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={[
                              "flex-1 h-1.5 rounded-full transition-all duration-400",
                              i <= strengthIndex
                                ? strengthIndex <= 1
                                  ? "bg-rose-400"
                                  : strengthIndex <= 2
                                    ? "bg-amber-400"
                                    : strengthIndex <= 3
                                      ? "bg-yellow-400"
                                      : strengthIndex <= 4
                                        ? "bg-emerald-400"
                                        : "bg-emerald-500"
                                : "bg-gray-200",
                            ].join(" ")}
                          />
                        ))}
                      </div>
                      <span
                        className={[
                          "text-[11px] font-semibold w-16 text-right shrink-0",
                          strengthIndex <= 1
                            ? "text-rose-500"
                            : strengthIndex <= 3
                              ? "text-amber-500"
                              : "text-emerald-600",
                        ].join(" ")}
                      >
                        {strengthLabel}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {passwordChecks.map((check, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span
                            className={[
                              "w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-colors",
                              check.ok ? "bg-emerald-100" : "bg-gray-100",
                            ].join(" ")}
                          >
                            {check.ok ? (
                              <Check
                                className="w-2 h-2 text-emerald-600"
                                strokeWidth={3.5}
                              />
                            ) : (
                              <X
                                className="w-2 h-2 text-gray-400"
                                strokeWidth={3}
                              />
                            )}
                          </span>
                          <span
                            className={`text-[11px] leading-tight ${check.ok ? "text-emerald-700" : "text-gray-400"}`}
                          >
                            {check.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <FloatInput
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                icon={<Lock className="w-4 h-4" />}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-0.5"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />

              {formData.confirmPassword && (
                <div
                  className={`flex items-center gap-1.5 text-[11px] font-medium -mt-1 ${
                    formData.password === formData.confirmPassword
                      ? "text-emerald-600"
                      : "text-rose-500"
                  }`}
                >
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <Check className="w-3 h-3" strokeWidth={3} /> Passwords
                      match
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3" strokeWidth={3} /> Passwords don't
                      match
                    </>
                  )}
                </div>
              )}

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div
                    className={[
                      "w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center transition-all",
                      "group-hover:border-indigo-400",
                      formData.termsAccepted
                        ? "bg-indigo-600 border-indigo-600"
                        : "border-gray-300 bg-white",
                    ].join(" ")}
                  >
                    {formData.termsAccepted && (
                      <Check
                        className="w-2.5 h-2.5 text-white"
                        strokeWidth={3.5}
                      />
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500 leading-relaxed pt-0.5">
                  I agree to the{" "}
                  <a
                    href="#"
                    onClick={(e) => e.stopPropagation()}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold underline-offset-2 hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    onClick={(e) => e.stopPropagation()}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold underline-offset-2 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className={[
                  "w-full py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base",
                  "flex items-center justify-center gap-2.5 transition-all duration-300",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                  isLoading
                    ? "bg-indigo-400 text-white/80 cursor-not-allowed"
                    : "bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-300/40 hover:shadow-xl hover:shadow-indigo-400/40 hover:-translate-y-0.5 active:scale-[0.99]",
                ].join(" ")}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white/80 px-4 py-1 rounded-full text-xs text-gray-400 border border-gray-100 shadow-sm">
                  or sign up with
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleResponse}
                onError={() => {}}
                useOneTap={false}
                theme="outline"
                size="large"
                text="signup_with"
                shape="rectangular"
                width="100%"
              />
            </div>

            <p className="text-center text-xs text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signin")}
                disabled={isLoading}
                className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline underline-offset-2 inline-flex items-center gap-0.5 transition-colors"
              >
                Sign in
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </p>

            <div className="flex items-center justify-center gap-1.5 py-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-300" />
              <p className="text-[10px] text-gray-300 tracking-wide">
                256-bit encryption · GDPR compliant · SOC 2 Type II
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
