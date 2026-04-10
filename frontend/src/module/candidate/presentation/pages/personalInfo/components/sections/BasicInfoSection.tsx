import { Input } from "@/components/ui/input";
import { User, Mail, AlertCircle } from "lucide-react";
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
    value: ProfileFormData[K]
  ) => void;
  onVerifyEmail: (email: string) => void;
}

export function BasicInfoSection({
  isEditing,
  profile,
  editData,
  validationErrors,
  sendingOtp = false,
  onInputChange,
  onVerifyEmail,
}: BasicInfoSectionProps) {
  const fullNameValue = editData.fullName ?? profile.fullName;
  const emailValue = editData.email ?? profile.email ?? "";

  return (
    <div className="space-y-6">
      <SectionHeader icon={<User />} title="Basic Information" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
   
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <User className="h-4 w-4 text-blue-500" />
            Full Name <span className="text-red-500">*</span>
          </label>

          {isEditing ? (
            <div className="relative group">
              <Input
                value={fullNameValue}
                onChange={(e) => onInputChange("fullName", e.target.value)}
                placeholder="Enter your full name"
                className={`pl-10 h-12 ${
                  validationErrors.fullName
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                }`}
              />

              <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />

              {validationErrors.fullName && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.fullName}
                </p>
              )}
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
            validationError={validationErrors.email}
            sendingOtp={sendingOtp}
            onEmailChange={(value) => onInputChange("email", value)}
            onVerifyClick={onVerifyEmail}
          />
        </div>
      </div>
    </div>
  );
}
