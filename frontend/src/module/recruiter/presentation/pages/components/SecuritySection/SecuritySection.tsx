import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck } from "lucide-react";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { RecentActivity } from "./RecentActivity";

import { z } from "zod";
import { useUpdatePassword } from "../../../hooks/useUpdatePassword";
import { passwordFormSchema, type PasswordFormData } from "../../../validators/password.validator";


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
    setCurrentPassword,
    setNewPassword,
    setCofirmPassword,
    updatePassword,
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
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
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


  // ===============================
  // PASSWORD STRENGTH CALCULATION
  // ===============================
  const getPasswordStrength = (): PasswordStrength => {
    const validCount = Object.values(passwordValidation).filter(Boolean).length;
    
    if (validCount <= 2) {
      return { 
        strength: "Weak", 
        color: "text-red-500", 
        bg: "bg-red-500",
        score: validCount * 20 
      };
    }
    if (validCount <= 3) {
      return { 
        strength: "Fair", 
        color: "text-amber-500", 
        bg: "bg-amber-500",
        score: validCount * 20 
      };
    }
    if (validCount <= 4) {
      return { 
        strength: "Good", 
        color: "text-blue-500", 
        bg: "bg-blue-500",
        score: validCount * 20 
      };
    }
    return { 
      strength: "Strong", 
      color: "text-emerald-500", 
      bg: "bg-emerald-500",
      score: 100 
    };
  };

  // ===============================
  // HANDLERS
  // ===============================
  const handleFieldChange = (field: keyof PasswordFormData, value: string) => {
    switch (field) {
      case "currentPassword":
        setCurrentPassword(value);
        break;
      case "newPassword":
        setNewPassword(value);
        break;
      case "confirmPassword":
        setCofirmPassword(value);
        break;
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFieldBlur = (field: keyof PasswordFormData) => {
    switch (field) {
      case "currentPassword":
        setTouched(prev => ({ ...prev, current: true }));
        break;
      case "newPassword":
        setTouched(prev => ({ ...prev, new: true }));
        break;
      case "confirmPassword":
        setTouched(prev => ({ ...prev, confirm: true }));
        break;
    }
  };

  const handleSubmit = async () => {
    const { isValid, errors: validationErrors } = validateForm();
    
    if (!isValid) {
      setErrors(validationErrors);
      setTouched({
        current: true,
        new: true,
        confirm: true,
      });
      return;
    }

    const success = await updatePassword();
    if (success) {
      setErrors({});
      setTouched({
        current: false,
        new: false,
        confirm: false,
      });
    }
  };

  const validation = validateForm();
  const strength = getPasswordStrength();

  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* MAIN SECURITY CARD */}
      <Card className="border-slate-200/50 shadow-lg overflow-hidden transition-all hover:shadow-xl">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-rose-500 via-purple-500 to-indigo-500" />

        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="h-14 w-14 rounded-xl bg-linear-to-br from-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
                <Shield className="h-7 w-7 text-white" />
              </div>
              
              {/* Title */}
              <div>
                <CardTitle className="text-2xl text-slate-900">Security Settings</CardTitle>
                <CardDescription className="text-base mt-1">
                  Manage your password and account security preferences
                </CardDescription>
              </div>
            </div>

            {/* Status Badge */}
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1.5">
              <ShieldCheck className="h-4 w-4 mr-1.5" />
              Active
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-8">
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

          <RecentActivity />
        </CardContent>
      </Card>
    </div>
  );
}