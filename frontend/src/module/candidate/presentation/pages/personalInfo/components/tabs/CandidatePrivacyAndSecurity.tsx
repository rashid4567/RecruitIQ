
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
} from "lucide-react";
import { useState, useEffect } from "react";
import { useCandidateSecurity } from "../../../../hooks/useCandidateSecurity";

export function CandidatePrivacyAndSecurity() {
  const {

    passwordData,
    setPasswordData,
    updatePassword,

    passwordSuccess,
    isUpdating,
  } = useCandidateSecurity();

  // Local state for visibility (per field is better UX)
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password strength calculation (simple but effective)
  const [strength, setStrength] = useState(0); // 0–100
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    const pwd = passwordData.newPassword || "";
    const hasLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

    setRequirements({
      length: hasLength,
      uppercase: hasUpper,
      lowercase: hasLower,
      number: hasNumber,
      special: hasSpecial,
    });

    const score =
      (hasLength ? 20 : 0) +
      (hasUpper ? 20 : 0) +
      (hasLower ? 20 : 0) +
      (hasNumber ? 20 : 0) +
      (hasSpecial ? 20 : 0);

    setStrength(score);
  }, [passwordData.newPassword]);

  const passwordsMatch =
    passwordData.newPassword &&
    passwordData.newPassword === passwordData.confirmPassword;

  const getStrengthColor = () => {
    if (strength <= 20) return "text-red-500";
    if (strength <= 60) return "text-orange-500";
    if (strength <= 80) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-12">
      {/* SECURITY SECTION */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <Lock className="w-7 h-7 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Security</h2>
        </div>
        <p className="text-gray-600 mb-8">
          Keep your account secure by updating your password regularly.
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-8 md:p-10 space-y-8">
            {/* Messages */}
            

            {passwordSuccess && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
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
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showCurrent ? "Hide password" : "Show password"}
                  >
                    {showCurrent ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
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
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showNew ? "Hide password" : "Show password"}
                  >
                    {showNew ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Strength indicator */}
                {passwordData.newPassword && (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-medium ${getStrengthColor()}`}>
                        {strength <= 20
                          ? "Very weak"
                          : strength <= 40
                          ? "Weak"
                          : strength <= 60
                          ? "Fair"
                          : strength <= 80
                          ? "Strong"
                          : "Very strong"}
                      </span>
                      <span className="text-gray-500">
                        {Math.round(strength)}%
                      </span>
                    </div>
                    <Progress value={strength} className="h-2" />
                  </div>
                )}

                {/* Requirements checklist */}
                {passwordData.newPassword && (
                  <ul className="text-xs space-y-1.5 mt-3 pl-1">
                    {[
                      { key: "length", text: "At least 8 characters" },
                      { key: "uppercase", text: "One uppercase letter" },
                      { key: "lowercase", text: "One lowercase letter" },
                      { key: "number", text: "One number" },
                      { key: "special", text: "One special character" },
                    ].map((req) => (
                      <li
                        key={req.key}
                        className={`flex items-center gap-2 ${
                          requirements[req.key as keyof typeof requirements]
                            ? "text-green-600"
                            : "text-gray-500"
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
                    placeholder="••••••••"
                    className={`pr-11 ${
                      passwordData.confirmPassword
                        ? passwordsMatch
                          ? "border-green-500 focus:ring-green-500"
                          : "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {passwordData.confirmPassword && (
                  <p
                    className={`text-xs mt-1.5 ${
                      passwordsMatch ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {passwordsMatch ? "Passwords match ✓" : "Passwords do not match"}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={updatePassword}
              disabled={isUpdating || !passwordsMatch || strength < 60}
              className="w-full py-6 text-base font-medium bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              {isUpdating ? (
                <>
                  <span className="animate-spin mr-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-4">
              We recommend using a password manager and changing your password
              every 6–12 months.
            </p>
          </div>
        </div>
      </section>

      {/* You can add Privacy section later in similar style */}
    </div>
  );
}