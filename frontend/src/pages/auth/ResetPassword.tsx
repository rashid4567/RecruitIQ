import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../../services/auth/auth.service";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, CheckCircle, ShieldAlert, Loader2 } from "lucide-react";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  
  const navigate = useNavigate();

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setValidatingToken(false);
        return;
      }
      
      try {
        // You might want to add a token validation API call here
        // await authService.validateResetToken(token);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      } catch (error) {
        toast.error("Invalid or expired reset link", {
          description: "Please request a new password reset link.",
        });
      } finally {
        setValidatingToken(false);
      }
    };
    
    validateToken();
  }, [token]);

  // Password strength checker
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);

  const validateForm = () => {
    const newErrors: { password?: string; confirm?: string } = {};
    
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Include at least one uppercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Include at least one number";
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      newErrors.password = "Include at least one special character";
    }
    
    if (password !== confirm) {
      newErrors.confirm = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 50) return "bg-red-500";
    if (strength < 75) return "bg-amber-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength < 50) return "Weak";
    if (strength < 75) return "Fair";
    return "Strong";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      await authService.resetPassword(token!, password);
      toast.success("Password reset successful!", {
        description: "You can now sign in with your new password.",
        duration: 5000,
        action: {
          label: "Sign In",
          onClick: () => navigate("/signin"),
        },
      });
      
      // Show success state briefly before redirect
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error: any) {
      toast.error("Reset failed", {
        description: error.message || "Please try requesting a new reset link.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
  };

  const handleConfirmChange = (value: string) => {
    setConfirm(value);
    if (errors.confirm) setErrors(prev => ({ ...prev, confirm: undefined }));
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h1>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              Request New Reset Link
            </button>
            <button
              onClick={() => navigate("/signin")}
              className="w-full mt-3 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Set New Password
            </h1>
            <p className="text-gray-600">
              Create a strong password to secure your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Enter new password"
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {password && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength < 50 ? "text-red-600" :
                      passwordStrength < 75 ? "text-amber-600" : "text-green-600"
                    }`}>
                      {getStrengthText(passwordStrength)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStrengthColor(passwordStrength)} transition-all duration-300`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <span className="mr-1">⚠</span>
                  {errors.password}
                </p>
              )}
              
              <ul className="text-xs text-gray-600 space-y-1 mt-2">
                <li className={`flex items-center ${password.length >= 8 ? "text-green-600" : ""}`}>
                  <CheckCircle className="h-3 w-3 mr-2" />
                  At least 8 characters
                </li>
                <li className={`flex items-center ${/[A-Z]/.test(password) ? "text-green-600" : ""}`}>
                  <CheckCircle className="h-3 w-3 mr-2" />
                  One uppercase letter
                </li>
                <li className={`flex items-center ${/[0-9]/.test(password) ? "text-green-600" : ""}`}>
                  <CheckCircle className="h-3 w-3 mr-2" />
                  One number
                </li>
                <li className={`flex items-center ${/[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""}`}>
                  <CheckCircle className="h-3 w-3 mr-2" />
                  One special character
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm" className="text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => handleConfirmChange(e.target.value)}
                  placeholder="Confirm your new password"
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    errors.confirm ? "border-red-300" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirm && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <span className="mr-1">⚠</span>
                  {errors.confirm}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Updating Password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Security Tip:</strong> Don't reuse passwords across different sites.
                Consider using a password manager for better security.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/signin")}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center mx-auto"
            >
              ← Back to Sign In
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            By resetting your password, you agree to our{" "}
            <a href="/terms" className="text-gray-600 hover:text-gray-800 underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-gray-600 hover:text-gray-800 underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;