import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { getError } from "@/utils/getError";
import { authService } from "@/services/auth/auth.service";

const validatePassword = (password: string) => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (!/[A-Za-z]/.test(password)) {
    errors.push("Password must contain at least one letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  // Optional: Add more validations
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("For better security, add a special character");
  }

  return errors;
};

const validateForm = (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  const errors: { field: string; message: string }[] = [];

  // Current password validation
  if (!currentPassword.trim()) {
    errors.push({
      field: "currentPassword",
      message: "Current password is required",
    });
  }

  // New password validation
  if (!newPassword.trim()) {
    errors.push({
      field: "newPassword",
      message: "New password is required",
    });
  } else {
    const newPasswordErrors = validatePassword(newPassword);
    if (newPasswordErrors.length > 0) {
      newPasswordErrors.forEach((error) => {
        errors.push({ field: "newPassword", message: error });
      });
    }
  }

  // Confirm password validation
  if (!confirmPassword.trim()) {
    errors.push({
      field: "confirmPassword",
      message: "Please confirm your new password",
    });
  } else if (newPassword !== confirmPassword) {
    errors.push({
      field: "confirmPassword",
      message: "Passwords do not match",
    });
  }

  // Check if new password is same as current
  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.push({
      field: "newPassword",
      message: "New password must be different from current password",
    });
  }

  return errors;
};

export function SecuritySection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    { field: string; message: string }[]
  >([]);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

    return Math.min(strength, 5); // Max 5
  };

  // Get password strength color and label
  const getPasswordStrengthInfo = (strength: number) => {
    const levels = [
      { label: "Very Weak", color: "bg-red-500" },
      { label: "Weak", color: "bg-orange-500" },
      { label: "Fair", color: "bg-yellow-500" },
      { label: "Good", color: "bg-blue-500" },
      { label: "Strong", color: "bg-green-500" },
    ];
    return levels[strength] || levels[0];
  };

  // Handle new password change
  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
    
    // Clear validation errors for this field
    setValidationErrors((prev) =>
      prev.filter((error) => error.field !== "newPassword")
    );
  };

  // Get field-specific validation errors
  const getFieldErrors = (field: string) => {
    return validationErrors
      .filter((error) => error.field === field)
      .map((error) => error.message);
  };

  const handleChangePassword = async () => {
    // Clear previous validation errors
    setValidationErrors([]);

    // Validate form
    const errors = validateForm(currentPassword, newPassword, confirmPassword);

    if (errors.length > 0) {
      setValidationErrors(errors);
      
      // Show first error as toast
      if (errors[0]) {
        toast.error(errors[0].message);
      }
      return;
    }

    // Additional security validations
    const commonPasswords = [
      "password123",
      "12345678",
      "qwerty123",
      "letmein123",
      "admin123",
    ];
    
    if (commonPasswords.includes(newPassword.toLowerCase())) {
      toast.error("Password is too common. Please choose a more unique password.");
      return;
    }

    if (newPassword.includes("password")) {
      toast.error("Avoid using 'password' in your password");
      return;
    }

    if (passwordStrength < 3) {
      toast.error("Please choose a stronger password");
      return;
    }

    try {
      setLoading(true);
      toast.loading("Updating password...");

      await authService.updatePassword({
        currentPassword,
        newPassword,
      });
      
      toast.dismiss();
      toast.success("Password changed successfully!", {
        description: "Your password has been updated. Please log in again with your new password.",
        duration: 5000,
      });

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStrength(0);
      setValidationErrors([]);
    } catch (err: unknown) {
      toast.dismiss();
      const errorMessage = getError(err);
      
      // Handle specific error cases
      if (errorMessage.toLowerCase().includes("current password") || 
          errorMessage.toLowerCase().includes("incorrect password")) {
        toast.error("Current password is incorrect");
        setValidationErrors([
          ...validationErrors,
          { field: "currentPassword", message: "Incorrect current password" }
        ]);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if form is valid for enabling submit button
  const isFormValid = () => {
    return (
      currentPassword.trim() !== "" &&
      newPassword.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      newPassword === confirmPassword &&
      validatePassword(newPassword).length === 0 &&
      currentPassword !== newPassword &&
      passwordStrength >= 3
    );
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
        <p className="text-sm text-gray-500">
          Manage your password and security preferences
        </p>
      </div>
      <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Account Security
            </h3>
            <p className="text-sm text-gray-500">
              Protect your account with strong security measures
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-linear-to-br from-blue-50/50 to-blue-100/30 rounded-xl border border-blue-100/50">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-4">
                Change Password
              </h4>
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label
                      htmlFor="currentPassword"
                      className="text-sm font-medium text-gray-700"
                    >
                      Current Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        setValidationErrors((prev) =>
                          prev.filter((error) => error.field !== "currentPassword")
                        );
                      }}
                      placeholder="Enter current password"
                      className={`bg-white border-gray-200 mt-1 ${
                        getFieldErrors("currentPassword").length > 0
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    />
                  </div>
                  {getFieldErrors("currentPassword").map((error, index) => (
                    <p key={index} className="text-xs text-red-500 mt-1">
                      {error}
                    </p>
                  ))}
                </div>

                {/* New Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label
                      htmlFor="newPassword"
                      className="text-sm font-medium text-gray-700"
                    >
                      New Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => handleNewPasswordChange(e.target.value)}
                      placeholder="Enter new password"
                      className={`bg-white border-gray-200 mt-1 ${
                        getFieldErrors("newPassword").length > 0
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    />
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Password Strength:</span>
                        <span className={`font-medium ${
                          passwordStrength >= 4 ? "text-green-600" :
                          passwordStrength >= 3 ? "text-blue-600" :
                          passwordStrength >= 2 ? "text-yellow-600" :
                          "text-red-600"
                        }`}>
                          {getPasswordStrengthInfo(passwordStrength).label}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full ${
                              level <= passwordStrength
                                ? getPasswordStrengthInfo(passwordStrength).color
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Password Requirements */}
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      Password must contain:
                    </p>
                    <ul className="text-xs text-gray-500 space-y-0.5">
                      <li className={`flex items-center gap-1 ${newPassword.length >= 8 ? "text-green-600" : ""}`}>
                        <span className={`h-1 w-1 rounded-full ${newPassword.length >= 8 ? "bg-green-600" : "bg-gray-300"}`} />
                        At least 8 characters
                      </li>
                      <li className={`flex items-center gap-1 ${/[A-Za-z]/.test(newPassword) ? "text-green-600" : ""}`}>
                        <span className={`h-1 w-1 rounded-full ${/[A-Za-z]/.test(newPassword) ? "bg-green-600" : "bg-gray-300"}`} />
                        At least one letter
                      </li>
                      <li className={`flex items-center gap-1 ${/\d/.test(newPassword) ? "text-green-600" : ""}`}>
                        <span className={`h-1 w-1 rounded-full ${/\d/.test(newPassword) ? "bg-green-600" : "bg-gray-300"}`} />
                        At least one number
                      </li>
                      <li className={`flex items-center gap-1 ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "text-green-600" : ""}`}>
                        <span className={`h-1 w-1 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "bg-green-600" : "bg-gray-300"}`} />
                        Special character (optional but recommended)
                      </li>
                    </ul>
                  </div>

                  {getFieldErrors("newPassword").map((error, index) => (
                    <p key={index} className="text-xs text-red-500 mt-1">
                      {error}
                    </p>
                  ))}
                </div>

                {/* Confirm New Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700"
                    >
                      Confirm New Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setValidationErrors((prev) =>
                          prev.filter((error) => error.field !== "confirmPassword")
                        );
                      }}
                      placeholder="Confirm new password"
                      className={`bg-white border-gray-200 mt-1 ${
                        getFieldErrors("confirmPassword").length > 0
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    />
                  </div>
                  {getFieldErrors("confirmPassword").map((error, index) => (
                    <p key={index} className="text-xs text-red-500 mt-1">
                      {error}
                    </p>
                  ))}
                  {confirmPassword && newPassword && confirmPassword === newPassword && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Passwords match
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleChangePassword}
                  disabled={loading || !isFormValid()}
                  className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating Password...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </div>
          </div>

        
        
          <div className="p-6 bg-linear-to-br from-amber-50/50 to-amber-100/30 rounded-xl border border-amber-100/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Active Sessions</h4>
                <p className="text-sm text-gray-500">
                  Manage active sessions across devices
                </p>
              </div>
              <Button
                variant="outline"
                className="border-gray-200 hover:border-gray-300"
              >
                View Sessions
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Current Session</p>
                  <p className="text-xs text-gray-500">
                    Chrome • Windows • Just now
                  </p>
                </div>
                <span className="text-xs text-emerald-600 font-medium">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">iPhone 13 Pro</p>
                  <p className="text-xs text-gray-500">
                    Safari • iOS • 2 hours ago
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  Revoke
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}