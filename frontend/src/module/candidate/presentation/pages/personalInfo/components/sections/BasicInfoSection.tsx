import { Input } from "@/components/ui/input";
import { User, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import { EmailField } from "../fields/EmailField";
import type { ProfileFormData } from "@/module/candidate/presentation/validators/profileValidation";

interface BasicInfoSectionProps {
  isEditing: boolean;
  profile: {
    fullName: string;
    email: string;
    emailVerified?: boolean;
  };
  editData: Partial<ProfileFormData>;
  validationErrors: Record<string, string>;
  sendingOtp?: boolean;
  onInputChange: <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K],
  ) => void;
  onVerifyEmail: (email: string) => void;
  onFieldBlur: (field: keyof ProfileFormData) => void;
  getFieldError: (field: keyof ProfileFormData) => string | undefined;
  isFieldValid: (field: keyof ProfileFormData) => boolean;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
      <AlertCircle className="h-3 w-3 shrink-0" />
      {message}
    </p>
  );
}

function inputClass(error?: string, valid?: boolean) {
  if (error)
    return "pl-10 h-12 border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 pr-10";
  if (valid)
    return "pl-10 h-12 border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 pr-10";
  return "pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
}

function TrailingIcon({ error, valid }: { error?: string; valid?: boolean }) {
  if (error)
    return (
      <AlertCircle className="absolute right-3 top-3.5 h-5 w-5 text-red-500 pointer-events-none" />
    );
  if (valid)
    return (
      <CheckCircle2 className="absolute right-3 top-3.5 h-5 w-5 text-green-500 pointer-events-none" />
    );
  return null;
}

export function BasicInfoSection({
  isEditing,
  profile,
  editData,
  sendingOtp = false,
  onInputChange,
  onVerifyEmail,
  onFieldBlur,
  getFieldError,
  isFieldValid,
}: BasicInfoSectionProps) {
  const fullNameValue = editData.fullName ?? profile.fullName;
  const emailValue = editData.email ?? profile.email ?? "";

  const fullNameError = getFieldError("fullName");
  const fullNameValid = isFieldValid("fullName");
  const emailError = getFieldError("email");

  return (
    <div className="space-y-6">
      <SectionHeader icon={<User />} title="Basic Information" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <User className="h-4 w-4 text-blue-500" />
            Full Name{" "}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          </label>

          {isEditing ? (
            <div className="space-y-0">
              <div className="relative group">
                <Input
                  value={fullNameValue}
                  onChange={(e) => onInputChange("fullName", e.target.value)}
                  onBlur={() => onFieldBlur("fullName")}
                  placeholder="Enter your full name"
                  className={inputClass(fullNameError, fullNameValid)}
                  aria-required
                  aria-invalid={!!fullNameError}
                  aria-describedby={
                    fullNameError ? "fullName-error" : undefined
                  }
                />
                <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors pointer-events-none" />
                <TrailingIcon error={fullNameError} valid={fullNameValid} />
              </div>
              <FieldError message={fullNameError} />
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
              {profile.fullName}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-500" />
            Email Address
          </label>

          <EmailField
            isEditing={isEditing}
            email={emailValue}
            profileEmail={profile.email}
            emailVerified={profile.emailVerified}
            validationError={emailError}
            sendingOtp={sendingOtp}
            onEmailChange={(value) => onInputChange("email", value)}
            onVerifyClick={onVerifyEmail}
            onBlur={() => onFieldBlur("email")}
          />
        </div>
      </div>
    </div>
  );
}
