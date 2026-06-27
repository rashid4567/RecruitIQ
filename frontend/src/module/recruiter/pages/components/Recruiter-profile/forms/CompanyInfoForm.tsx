import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building,
  Users,
  Award,
  Globe,
  ExternalLink,
  AlertCircle,
  Check,
} from "lucide-react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormTrigger,
  FieldNamesMarkedBoolean,
} from "react-hook-form";
import type { RecruiterProfileFormValues } from "@/module/recruiter/types/recruiterProfileFormValues";

interface RecruiterProfile {
  companyWebsite?: string;
}

interface CompanyInfoFormProps {
  register: UseFormRegister<RecruiterProfileFormValues>;
  errors: FieldErrors<RecruiterProfileFormValues>;
  trigger: UseFormTrigger<RecruiterProfileFormValues>;
  isEditing: boolean;
  profile?: RecruiterProfile;
  touchedFields?: Partial<FieldNamesMarkedBoolean<RecruiterProfileFormValues>>;
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

export function CompanyInfoForm({
  register,
  errors,
  trigger,
  isEditing,
  profile,
  touchedFields,
}: CompanyInfoFormProps) {
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
        <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/25">
          <Building className="h-4.5 w-4.5 text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 leading-none">
            Company Information
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Helps candidates understand where you're hiring from
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Company Name */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="companyName"
              className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
            >
              Company Name{" "}
              <span className="text-red-500 normal-case tracking-normal">*</span>
            </Label>
            {errors.companyName && (
              <span className="text-red-500 text-[11px] font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.companyName.message}
              </span>
            )}
          </div>
          <div className="relative">
            <Input
              id="companyName"
              {...register("companyName", {
                required: "Company name is required",
              })}
              disabled={!isEditing}
              onBlur={() => trigger("companyName")}
              className={`${inputBase} ${
                errors.companyName
                  ? inputError
                  : isEditing
                    ? inputEnabled
                    : inputDisabled
              }`}
              placeholder="Acme Inc."
            />
            <FieldIcon
              icon={Building}
              bg="bg-indigo-50"
              color="text-indigo-600"
            />
            {touchedFields?.companyName && !errors.companyName && isEditing && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="h-3 w-3 text-emerald-600" />
              </span>
            )}
          </div>
        </div>

        {/* Team Size */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="companySize"
              className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
            >
              Team Size{" "}
              <span className="text-red-500 normal-case tracking-normal">*</span>
            </Label>
            {errors.companySize && (
              <span className="text-red-500 text-[11px] font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.companySize.message}
              </span>
            )}
          </div>
          <div className="relative">
            <Input
              id="companySize"
              type="number"
              {...register("companySize", {
                required: "Team size is required",
                min: { value: 1, message: "Must be at least 1" },
                valueAsNumber: true,
              })}
              disabled={!isEditing}
              onBlur={() => trigger("companySize")}
              className={`${inputBase} pr-24 ${
                errors.companySize
                  ? inputError
                  : isEditing
                    ? inputEnabled
                    : inputDisabled
              }`}
              placeholder="250"
            />
            <FieldIcon icon={Users} bg="bg-rose-50" color="text-rose-600" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 pointer-events-none select-none">
              employees
            </span>
          </div>
        </div>

        {/* Industry */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="industry"
              className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
            >
              Industry{" "}
              <span className="text-red-500 normal-case tracking-normal">*</span>
            </Label>
            {errors.industry && (
              <span className="text-red-500 text-[11px] font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.industry.message}
              </span>
            )}
          </div>
          <div className="relative">
            <Input
              id="industry"
              {...register("industry", {
                required: "Industry is required",
              })}
              disabled={!isEditing}
              onBlur={() => trigger("industry")}
              className={`${inputBase} ${
                errors.industry
                  ? inputError
                  : isEditing
                    ? inputEnabled
                    : inputDisabled
              }`}
              placeholder="Software Development, Healthcare, Finance…"
            />
            <FieldIcon
              icon={Award}
              bg="bg-emerald-50"
              color="text-emerald-600"
            />
            {touchedFields?.industry && !errors.industry && isEditing && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="h-3 w-3 text-emerald-600" />
              </span>
            )}
          </div>
        </div>

        {/* Company Website */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="companyWebsite"
              className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
            >
              Website
              <span className="ml-1.5 text-[10px] font-medium text-slate-400 normal-case tracking-normal">
                optional
              </span>
            </Label>
            {errors.companyWebsite && (
              <span className="text-red-500 text-[11px] font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.companyWebsite.message}
              </span>
            )}
          </div>
          <div className="relative">
            <Input
              id="companyWebsite"
              type="url"
              {...register("companyWebsite")}
              disabled={!isEditing}
              onBlur={() => trigger("companyWebsite")}
              className={`${inputBase} ${
                profile?.companyWebsite && !isEditing ? "pr-10" : ""
              } ${
                errors.companyWebsite
                  ? inputError
                  : isEditing
                    ? inputEnabled
                    : inputDisabled
              }`}
              placeholder="https://company.com"
            />
            <FieldIcon icon={Globe} bg="bg-sky-50" color="text-sky-600" />
            {profile?.companyWebsite && !isEditing && (
              <a
                href={profile.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg bg-slate-100 hover:bg-sky-100 flex items-center justify-center transition-colors group"
                title="Open website"
              >
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-sky-600" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}