
import { Input } from "@/components/ui/input";
import { Briefcase, Calendar, GraduationCap, MapPin, AlertCircle } from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import type { ProfileFormData } from '@/module/candidate/presentation/validators/profileValidation';

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
}

const educationOptions = [
  { value: "highschool", label: "High School" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelor", label: "Bachelor's" },
  { value: "master", label: "Master's" },
  { value: "phd", label: "PhD" },
];

export function ProfessionalInfoSection({
  isEditing,
  profile,
  editData,
  validationErrors,
  onInputChange,
}: ProfessionalInfoSectionProps) {
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
    return educationOptions.find((opt) => opt.value === value)?.label || value;
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
            <div className="relative group">
              <Input
                value={editData.currentJob ?? profile.currentJob ?? ""}
                onChange={(e) => onInputChange("currentJob", e.target.value)}
                className="pl-10 h-12 border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                placeholder="e.g., Senior Software Engineer"
              />
              <Briefcase className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-purple-500 transition-colors" />
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
            <div className="relative group">
              <Input
                type="number"
                value={editData.experienceYears ?? profile.experienceYears ?? ""}
                onChange={(e) => handleExperienceYearsChange(e.target.value)}
                className={`pl-10 h-12 ${
                  validationErrors.experienceYears
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                }`}
                placeholder="e.g., 5"
                min="0"
                max="50"
                step="1"
              />
              <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-purple-500 transition-colors" />
              {validationErrors.experienceYears && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.experienceYears}
                </p>
              )}
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
              {profile.experienceYears ? `${profile.experienceYears} years` : "Not specified"}
            </div>
          )}
        </div>

       
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-purple-500" />
            Education Level
          </label>
          {isEditing ? (
            <div className="relative group">
              <select
                value={editData.educationLevel ?? profile.educationLevel ?? ""}
                onChange={(e) => onInputChange("educationLevel", e.target.value)}
                className="w-full pl-10 h-12 border border-slate-200 rounded-md bg-white 
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 
                  text-slate-900 appearance-none cursor-pointer"
              >
                <option value="">Select education level</option>
                {educationOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <GraduationCap className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-purple-500 transition-colors pointer-events-none" />
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
              {getEducationLabel(profile.educationLevel)}
            </div>
          )}
        </div>

        {/* Current Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-purple-500" />
            Current Location
          </label>
          {isEditing ? (
            <div className="relative group">
              <Input
                value={editData.currentJobLocation ?? profile.currentJobLocation ?? ""}
                onChange={(e) => onInputChange("currentJobLocation", e.target.value)}
                className="pl-10 h-12 border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                placeholder="e.g., San Francisco, CA"
              />
              <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-purple-500 transition-colors" />
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