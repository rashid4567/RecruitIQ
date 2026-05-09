"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck, AlertCircle } from "lucide-react";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { RecentActivity } from "./RecentActivity";

import { z } from "zod";
import { useUpdatePassword } from "../../../hooks/useUpdatePassword";
import { passwordFormSchema, type PasswordFormData } from "../../../validators/password.validator";
import { Link } from "react-router-dom";

interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

interface PasswordStrength {
  strength: "Weak" | "Fair" | "Good" | "Strong";
  color: string;
  bg: string;
  score: number;
}

export function SecuritySection() {
  const {
    currentPassword,
    newPassword,
    confirmPassword,
    loading,
    passwordSuccess,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    updatePassword,
    clearSuccess,
  } = useUpdatePassword();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    if (newPassword) {
      setPasswordValidation({
        length: newPassword.length >= 8,
        uppercase: /[A-Z]/.test(newPassword),
        lowercase: /[a-z]/.test(newPassword),
        number: /[0-9]/.test(newPassword),
        special: /[^A-Za-z0-9]/.test(newPassword),
      });
    } else {
      setPasswordValidation({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      });
    }
  }, [newPassword]);

  const validateForm = (): { isValid: boolean; errors: Record<string, string> } => {
    try {
      passwordFormSchema.parse({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as string] = err.message;
          }
        });
        return { isValid: false, errors: formattedErrors };
      }
      return { isValid: false, errors: {} };
    }
  };

  const getPasswordStrength = (): PasswordStrength => {
    const validCount = Object.values(passwordValidation).filter(Boolean).length;
    const score = Math.min(validCount * 25, 100);

    if (validCount <= 2)
      return { strength: "Weak", color: "text-red-600", bg: "bg-red-500", score };
    if (validCount <= 3)
      return { strength: "Fair", color: "text-amber-600", bg: "bg-amber-500", score };
    if (validCount <= 4)
      return { strength: "Good", color: "text-blue-600", bg: "bg-blue-500", score };
    return { strength: "Strong", color: "text-emerald-600", bg: "bg-emerald-500", score: 100 };
  };

  const handleFieldChange = (field: keyof PasswordFormData, value: string) => {
    switch (field) {
      case "currentPassword":
        setCurrentPassword(value);
        break;
      case "newPassword":
        setNewPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
    }
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFieldBlur = (field: keyof PasswordFormData) => {
    const key = field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm";
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleSubmit = async () => {
    const { isValid, errors: validationErrors } = validateForm();

    if (!isValid) {
      setErrors(validationErrors);
      setTouched({ current: true, new: true, confirm: true });
      return;
    }

    const success = await updatePassword();
    if (success) {
      setErrors({});
      setTouched({ current: false, new: false, confirm: false });
    }
  };

  const validation = validateForm();
  const strength = getPasswordStrength();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="border-slate-200/50 shadow-lg overflow-hidden transition-all hover:shadow-xl">
        {/* Top Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500" />

        <CardHeader className="pb-6 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-slate-900">Security Settings</CardTitle>
                <CardDescription className="text-base mt-1">
                  Manage your password and keep your account secure
                </CardDescription>
              </div>
            </div>

            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1.5">
              <ShieldCheck className="h-4 w-4 mr-1.5" />
              Active
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-8 space-y-8">
          {/* Success Message */}
          {passwordSuccess && (
            <div className="flex items-start gap-3 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700">
              <ShieldCheck className="w-6 h-6 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-medium">{passwordSuccess}</p>
                <button
                  onClick={clearSuccess}
                  className="text-sm underline mt-2 text-emerald-600 hover:text-emerald-800"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <ChangePasswordForm
            formData={{
              currentPassword,
              newPassword,
              confirmPassword,
            }}
            validation={{
              isValid: validation.isValid,
              errors,
              touched,
              passwordValidation,
            }}
            strength={strength}
            loading={loading}
            onFieldChange={handleFieldChange}
            onFieldBlur={handleFieldBlur}
            onSubmit={handleSubmit}
          />

          {/* Forgot Password Link - Prominently Placed */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium text-sm hover:underline transition-colors"
            >
              <AlertCircle className="h-4 w-4" />
              Forgot your password?
            </Link>
          </div>

          <RecentActivity />
        </CardContent>
      </Card>
    </div>
  );
}