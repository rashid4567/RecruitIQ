import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
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
  met: boolean;
}

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>(
    {}
  );
  const [touched, setTouched] = useState({
    password: false,
    confirm: false,
  });

  const navigate = useNavigate();

  // Password requirements
  const passwordRequirements: PasswordRequirement[] = [
    {
      label: "At least 8 characters",
      test: (pwd) => pwd.length >= 8,
      met: false,
    },
    {
      label: "One uppercase letter",
      test: (pwd) => /[A-Z]/.test(pwd),
      met: false,
    },
    {
      label: "One lowercase letter",
      test: (pwd) => /[a-z]/.test(pwd),
      met: false,
    },
    {
      label: "One number",
      test: (pwd) => /\d/.test(pwd),
      met: false,
    },
    {
      label: "One special character",
      test: (pwd) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
      met: false,
    },
  ];

  // Calculate password strength
  const calculateStrength = useCallback((pwd: string): number => {
    let strength = 0;
    const requirements = passwordRequirements.map(req => req.test(pwd));
    strength = (requirements.filter(Boolean).length / requirements.length) * 100;
    return strength;
  }, []);

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [requirements, setRequirements] = useState(passwordRequirements);

  // Validate token
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setValidatingToken(false);
        return;
      }

      // Simulate token validation
      setTimeout(() => setValidatingToken(false), 1000);
    };

    validateToken();
  }, [token]);

  // Update password strength and requirements
  useEffect(() => {
    const strength = calculateStrength(password);
    setPasswordStrength(strength);

    const updatedRequirements = passwordRequirements.map(req => ({
      ...req,
      met: req.test(password),
    }));
    setRequirements(updatedRequirements);
  }, [password, calculateStrength]);

  // Validate field on blur
  const handleBlur = (field: 'password' | 'confirm') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: 'password' | 'confirm') => {
    const newErrors = { ...errors };

    if (field === 'password') {
      if (!password) {
        newErrors.password = "Password is required";
      } else if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else {
        delete newErrors.password;
      }
    }

    if (field === 'confirm') {
      if (!confirm) {
        newErrors.confirm = "Please confirm your password";
      } else if (password !== confirm) {
        newErrors.confirm = "Passwords do not match";
      } else {
        delete newErrors.confirm;
      }
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Include at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Include at least one lowercase letter";
    } else if (!/\d/.test(password)) {
      newErrors.password = "Include at least one number";
    } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      newErrors.password = "Include at least one special character";
    }

    if (!confirm) {
      newErrors.confirm = "Please confirm your password";
    } else if (password !== confirm) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);
    setTouched({ password: true, confirm: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await resetPasswordUC.execute(token!, password);

      toast.success("Password Reset Successful!", {
        description: "Your password has been updated. You can now sign in with your new credentials.",
        duration: 5000,
        icon: <CheckCircle className="w-5 h-5" />,
      });

      setTimeout(() => navigate("/signin"), 2000);
    } catch (err: any) {
      toast.error("Reset Failed", {
        description: err.message || "The reset link may have expired. Please request a new one.",
        duration: 5000,
        icon: <ShieldAlert className="w-5 h-5" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 40) return "bg-red-500";
    if (strength < 70) return "bg-amber-500";
    if (strength < 90) return "bg-blue-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength === 0) return "Enter a password";
    if (strength < 40) return "Very weak";
    if (strength < 70) return "Good";
    if (strength < 90) return "Strong";
    return "Very strong";
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-20 animate-pulse" />
            <div className="relative p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
              <KeyRound className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-700 mb-3">Validating Reset Link</h2>
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-rose-50">
        <div className="max-w-md w-full text-center">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full blur-xl opacity-20" />
            <div className="relative p-4 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl">
              <ShieldAlert className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Invalid Reset Link</h1>
          <p className="text-slate-600 mb-8">
            The password reset link is invalid or has expired. Please request a new reset link from the sign-in page.
          </p>
          
          <button
            onClick={() => navigate("/signin")}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/signin")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm">Back to Sign In</span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-slate-500">Secure Reset</span>
          </div>
        </div>

        {/* Main content */}
        <div className="text-center mb-8">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg opacity-20" />
            <div className="relative p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
              <KeyRound className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Reset Your Password
          </h1>
          <p className="text-slate-600 mb-2">
            Create a new secure password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`w-full pl-10 pr-12 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all ${
                  errors.password && touched.password
                    ? "border-rose-500"
                    : password && passwordStrength >= 70
                    ? "border-emerald-500"
                    : "border-slate-300"
                }`}
                placeholder="Enter your new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {errors.password && touched.password && (
              <p className="mt-2 text-sm text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Password strength */}
          {password && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Password strength</span>
                <span className={`text-sm font-semibold ${
                  passwordStrength < 40 ? "text-rose-600" :
                  passwordStrength < 70 ? "text-amber-600" :
                  passwordStrength < 90 ? "text-blue-600" : "text-emerald-600"
                }`}>
                  {getStrengthText(passwordStrength)}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getStrengthColor(passwordStrength)} rounded-full transition-all duration-500`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
              
              {/* Requirements */}
              <div className="space-y-2 mt-4">
                {requirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {req.met ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <X className="w-4 h-4 text-slate-400" />
                    )}
                    <span className={`text-sm ${req.met ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm password */}
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-slate-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onBlur={() => handleBlur('confirm')}
                className={`w-full pl-10 pr-12 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all ${
                  errors.confirm && touched.confirm
                    ? "border-rose-500"
                    : confirm && password === confirm
                    ? "border-emerald-500"
                    : "border-slate-300"
                }`}
                placeholder="Confirm your new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {errors.confirm && touched.confirm && (
              <p className="mt-2 text-sm text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.confirm}
              </p>
            )}
            
            {confirm && password === confirm && (
              <p className="mt-2 text-sm text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Passwords match
              </p>
            )}
          </div>

          {/* Security note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-800 mb-1">Security Tips</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use a unique password not used elsewhere</li>
                  <li>• Avoid personal information like birthdays</li>
                  <li>• Consider using a password manager</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || passwordStrength < 70 || password !== confirm}
            className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden group ${
              !loading && passwordStrength >= 70 && password === confirm
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                Resetting Password...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Lock className="w-5 h-5" />
                Reset Password
              </div>
            )}
          </button>

          {/* Additional info */}
          <div className="pt-4 border-t border-slate-200">
            <p className="text-center text-sm text-slate-500">
              After resetting, you'll be redirected to sign in with your new password.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;