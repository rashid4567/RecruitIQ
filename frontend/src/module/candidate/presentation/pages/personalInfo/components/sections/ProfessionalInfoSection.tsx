import { Input } from "@/components/ui/input";
import {
  Briefcase,
  Calendar,
  GraduationCap,
  MapPin,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import type { ProfileFormData } from "@/module/candidate/presentation/validators/profileValidation";

interface ProfessionalInfoSectionProps {
  isEditing: boolean;
  profile: {
    currentJob?: string | null;
    experienceYears?: number | null;
    educationLevel?: string | null;
    currentJobLocation?: string | null;
  };
  editData: Partial<ProfileFormData>;
  validationErrors: Record<string, string>;
  onInputChange: <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K],
  ) => void;
  onFieldBlur?: (field: keyof ProfileFormData) => void;
  getFieldError?: (field: keyof ProfileFormData) => string | undefined;
  isFieldValid?: (field: keyof ProfileFormData) => boolean;
}

const educationOptions = [
  { value: "highschool", label: "High School" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelor", label: "Bachelor's" },
  { value: "master", label: "Master's" },
  { value: "phd", label: "PhD" },
];

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
  return "pl-10 h-12 border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20";
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

export function ProfessionalInfoSection({
  isEditing,
  profile,
  editData,
  onInputChange,
  onFieldBlur,
  getFieldError,
  isFieldValid,
}: ProfessionalInfoSectionProps) {
  const err = (field: keyof ProfileFormData) => getFieldError?.(field);
  const valid = (field: keyof ProfileFormData) => isFieldValid?.(field);
  const blur = (field: keyof ProfileFormData) => () => onFieldBlur?.(field);

  const handleExperienceYearsChange = (value: string): void => {
    if (value === "") {
      onInputChange("experienceYears", undefined);
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        onInputChange("experienceYears", numValue);
      }
    }
  };

  const getEducationLabel = (value?: string | null) => {
    if (!value) return "Not specified";
    return educationOptions.find((opt) => opt.value === value)?.label ?? value;
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Briefcase />}
        title="Professional Information"
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-purple-500" />
            Current Job Title
          </label>

          {isEditing ? (
            <div className="space-y-0">
              <div className="relative group">
                <Input
                  value={editData.currentJob ?? profile.currentJob ?? ""}
                  onChange={(e) => onInputChange("currentJob", e.target.value)}
                  onBlur={blur("currentJob")}
                  className={inputClass(err("currentJob"), valid("currentJob"))}
                  placeholder="e.g., Senior Software Engineer"
                  aria-invalid={!!err("currentJob")}
                  aria-describedby={
                    err("currentJob") ? "currentJob-error" : undefined
                  }
                />
                <Briefcase className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-purple-500 transition-colors pointer-events-none" />
                <TrailingIcon
                  error={err("currentJob")}
                  valid={valid("currentJob")}
                />
              </div>
              <FieldError message={err("currentJob")} />
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
              {profile.currentJob || "Not specified"}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-500" />
            Years of Experience
          </label>

          {isEditing ? (
            <div className="space-y-0">
              <div className="relative group">
                <Input
                  type="number"
                  value={
                    editData.experienceYears ?? profile.experienceYears ?? ""
                  }
                  onChange={(e) => handleExperienceYearsChange(e.target.value)}
                  onBlur={blur("experienceYears")}
                  className={inputClass(
                    err("experienceYears"),
                    valid("experienceYears"),
                  )}
                  placeholder="e.g., 5"
                  min="0"
                  max="50"
                  step="1"
                  aria-invalid={!!err("experienceYears")}
                />
                <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-purple-500 transition-colors pointer-events-none" />
                <TrailingIcon
                  error={err("experienceYears")}
                  valid={valid("experienceYears")}
                />
              </div>
              <FieldError message={err("experienceYears")} />
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
              {profile.experienceYears
                ? `${profile.experienceYears} years`
                : "Not specified"}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-purple-500" />
            Education Level
          </label>

          {isEditing ? (
            <div className="space-y-0">
              <div className="relative group">
                <select
                  value={
                    editData.educationLevel ?? profile.educationLevel ?? ""
                  }
                  onChange={(e) =>
                    onInputChange("educationLevel", e.target.value)
                  }
                  onBlur={blur("educationLevel")}
                  aria-invalid={!!err("educationLevel")}
                  className={[
                    "w-full pl-10 h-12 border rounded-md bg-white",
                    "text-slate-900 appearance-none cursor-pointer",
                    "transition-colors focus:outline-none",
                    err("educationLevel")
                      ? "border-red-400 focus:border-red-500 ring-2 ring-red-500/20"
                      : valid("educationLevel")
                        ? "border-green-400 focus:border-green-500 ring-2 ring-green-500/20"
                        : "border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
                  ].join(" ")}
                >
                  <option value="">Select education level</option>
                  {educationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <GraduationCap className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-purple-500 transition-colors pointer-events-none" />
                {err("educationLevel") && (
                  <AlertCircle className="absolute right-8 top-3.5 h-5 w-5 text-red-500 pointer-events-none" />
                )}
                {!err("educationLevel") && valid("educationLevel") && (
                  <CheckCircle2 className="absolute right-8 top-3.5 h-5 w-5 text-green-500 pointer-events-none" />
                )}
              </div>
              <FieldError message={err("educationLevel")} />
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
              {getEducationLabel(profile.educationLevel)}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-purple-500" />
            Current Location
          </label>

          {isEditing ? (
            <div className="space-y-0">
              <div className="relative group">
                <Input
                  value={
                    editData.currentJobLocation ??
                    profile.currentJobLocation ??
                    ""
                  }
                  onChange={(e) =>
                    onInputChange("currentJobLocation", e.target.value)
                  }
                  onBlur={blur("currentJobLocation")}
                  className={inputClass(
                    err("currentJobLocation"),
                    valid("currentJobLocation"),
                  )}
                  placeholder="e.g., San Francisco, CA"
                  aria-invalid={!!err("currentJobLocation")}
                />
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-purple-500 transition-colors pointer-events-none" />
                <TrailingIcon
                  error={err("currentJobLocation")}
                  valid={valid("currentJobLocation")}
                />
              </div>
              <FieldError message={err("currentJobLocation")} />
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
              {profile.currentJobLocation || "Not specified"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
