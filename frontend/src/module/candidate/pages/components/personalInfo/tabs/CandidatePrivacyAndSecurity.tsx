import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { useCandidateSecurity } from "../../../../hooks/useCandidateSecurity"; 
import { Link } from "react-router-dom";

export function CandidatePrivacyAndSecurity() {
  const {
    passwordData,
    setPasswordData,
    updatePassword,
    passwordSuccess,
    isUpdating,
    clearSuccess,
  } = useCandidateSecurity();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const pwd = passwordData.newPassword || "";

  const requirements = {
    length: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[^A-Za-z0-9]/.test(pwd),
  };

  const strength =
    (requirements.length ? 20 : 0) +
    (requirements.uppercase ? 20 : 0) +
    (requirements.lowercase ? 20 : 0) +
    (requirements.number ? 20 : 0) +
    (requirements.special ? 20 : 0);

  const passwordsMatch =
    passwordData.newPassword &&
    passwordData.newPassword === passwordData.confirmPassword;

  const isFormValid =
    passwordsMatch && strength >= 60 && passwordData.currentPassword.length > 0;

  const getStrengthInfo = () => {
    if (strength <= 20) return { label: "Very Weak", color: "text-red-600" };
    if (strength <= 40) return { label: "Weak", color: "text-orange-600" };
    if (strength <= 60) return { label: "Fair", color: "text-yellow-600" };
    if (strength <= 80) return { label: "Strong", color: "text-emerald-600" };
    return { label: "Very Strong", color: "text-green-600" };
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <section>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 rounded-2xl">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Security</h2>
            <p className="text-gray-600 mt-1">
              Keep your account safe by regularly updating your password
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 md:p-12 space-y-10">
        
            {passwordSuccess && (
              <div className="flex items-start gap-3 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700">
                <CheckCircle2 className="w-6 h-6 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-base">{passwordSuccess}</p>
                  <button
                    onClick={clearSuccess}
                    className="text-sm underline mt-2 text-emerald-600 hover:text-emerald-800"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-8">
        
              <div className="space-y-2">
                <Label
                  htmlFor="currentPassword"
                  className="text-base font-medium"
                >
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((p) => ({
                        ...p,
                        currentPassword: e.target.value,
                      }))
                    }
                    placeholder="Enter your current password"
                    autoComplete="current-password"
                    className="pr-12 py-6 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

         
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-base font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((p) => ({
                        ...p,
                        newPassword: e.target.value,
                      }))
                    }
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    className="pr-12 py-6 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

            
                {passwordData.newPassword && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={`font-semibold ${getStrengthInfo().color}`}
                      >
                        {getStrengthInfo().label}
                      </span>
                      <span className="text-gray-500 font-medium">
                        {Math.round(strength)}%
                      </span>
                    </div>
                    <Progress value={strength} className="h-2.5" />
                  </div>
                )}

          
                {passwordData.newPassword && (
                  <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
                    {[
                      { key: "length", text: "At least 8 characters" },
                      { key: "uppercase", text: "One uppercase letter (A-Z)" },
                      { key: "lowercase", text: "One lowercase letter (a-z)" },
                      { key: "number", text: "One number (0-9)" },
                      {
                        key: "special",
                        text: "One special character (@$!%*?&)",
                      },
                    ].map((req) => (
                      <li
                        key={req.key}
                        className={`flex items-center gap-2 ${
                          requirements[req.key as keyof typeof requirements]
                            ? "text-emerald-600"
                            : "text-gray-400"
                        }`}
                      >
                        {requirements[req.key as keyof typeof requirements] ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        {req.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>


              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-base font-medium"
                >
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((p) => ({
                        ...p,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Re-enter new password"
                    className={`pr-12 py-6 text-base transition-all ${
                      passwordData.confirmPassword
                        ? passwordsMatch
                          ? "border-emerald-500 focus:ring-emerald-500"
                          : "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {passwordData.confirmPassword && (
                  <p
                    className={`text-sm flex items-center gap-1.5 mt-1.5 ${
                      passwordsMatch ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {passwordsMatch ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {passwordsMatch
                      ? "Passwords match ✓"
                      : "Passwords do not match"}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline flex items-center justify-end gap-1"
              >
                Forgot your password?
              </Link>
            </div>

         
            <Button
              onClick={updatePassword}
              disabled={isUpdating || !isFormValid}
              className="w-full py-7 text-lg font-semibold bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-70"
            >
              {isUpdating ? (
                <>
                  <span className="animate-spin mr-3">
                    <svg
                      className="h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </span>
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>

            <p className="text-center text-xs text-gray-500 mt-4">
              We recommend using a password manager and changing your password
              every 6–12 months.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
