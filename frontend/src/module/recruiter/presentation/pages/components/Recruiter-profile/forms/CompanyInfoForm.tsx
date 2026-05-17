import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building,
  Users,
  Award,
  Globe,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

import type {
  FieldErrors,
  UseFormRegister,
  UseFormTrigger,
} from "react-hook-form";

interface CompanyInfoFormValues {
  companyName: string;
  companySize: number;
  industry: string;
  companyWebsite?: string;
}

interface RecruiterProfile {
  companyWebsite?: string;
}

interface CompanyInfoFormProps {
  register: UseFormRegister<CompanyInfoFormValues>;
  errors: FieldErrors<CompanyInfoFormValues>;
  trigger: UseFormTrigger<CompanyInfoFormValues>;
  isEditing: boolean;
  profile?: RecruiterProfile;
}

export function CompanyInfoForm({
  register,
  errors,
  trigger,
  isEditing,
  profile,
}: CompanyInfoFormProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        <Building className="h-5 w-5 text-indigo-500" />
        Company Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="companyName"
            className="text-sm font-medium text-slate-700"
          >
            Company Name <span className="text-red-500">*</span>
          </Label>

          <div className="relative">
            <Input
              id="companyName"
              {...register("companyName", {
                required: "Company name is required",
              })}
              disabled={!isEditing}
              onBlur={() => trigger("companyName")}
              className={`h-12 pl-11 ${
                errors.companyName
                  ? "border-red-300 focus:ring-red-500/20"
                  : "border-slate-200"
              } ${!isEditing ? "bg-slate-50" : "bg-white"}`}
              placeholder="Acme Inc."
            />

            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Building className="h-4 w-4 text-indigo-600" />
            </div>
          </div>

          {errors.companyName && (
            <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" />
              {errors.companyName.message}
            </p>
          )}
        </div>

    
        <div className="space-y-2">
          <Label
            htmlFor="companySize"
            className="text-sm font-medium text-slate-700"
          >
            Company Size <span className="text-red-500">*</span>
          </Label>

          <div className="relative">
            <Input
              id="companySize"
              type="number"
              {...register("companySize", {
                required: "Company size is required",
                min: {
                  value: 1,
                  message: "Company size must be at least 1",
                },
                valueAsNumber: true,
              })}
              disabled={!isEditing}
              onBlur={() => trigger("companySize")}
              className={`h-12 pl-11 pr-20 ${
                errors.companySize
                  ? "border-red-300 focus:ring-red-500/20"
                  : "border-slate-200"
              } ${!isEditing ? "bg-slate-50" : "bg-white"}`}
              placeholder="250"
            />

            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center pointer-events-none">
              <Users className="h-4 w-4 text-rose-600" />
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 pointer-events-none">
              employees
            </div>
          </div>

          {errors.companySize && (
            <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" />
              {errors.companySize.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="industry"
            className="text-sm font-medium text-slate-700"
          >
            Industry <span className="text-red-500">*</span>
          </Label>

          <div className="relative">
            <Input
              id="industry"
              {...register("industry", {
                required: "Industry is required",
              })}
              disabled={!isEditing}
              onBlur={() => trigger("industry")}
              className={`h-12 pl-11 ${
                errors.industry
                  ? "border-red-300 focus:ring-red-500/20"
                  : "border-slate-200"
              } ${!isEditing ? "bg-slate-50" : "bg-white"}`}
              placeholder="Software Development, Healthcare, Finance..."
            />

            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center pointer-events-none">
              <Award className="h-4 w-4 text-emerald-600" />
            </div>
          </div>

          {errors.industry && (
            <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" />
              {errors.industry.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="companyWebsite"
            className="text-sm font-medium text-slate-700"
          >
            Company Website
          </Label>

          <div className="relative">
            <Input
              id="companyWebsite"
              type="url"
              {...register("companyWebsite")}
              disabled={!isEditing}
              onBlur={() => trigger("companyWebsite")}
              className={`h-12 pl-11 ${
                errors.companyWebsite
                  ? "border-red-300 focus:ring-red-500/20"
                  : "border-slate-200"
              } ${!isEditing ? "bg-slate-50" : "bg-white"}`}
              placeholder="https://company.com"
            />

            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center">
              <Globe className="h-4 w-4 text-sky-600" />
            </div>

            {profile?.companyWebsite && !isEditing && (
              <a
                href={profile.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          {errors.companyWebsite && (
            <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" />
              {errors.companyWebsite.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
