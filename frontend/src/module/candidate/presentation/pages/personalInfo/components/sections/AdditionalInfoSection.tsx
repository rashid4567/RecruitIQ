
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Award, MapPin, AlertCircle } from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import { GenderEnum, type ProfileFormData } from '@/module/candidate/presentation/validators/profileValidation';


interface AdditionalInfoSectionProps {
  isEditing: boolean;
  profile: {
    gender?: string | null;
    skills?: string[];
    preferredJobLocations?: string[];
  };
  editData: Partial<ProfileFormData>;
  validationErrors: Record<string, string>;
  onInputChange: <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K],
  ) => void;
}

export function AdditionalInfoSection({
  isEditing,
  profile,
  editData,
  validationErrors,
  onInputChange,
}: AdditionalInfoSectionProps) {
  const handleSkillChange = (value: string): void => {
    const skills = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    onInputChange("skills", skills);
  };

  const handlePreferredLocationsChange = (value: string): void => {
    const locations = value
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    onInputChange("preferredJobLocations", locations);
  };

  const handleGenderChange = (value: string): void => {
    if (value === "") {
      onInputChange("gender", undefined);
    } else {
      const genderValue = value as "male" | "female" | "other";
      const result = GenderEnum.safeParse(genderValue);
      if (result.success) {
        onInputChange("gender", result.data);
      }
    }
  };

  const getSkillString = (): string => {
    if (isEditing && editData.skills) return editData.skills.join(", ");
    return profile.skills?.join(", ") || "";
  };

  const getPreferredLocationsString = (): string => {
    if (isEditing && editData.preferredJobLocations) {
      return editData.preferredJobLocations.join(", ");
    }
    return profile.preferredJobLocations?.join(", ") || "";
  };

  const getCurrentGender = (): string => {
    if (isEditing) return editData.gender ?? profile.gender ?? "";
    return profile.gender ?? "";
  };

  const formatGender = (gender?: string | null): string => {
    if (!gender) return "Not specified";
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={<User />} 
        title="Additional Information" 
        iconBgColor="bg-amber-100"
        iconColor="text-amber-600"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gender */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <User className="h-4 w-4 text-amber-500" />
            Gender
          </label>
          {isEditing ? (
            <div className="relative group">
              <select
                value={getCurrentGender()}
                onChange={(e) => handleGenderChange(e.target.value)}
                className={`w-full p-3 pl-10 h-12 rounded-lg border ${
                  validationErrors.gender
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                } bg-white appearance-none cursor-pointer`}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-amber-500 transition-colors pointer-events-none" />
              {validationErrors.gender && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.gender}
                </p>
              )}
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
              {formatGender(profile.gender)}
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            Skills
          </label>
          {isEditing ? (
            <div className="relative group">
              <Input
                value={getSkillString()}
                onChange={(e) => handleSkillChange(e.target.value)}
                className={`pl-10 h-12 ${
                  validationErrors.skills
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                }`}
                placeholder="React, TypeScript, Node.js"
              />
              <Award className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
              {validationErrors.skills && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.skills}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.skills?.length ? (
                profile.skills.map((skill, i) => (
                  <Badge
                    key={i}
                    className="bg-amber-100 text-amber-800 border-amber-200 px-3 py-1.5"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-400 w-full">
                  No skills added
                </div>
              )}
            </div>
          )}
        </div>

        {/* Preferred Job Locations */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-amber-500" />
            Preferred Job Locations
          </label>
          {isEditing ? (
            <div className="relative group">
              <Input
                value={getPreferredLocationsString()}
                onChange={(e) => handlePreferredLocationsChange(e.target.value)}
                className={`pl-10 h-12 ${
                  validationErrors.preferredJobLocations
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                }`}
                placeholder="New York, London, Remote"
              />
              <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
              {validationErrors.preferredJobLocations && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.preferredJobLocations}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.preferredJobLocations?.length ? (
                profile.preferredJobLocations.map((loc, i) => (
                  <Badge
                    key={i}
                    className="bg-purple-100 text-purple-800 border-purple-200 px-3 py-1.5"
                  >
                    {loc}
                  </Badge>
                ))
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-400 w-full">
                  No preferred locations added
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}