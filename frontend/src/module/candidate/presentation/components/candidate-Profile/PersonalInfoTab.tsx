import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEmailUpdate } from "../../hooks/useEmailUpdate";

import {
  User,
  Mail,
  Calendar,
  Linkedin,
  Award,
  CheckCircle,
  AlertCircle,
  Briefcase,
  MapPin,
  GraduationCap,
  Globe,
  Edit2,
  Save,
  X,
  Loader2,
  ChevronRight,
  Shield,
  Sparkles,
  Link2,
} from "lucide-react";
import { ProfileCard } from "./ProfileCard";
import { EmailVerificationModal } from "./email.update.modal";
import type { CandidateProfile } from "@/module/candidate/domain/entities/candidateProfile";
import {
  GenderEnum,
  type ProfileFormData,
} from "../../validators/profileValidation";
import { toast } from "sonner";

export interface ProfileStats {
  experienceYears: number;
  skillsCount: number;
  completionPercentage: number;
}

interface PersonalInfoTabProps {
  profile: CandidateProfile;
  stats: ProfileStats;
  isEditing: boolean;
  editData: Partial<ProfileFormData>;
  validationErrors: Record<string, string>;
  isUploading: boolean;
  imagePreview: string | null;
  onInputChange: <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K],
  ) => void;
  onVerifyEmail: () => void;
  onImageUpload: (file: File) => Promise<void>;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
  loading: boolean;
}

export function PersonalInfoTab({
  profile,
  stats,
  isEditing,
  editData,
  validationErrors,
  isUploading,
  imagePreview,
  onInputChange,
  onVerifyEmail,
  onImageUpload,
  onEditToggle,
  onSave,
  onCancel,
  loading,
}: PersonalInfoTabProps) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Add this temporarily just before the return statement
  console.log("editData.email:", editData.email);
  console.log("profile.email:", profile.email);
  console.log(
    "button disabled:",
    !editData.email || editData.email === profile.email,
  );

  const { sendOtp, verifyOtp, sendingOtp, verifyingOtp } = useEmailUpdate();
  const handleVerifyClick = async () => {
    console.log("=== handleVerifyClick CALLED ===");
    console.log("editData.email:", editData.email);
    console.log("profile.email:", profile.email);

    const currentEmail = profile.email ?? "";
    const newEmail = editData.email ?? "";

    if (!newEmail || newEmail === currentEmail) {
      console.log("BLOCKED - returning early");
      return;
    }

    console.log("Calling sendOtp with:", newEmail);
    const success = await sendOtp(newEmail);
    console.log("sendOtp success:", success);

    if (success) {
      console.log("Opening modal...");
      setIsEmailModalOpen(true);
    }
  };
  const handleSkillChange = (value: string): void => {
    const skills = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    onInputChange("skills", skills);
  };

  const educationOptions = [
    { value: "highschool", label: "High School" },
    { value: "diploma", label: "Diploma" },
    { value: "bachelor", label: "Bachelor's" },
    { value: "master", label: "Master's" },
    { value: "phd", label: "PhD" },
  ];

  const getEducationLabel = (value: string) => {
    return educationOptions.find((opt) => opt.value === value)?.label || value;
  };

  const handlePreferredLocationsChange = (value: string): void => {
    const locations = value
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    onInputChange("preferredJobLocations", locations);
  };

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

  const formatGender = (gender?: string): string => {
    if (!gender) return "Not specified";
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  const getCompletionMessage = (): string => {
    if (stats.completionPercentage === 100)
      return "Perfect! Your profile is complete 🎉";
    if (stats.completionPercentage >= 80)
      return "Almost there! Just a few more details";
    if (stats.completionPercentage >= 60) return "Good progress! Keep going";
    if (stats.completionPercentage >= 40) return "You're on the right track";
    return "Let's complete your profile";
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - Profile Card + Stats */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <ProfileCard
              profile={profile}
              isEditing={isEditing}
              editData={editData}
              stats={stats}
              onInputChange={onInputChange}
              onVerifyEmail={handleVerifyClick}
              onImageUpload={onImageUpload}
              loading={loading}
              imagePreview={imagePreview}
              isUploading={isUploading}
            />

            {/* Quick Stats Card */}
            <Card className="border border-slate-200/60 bg-white/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-slate-700">
                    Profile Strength
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Completion</span>
                    <span className="font-semibold text-slate-900">
                      {stats.completionPercentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${stats.completionPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {getCompletionMessage()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold">Personal Information</h1>
                  <p className="text-slate-300 text-sm">
                    {isEditing
                      ? "Update your details to make your profile stand out"
                      : "View and manage your professional details"}
                  </p>
                </div>
                {!isEditing && (
                  <Button
                    onClick={onEditToggle}
                    size="lg"
                    className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Main Form */}
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="p-8">
              <div className="space-y-8">
                {/* ────────────────────────────────────────────── */}
                {/* BASIC INFORMATION */}
                {/* ────────────────────────────────────────────── */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Basic Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-500" />
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      {isEditing ? (
                        <div className="relative group">
                          <Input
                            value={editData.fullName ?? profile.fullName}
                            onChange={(e) =>
                              onInputChange("fullName", e.target.value)
                            }
                            className={`pl-10 h-12 ${
                              validationErrors.fullName
                                ? "border-red-500 focus:ring-red-500/20"
                                : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            }`}
                            placeholder="Enter your full name"
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

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-500" />
                        Email Address
                      </label>

                      <div className="flex items-center gap-3">
                        {isEditing ? (
                          // EDIT MODE
                          <div className="relative group flex-1">
                            <Input
                              type="email"
                              value={editData.email ?? profile.email ?? ""}
                              onChange={(e) =>
                                onInputChange("email", e.target.value)
                              }
                              autoComplete="off"
                              className={`pl-10 h-12 ${
                                validationErrors.email
                                  ? "border-red-500 focus:ring-red-500/20"
                                  : editData.email &&
                                      editData.email !== profile.email
                                    ? "border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                    : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                              }`}
                              placeholder="Enter your email"
                            />
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors pointer-events-none" />
                            {validationErrors.email && (
                              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {validationErrors.email}
                              </p>
                            )}
                          </div>
                        ) : (
                          // VIEW MODE
                          <div className="flex-1 flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                            <span className="text-slate-900 flex-1">
                              {profile.email}
                            </span>
                            {profile.emailVerified ? (
                              <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle className="h-3 w-3" />
                                Verified
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                <AlertCircle className="h-3 w-3" />
                                Unverified
                              </span>
                            )}
                          </div>
                        )}

                        {isEditing && (
                          <Button
                            type="button"
                            onClick={handleVerifyClick}
                            disabled={false} // TEMP: force enable to test
                            className="h-12 whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {sendingOtp ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Mail className="h-4 w-4 mr-2" />
                                Verify
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Hint below input */}
                      {isEditing && (
                        <p className="text-xs flex items-center gap-1 mt-1">
                          {editData.email &&
                          editData.email !== profile.email ? (
                            <span className="text-amber-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              New email detected — click Verify to confirm
                            </span>
                          ) : (
                            <span className="text-slate-400 flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              Change your email and click Verify to update it
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-200" />

                {/* PROFESSIONAL INFORMATION */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Briefcase className="h-4 w-4 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Professional Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current Job Title */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-purple-500" />
                        Current Job Title
                      </label>
                      {isEditing ? (
                        <div className="relative group">
                          <Input
                            value={
                              editData.currentJob ?? profile.currentJob ?? ""
                            }
                            onChange={(e) =>
                              onInputChange("currentJob", e.target.value)
                            }
                            className="pl-10 h-12 border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                            placeholder="e.g., Senior Software Engineer"
                          />
                          <Briefcase className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-purple-500 transition-colors" />
                        </div>
                      ) : (
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
                          {profile.currentJob || (
                            <span className="text-slate-400">
                              Not specified
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Years of Experience */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        Years of Experience
                      </label>
                      {isEditing ? (
                        <div className="relative group">
                          <Input
                            type="number"
                            value={
                              editData.experienceYears ??
                              profile.experienceYears ??
                              ""
                            }
                            onChange={(e) =>
                              handleExperienceYearsChange(e.target.value)
                            }
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
                          {profile.experienceYears ? (
                            `${profile.experienceYears} years`
                          ) : (
                            <span className="text-slate-400">
                              Not specified
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Education Level */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-purple-500" />
                        Education Level
                      </label>
                      {isEditing ? (
                        <div className="relative group">
                          <select
                            value={
                              editData.educationLevel ??
                              profile.educationLevel ??
                              ""
                            }
                            onChange={(e) =>
                              onInputChange("educationLevel", e.target.value)
                            }
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
                          {profile.educationLevel ? (
                            getEducationLabel(profile.educationLevel)
                          ) : (
                            <span className="text-slate-400">
                              Not specified
                            </span>
                          )}
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
                            value={
                              editData.currentJobLocation ??
                              profile.currentJobLocation ??
                              ""
                            }
                            onChange={(e) =>
                              onInputChange(
                                "currentJobLocation",
                                e.target.value,
                              )
                            }
                            className="pl-10 h-12 border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                            placeholder="e.g., San Francisco, CA"
                          />
                          <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-purple-500 transition-colors" />
                        </div>
                      ) : (
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
                          {profile.currentJobLocation || (
                            <span className="text-slate-400">
                              Not specified
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-200" />

                {/* ADDITIONAL INFORMATION */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Additional Information
                    </h3>
                  </div>

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
                            onChange={(e) =>
                              handlePreferredLocationsChange(e.target.value)
                            }
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

                <Separator className="bg-slate-200" />

                {/* SOCIAL & WEB PRESENCE */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Link2 className="h-4 w-4 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Social & Web Presence
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {/* LinkedIn */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                        LinkedIn Profile
                      </label>
                      {isEditing ? (
                        <div className="relative group">
                          <Input
                            value={
                              editData.linkedinUrl ?? profile.linkedinUrl ?? ""
                            }
                            onChange={(e) =>
                              onInputChange("linkedinUrl", e.target.value)
                            }
                            className={`pl-10 h-12 ${
                              validationErrors.linkedinUrl
                                ? "border-red-500 focus:ring-red-500/20"
                                : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            }`}
                            placeholder="https://linkedin.com/in/username"
                          />
                          <Linkedin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-[#0A66C2] transition-colors" />
                          {validationErrors.linkedinUrl && (
                            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {validationErrors.linkedinUrl}
                            </p>
                          )}
                        </div>
                      ) : profile.linkedinUrl ? (
                        <a
                          href={profile.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-900 group transition-all"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Linkedin className="h-4 w-4 text-[#0A66C2] flex-shrink-0" />
                            <span className="truncate">
                              {profile.linkedinUrl}
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </a>
                      ) : (
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-400">
                          Not specified
                        </div>
                      )}
                    </div>

                    {/* Portfolio */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-indigo-500" />
                        Portfolio Website
                      </label>
                      {isEditing ? (
                        <div className="relative group">
                          <Input
                            value={
                              editData.portfolioUrl ??
                              profile.portfolioUrl ??
                              ""
                            }
                            onChange={(e) =>
                              onInputChange("portfolioUrl", e.target.value)
                            }
                            className={`pl-10 h-12 ${
                              validationErrors.portfolioUrl
                                ? "border-red-500 focus:ring-red-500/20"
                                : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            }`}
                            placeholder="https://yourportfolio.com"
                          />
                          <Globe className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                          {validationErrors.portfolioUrl && (
                            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {validationErrors.portfolioUrl}
                            </p>
                          )}
                        </div>
                      ) : profile.portfolioUrl ? (
                        <a
                          href={profile.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-900 group transition-all"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Globe className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                            <span className="truncate">
                              {profile.portfolioUrl}
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </a>
                      ) : (
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-400">
                          Not specified
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-200" />

                {/* PROFESSIONAL BIO */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Professional Bio
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {isEditing ? (
                      <div>
                        <textarea
                          value={editData.bio ?? profile.bio ?? ""}
                          onChange={(e) => onInputChange("bio", e.target.value)}
                          className={`w-full p-4 rounded-lg border min-h-[120px] resize-y ${
                            validationErrors.bio
                              ? "border-red-500 focus:ring-red-500/20"
                              : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          }`}
                          placeholder="Tell us about yourself, your experience, and what you're looking for..."
                          maxLength={500}
                        />
                        {validationErrors.bio && (
                          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {validationErrors.bio}
                          </p>
                        )}
                        <div className="flex justify-end mt-2">
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                            {(editData.bio ?? profile.bio ?? "").length}/500
                            characters
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {profile.bio || "No bio provided"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Save / Cancel buttons – only in edit mode */}
                {isEditing && (
                  <div className="flex items-center gap-4 pt-6">
                    <Button
                      onClick={onSave}
                      disabled={
                        loading || Object.keys(validationErrors).length > 0
                      }
                      size="lg"
                      className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={onCancel}
                      disabled={loading}
                      size="lg"
                      className="flex-1 h-12 border-slate-300 hover:bg-slate-100 hover:border-slate-400 transition-all"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <EmailVerificationModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        email={editData.email ?? profile.email ?? ""}
        onVerifyOtp={verifyOtp} // hook
        verifyingOtp={verifyingOtp} // hook state
      />
    </>
  );
}
