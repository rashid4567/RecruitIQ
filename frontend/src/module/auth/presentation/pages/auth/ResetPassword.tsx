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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(!!token);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

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

  // Real-time password mismatch validation
  useEffect(() => {
    if (confirmPassword) {
      if (password !== confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirm: "Passwords do not match",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirm: undefined }));
      }
    } else {
      setErrors((prev) => ({ ...prev, confirm: undefined }));
    }
  }, [password, confirmPassword]);

  // Token validation
  useEffect(() => {
    if (!token) {
      setValidatingToken(false);
      return;
    }
    const timer = setTimeout(() => setValidatingToken(false), 1200);
    return () => clearTimeout(timer);
  }, [token]);

  // Update strength and requirements
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

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (strength < 60) {
      newErrors.password = "Password is too weak";
    }

    if (!confirmPassword) {
      newErrors.confirm = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await resetPasswordUC.execute(token!, password.trim());
      toast.success("Password reset successful!", {
        description: "Redirecting you to sign in...",
        icon: <CheckCircle2 className="h-5 w-5" />,
      });
      setTimeout(() => navigate("/signin"), 1800);
    } catch (err: any) {
      toast.error("Reset failed", {
        description: err.message || "Link may be invalid or expired.",
        icon: <ShieldAlert className="h-5 w-5" />,
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading & Invalid Token States
  if (validatingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <KeyRound className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold">Verifying reset link...</h2>
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mt-6" />
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
          <ShieldAlert className="h-16 w-16 text-rose-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Invalid Link</h1>
          <p className="text-slate-600 mb-8">This password reset link is invalid or has expired.</p>
          <button
            onClick={() => navigate("/signin")}
            className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-2xl"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  const strengthConfig = getStrengthConfig(strength);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-slate-100">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => navigate("/signin")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </button>
            <div className="text-xs font-medium text-emerald-600">Secure Reset</div>
          </div>

          <div className="text-center mb-10">
            <div className="mx-auto mb-6 w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
              <KeyRound className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Set New Password</h1>
            <p className="text-slate-600 mt-2">Create a strong password for your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-11 pr-12 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                    ${errors.password ? "border-red-400" : password ? "border-emerald-400" : "border-slate-200"}`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Password Strength */}
            {password && (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Password Strength</span>
                  <span className={`font-semibold ${strengthConfig.textColor}`}>
                    {strengthConfig.text}
                  </span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${strengthConfig.color}`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
                <div className="space-y-2 text-sm">
                  {requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-11 pr-12 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                    ${errors.confirm ? "border-red-400" : confirmPassword && password === confirmPassword ? "border-emerald-400" : "border-slate-200"}`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Real-time Password Match Feedback */}
              {errors.confirm ? (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.confirm}
                </p>
              ) : confirmPassword && password === confirmPassword ? (
                <p className="mt-2 text-sm text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Passwords match perfectly
                </p>
              ) : null}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || strength < 60 || password !== confirmPassword || !password || !confirmPassword}
              className="w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  Reset Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;