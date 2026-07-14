import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Info, ShieldCheck, Loader2, CheckCircle, XCircle } from "lucide-react";
import { PasswordField } from "@/module/recruiter/pages/components/SecuritySection/PasswordField";
import { PasswordStrength } from "@/module/recruiter/pages/components/SecuritySection/PasswordStrength"; 
import { SecurityTips } from "../../SecuritySection/SecurityTips";
import type { PasswordFormData } from "@/module/recruiter/validators/password.validator";

interface ChangePasswordFormProps {
  formData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  validation: {
    isValid: boolean;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    passwordValidation: {
      length: boolean;
      uppercase: boolean;
      lowercase: boolean;
      number: boolean;
      special: boolean;
    };
  };
  strength: {
    strength: "Weak" | "Fair" | "Good" | "Strong";
    color: string;
    bg: string;
    score: number;
  };
  loading: boolean;
  onFieldChange: (field: keyof PasswordFormData, value: string) => void;
  onFieldBlur: (field: keyof PasswordFormData) => void;
  onSubmit: () => void;
}

export function ChangePasswordForm({
  formData,
  validation,
  strength,
  loading,
  onFieldChange,
  onFieldBlur,
  onSubmit,
}: ChangePasswordFormProps) {
  const { currentPassword, newPassword, confirmPassword } = formData;
  const { errors, touched, passwordValidation } = validation;

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center">
          <ShieldCheck className="h-4 w-4 text-rose-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          Change Password
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN - Password Fields */}
        <div className="space-y-5">
          <PasswordField
            id="current-password"
            label="Current Password"
            value={currentPassword}
            onChange={(value) => onFieldChange("currentPassword", value)}
            onBlur={() => onFieldBlur("currentPassword")}
            placeholder="Enter current password"
            error={errors.currentPassword}
            touched={touched.current}
            disabled={loading}
            required
            icon="lock"
          />

          <PasswordField
            id="new-password"
            label="New Password"
            value={newPassword}
            onChange={(value) => onFieldChange("newPassword", value)}
            onBlur={() => onFieldBlur("newPassword")}
            placeholder="Create a strong new password"
            error={errors.newPassword}
            touched={touched.new}
            disabled={loading}
            required
            icon="key"
          />

          <PasswordField
            id="confirm-password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(value) => onFieldChange("confirmPassword", value)}
            onBlur={() => onFieldBlur("confirmPassword")}
            placeholder="Re-enter new password"
            error={errors.confirmPassword}
            touched={touched.confirm}
            disabled={loading}
            required
            icon="shield"
          />

          {/* Password Match Indicator - Improved */}
          {confirmPassword && newPassword && (
            <div className="flex items-center gap-2 text-sm mt-1">
              {passwordsMatch ? (
                <>
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-600 font-medium">Passwords match ✓</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-red-600 font-medium">Passwords do not match</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Password Requirements & Tips */}
        <div className="space-y-4">
          {newPassword && (
            <PasswordStrength 
              validation={passwordValidation} 
              strength={strength} 
            />
          )}
          <SecurityTips />
        </div>
      </div>

      <Separator className="my-4" />

      {/* Action Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Info className="h-4 w-4" />
          <span>Use a strong, unique password</span>
        </div>

        <Button
          onClick={onSubmit}
          disabled={loading || !validation.isValid}
          className="h-12 px-10 gap-3 bg-linear-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white shadow-lg shadow-rose-500/25 hover:shadow-xl transition-all disabled:opacity-70 w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Updating Password...
            </>
          ) : (
            <>
              <ShieldCheck className="h-5 w-5" />
              Update Password
            </>
          )}
        </Button>
      </div>
    </div>
  );
}