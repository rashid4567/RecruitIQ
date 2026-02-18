import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  KeyRound,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { resetPasswordUC } from "../../di/auth";

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(!!token);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [touched, setTouched] = useState({ password: false, confirm: false });

  const navigate = useNavigate();

  const passwordRequirements: PasswordRequirement[] = [
    { label: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
    { label: "One uppercase letter", test: (pwd) => /[A-Z]/.test(pwd) },
    { label: "One lowercase letter", test: (pwd) => /[a-z]/.test(pwd) },
    { label: "One number", test: (pwd) => /\d/.test(pwd) },
    { label: "One special character", test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(pwd) },
  ];

  const [requirements, setRequirements] = useState(
    passwordRequirements.map((req) => ({ ...req, met: false }))
  );

  const calculateStrength = useCallback((pwd: string) => {
    const metCount = passwordRequirements.filter((req) => req.test(pwd)).length;
    return (metCount / passwordRequirements.length) * 100;
  }, []);

  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (!token) {
      setValidatingToken(false);
      return;
    }

    // In real app → call actual token validation API here
    // For demo: fake delay
    const timer = setTimeout(() => setValidatingToken(false), 1200);
    return () => clearTimeout(timer);
  }, [token]);

  useEffect(() => {
    const newStrength = calculateStrength(password);
    setStrength(newStrength);

    setRequirements(
      passwordRequirements.map((req) => ({
        ...req,
        met: req.test(password),
      }))
    );
  }, [password, calculateStrength]);

  const getStrengthConfig = (val: number) => {
    if (val < 40) return { color: "bg-rose-500", text: "Very weak", textColor: "text-rose-700" };
    if (val < 70) return { color: "bg-amber-500", text: "Fair", textColor: "text-amber-700" };
    if (val < 90) return { color: "bg-blue-500", text: "Strong", textColor: "text-blue-700" };
    return { color: "bg-emerald-500", text: "Excellent", textColor: "text-emerald-700" };
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "At least 8 characters required";
    else if (strength < 60) newErrors.password = "Password is too weak";

    if (!confirm) newErrors.confirm = "Please confirm your password";
    else if (password !== confirm) newErrors.confirm = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      await resetPasswordUC.execute(token!, password.trim());

      toast.success("Password reset successful", {
        description: "Redirecting you to sign in...",
        icon: <CheckCircle2 className="h-5 w-5" />,
      });

      setTimeout(() => navigate("/signin"), 1800);
    } catch (err: any) {
      toast.error("Reset failed", {
        description: err.message || "Link may be invalid or expired. Try requesting a new one.",
        icon: <ShieldAlert className="h-5 w-5" />,
      });
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
            <KeyRound className="h-16 w-16 text-blue-600 relative" strokeWidth={1.8} />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800">Verifying reset link...</h2>
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50/40 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-rose-100">
          <ShieldAlert className="h-16 w-16 text-rose-600 mx-auto mb-6" strokeWidth={1.6} />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Invalid or Expired Link</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            This password reset link is no longer valid. Please request a new one from the sign-in page.
          </p>
          <button
            onClick={() => navigate("/signin")}
            className="w-full py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  const strengthConfig = getStrengthConfig(strength);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 flex items-center justify-center p-4 sm:p-6">
      {/* Subtle background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-200/15 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/5 border border-white/60 p-8 sm:p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <button
              onClick={() => navigate("/signin")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition group text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to sign in
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Secure Reset
            </div>
          </div>

          {/* Icon + Title */}
          <div className="text-center mb-10">
            <div className="relative inline-flex mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-20 animate-pulse" />
              <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-5 rounded-2xl shadow-lg">
                <KeyRound className="h-10 w-10 text-white" strokeWidth={2} />
              </div>
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-spin-slow" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Set New Password
            </h1>
            <p className="text-slate-600">
              Choose a strong password to protect your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                  className={`
                    w-full pl-11 pr-12 py-3.5 bg-white border rounded-2xl
                    focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                    transition-all duration-200 placeholder:text-slate-400
                    ${touched.password && errors.password ? "border-rose-400" : ""}
                    ${password && strength >= 70 ? "border-emerald-400" : "border-slate-200"}
                  `}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-2 text-sm text-rose-600 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Strength meter + checklist */}
            {password && (
              <div className="space-y-4 bg-slate-50/70 rounded-2xl p-5 border border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">Strength</span>
                  <span className={`font-semibold ${strengthConfig.textColor}`}>
                    {strengthConfig.text}
                  </span>
                </div>

                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strengthConfig.color} transition-all duration-500 ease-out`}
                    style={{ width: `${strength}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm pt-2">
                  {requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      {req.met ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <X className="h-4 w-4 text-slate-300" />
                      )}
                      <span className={req.met ? "text-emerald-700" : "text-slate-600"}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, confirm: true }))}
                  className={`
                    w-full pl-11 pr-12 py-3.5 bg-white border rounded-2xl
                    focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                    transition-all duration-200 placeholder:text-slate-400
                    ${touched.confirm && errors.confirm ? "border-rose-400" : ""}
                    ${confirm && password === confirm ? "border-emerald-400" : "border-slate-200"}
                  `}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirm}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                >
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {touched.confirm && errors.confirm ? (
                <p className="mt-2 text-sm text-rose-600 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  {errors.confirm}
                </p>
              ) : confirm && password === confirm ? (
                <p className="mt-2 text-sm text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Passwords match perfectly
                </p>
              ) : null}
            </div>

            {/* Security hint */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 text-sm">
              <div className="flex gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1 text-blue-800">
                  <p className="font-medium">Keep your account safe:</p>
                  <ul className="list-disc pl-5 space-y-0.5">
                    <li>Don’t reuse passwords from other sites</li>
                    <li>Avoid names, dates, or common words</li>
                    <li>Use a password manager if possible</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || strength < 60 || password !== confirm || !password}
              className={`
                w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-3
                transition-all duration-300 shadow-lg
                ${
                  loading || strength < 60 || password !== confirm
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white hover:shadow-xl active:scale-[0.98]"
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  Reset Password
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8 pt-6 border-t border-slate-100">
            You’ll be automatically signed in after reset
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;