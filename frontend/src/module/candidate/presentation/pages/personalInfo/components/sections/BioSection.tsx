import { User, AlertCircle, CheckCircle2 } from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import type { ProfileFormData } from "@/module/candidate/presentation/validators/profileValidation";

interface BioSectionProps {
  isEditing: boolean;
  profile: {
    bio?: string | null;
  };
  editData: Partial<ProfileFormData>;
  validationErrors: Record<string, string>;
  onInputChange: <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K],
  ) => void;
  onFieldBlur: (field: keyof ProfileFormData) => void;
  getFieldError: (field: keyof ProfileFormData) => string | undefined;
  isFieldValid: (field: keyof ProfileFormData) => boolean;
}

const MAX_BIO_LENGTH = 500;

export function BioSection({
  isEditing,
  profile,
  editData,
  onInputChange,
  onFieldBlur,
  getFieldError,
  isFieldValid,
}: BioSectionProps) {
  const currentValue = editData.bio ?? profile.bio ?? "";
  const charCount = currentValue.length;
  const remaining = MAX_BIO_LENGTH - charCount;

  const error = getFieldError("bio");
  const valid = isFieldValid("bio");

  const textareaClass = [
    "w-full p-4 rounded-lg border min-h-[120px] resize-y transition-colors",
    "focus:outline-none focus:ring-2",
    error
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
      : valid
        ? "border-green-400 focus:border-green-500 focus:ring-green-500/20"
        : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20",
  ].join(" ");

  const counterClass = [
    "text-xs px-2 py-1 rounded-full",
    remaining < 20
      ? "text-red-600 bg-red-50"
      : remaining < 80
        ? "text-amber-600 bg-amber-50"
        : "text-slate-400 bg-slate-100",
  ].join(" ");

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<User />}
        title="Professional Bio"
        iconBgColor="bg-emerald-100"
        iconColor="text-emerald-600"
      />

      <div className="space-y-2">
        {isEditing ? (
          <div className="space-y-1.5">
            {/* Textarea */}
            <div className="relative">
              <textarea
                value={currentValue}
                onChange={(e) => onInputChange("bio", e.target.value)}
                onBlur={() => onFieldBlur("bio")}
                className={textareaClass}
                placeholder="Tell us about yourself, your experience, and what you're looking for..."
                maxLength={MAX_BIO_LENGTH}
                aria-invalid={!!error}
                aria-describedby={error ? "bio-error" : undefined}
              />

              {error && (
                <AlertCircle className="absolute top-3 right-3 h-4 w-4 text-red-500 pointer-events-none" />
              )}
              {!error && valid && (
                <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-green-500 pointer-events-none" />
              )}
            </div>

            <div className="flex items-center justify-between">
              {error ? (
                <p
                  id="bio-error"
                  className="flex items-center gap-1 text-xs text-red-500 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {error}
                </p>
              ) : (
                <span />
              )}

              <span className={counterClass}>
                {charCount}/{MAX_BIO_LENGTH}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
            {profile.bio || (
              <span className="text-slate-400 italic">No bio provided</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
