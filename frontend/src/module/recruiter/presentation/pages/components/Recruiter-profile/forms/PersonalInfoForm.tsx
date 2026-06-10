import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Briefcase,
  MapPin,
  Linkedin,
  ExternalLink,
  Check,
  AlertCircle,
  Mail,
  Edit3,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  FieldErrors,
  FieldNamesMarkedBoolean,
  UseFormRegister,
} from "react-hook-form";
import type { RecruiterProfileFormValues } from "@/module/recruiter/presentation/types/recruiterProfileFormValues";

interface RecruiterProfile {
  email?: string;
  linkedinUrl?: string;
}

interface PersonalInfoFormProps {
  register: UseFormRegister<RecruiterProfileFormValues>;
  errors: FieldErrors<RecruiterProfileFormValues>;
  touchedFields: Partial<FieldNamesMarkedBoolean<RecruiterProfileFormValues>>;
  isEditing: boolean;
  profile?: RecruiterProfile;
  onUpdateEmailClick: () => void;
  currentEmail?: string;
}

function FieldIcon({
  icon: Icon,
  bg,
  color,
}: {
  icon: React.ElementType;
  bg: string;
  color: string;
}) {
  return (
    <div
      className={`absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg ${bg} flex items-center justify-center pointer-events-none`}
    >
      <Icon className={`h-4 w-4 ${color}`} />
    </div>
  );
}

export function PersonalInfoForm({
  register,
  errors,
  touchedFields,
  isEditing,
  profile,
  onUpdateEmailClick,
  currentEmail = "",
}: PersonalInfoFormProps) {
  const inputBase =
    "h-12 pl-11 text-sm font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal transition-all duration-200";
  const inputEnabled =
    "bg-white border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10";
  const inputDisabled =
    "bg-slate-50/80 border-slate-150 cursor-default text-slate-600";
  const inputError =
    "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-500/10";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/25">
          <User className="h-4.5 w-4.5 text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 leading-none">
            Personal Information
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your public recruiter identity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="fullName"
              className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
            >
              Full Name{" "}
              <span className="text-red-500 normal-case tracking-normal">*</span>
            </Label>
            {errors.fullName && (
              <span className="text-red-500 text-[11px] font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.fullName.message}
              </span>
            )}
          </div>
          <div className="relative">
            <Input
              id="fullName"
              {...register("fullName")}
              disabled={!isEditing}
              className={`${inputBase} ${
                errors.fullName
                  ? inputError
                  : isEditing
                    ? inputEnabled
                    : inputDisabled
              }`}
              placeholder="John Doe"
            />
            <FieldIcon icon={User} bg="bg-blue-50" color="text-blue-600" />
            {touchedFields.fullName && !errors.fullName && isEditing && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="h-3 w-3 text-emerald-600" />
              </span>
            )}
          </div>
        </div>

        {/* Email — read-only, changed via OTP flow */}
        <div className="space-y-1.5">
          <Label
            htmlFor="email-display"
            className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
          >
            Email Address{" "}
            <span className="text-red-500 normal-case tracking-normal">*</span>
          </Label>
          <div className="relative">
            <Input
              id="email-display"
              value={currentEmail}
              disabled
              readOnly
              className={`${inputBase} pr-24 ${inputDisabled}`}
              placeholder="you@example.com"
            />
            <FieldIcon icon={Mail} bg="bg-violet-50" color="text-violet-600" />
            <Button
              type="button"
              onClick={onUpdateEmailClick}
              disabled={!isEditing}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 text-[11px] font-semibold bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-all flex items-center gap-1.5 shadow-sm rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Edit3 className="h-3 w-3" />
              Change
            </Button>
          </div>
          <p className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
            <Info className="h-3 w-3 shrink-0" />
            OTP verification required to change email
          </p>
        </div>

        {/* Designation */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="designation"
              className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
            >
              Designation{" "}
              <span className="text-red-500 normal-case tracking-normal">*</span>
            </Label>
            {errors.designation && (
              <span className="text-red-500 text-[11px] font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.designation.message}
              </span>
            )}
          </div>
          <div className="relative">
            <Input
              id="designation"
              {...register("designation")}
              disabled={!isEditing}
              className={`${inputBase} ${
                errors.designation
                  ? inputError
                  : isEditing
                    ? inputEnabled
                    : inputDisabled
              }`}
              placeholder="Senior Technical Recruiter"
            />
            <FieldIcon
              icon={Briefcase}
              bg="bg-purple-50"
              color="text-purple-600"
            />
            {touchedFields.designation && !errors.designation && isEditing && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="h-3 w-3 text-emerald-600" />
              </span>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="location"
              className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
            >
              Location
              <span className="ml-1.5 text-[10px] font-medium text-slate-400 normal-case tracking-normal">
                optional
              </span>
            </Label>
            {errors.location && (
              <span className="text-red-500 text-[11px] font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.location.message}
              </span>
            )}
          </div>
          <div className="relative">
            <Input
              id="location"
              {...register("location")}
              disabled={!isEditing}
              className={`${inputBase} ${
                errors.location
                  ? inputError
                  : isEditing
                    ? inputEnabled
                    : inputDisabled
              }`}
              placeholder="San Francisco, CA"
            />
            <FieldIcon icon={MapPin} bg="bg-amber-50" color="text-amber-600" />
          </div>
        </div>

        {/* LinkedIn */}
        <div className="space-y-1.5 md:col-span-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="linkedinUrl"
              className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
            >
              LinkedIn Profile
              <span className="ml-1.5 text-[10px] font-medium text-slate-400 normal-case tracking-normal">
                optional
              </span>
            </Label>
            {errors.linkedinUrl && (
              <span className="text-red-500 text-[11px] font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.linkedinUrl.message}
              </span>
            )}
          </div>
          <div className="relative">
            <Input
              id="linkedinUrl"
              {...register("linkedinUrl")}
              disabled={!isEditing}
              className={`${inputBase} ${
                profile?.linkedinUrl && !isEditing ? "pr-10" : ""
              } ${
                errors.linkedinUrl
                  ? inputError
                  : isEditing
                    ? inputEnabled
                    : inputDisabled
              }`}
              placeholder="https://linkedin.com/in/yourname"
            />
            <FieldIcon
              icon={Linkedin}
              bg="bg-[#EBF4FF]"
              color="text-[#0A66C2]"
            />
            {profile?.linkedinUrl && !isEditing && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg bg-slate-100 hover:bg-blue-100 flex items-center justify-center transition-colors group"
                title="Open LinkedIn profile"
              >
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}