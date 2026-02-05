import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  User,
  Mail,
  Calendar,
  Linkedin,
  Award,
  Upload,
  CheckCircle,
  XCircle,
  Shield,
  Bell,
  Lock,
  ChevronRight,
} from "lucide-react";
import type { CandidateProfile } from "../../domain/entities/candidateProfile";
import { GetCandidateUc, updateCandidateUc } from "../di/candidate";
import CandidateSidebar from "@/components/sidebar/candidateSidebar";
import { toast } from "sonner";
import { PersonalInfoForm } from "@/pages/candidate/profileSetting/PersonalInfoForm";
import { SecuritySection } from "@/module/recruiter/presentation/pages/profileSeting/SecuritySection";
import { NotificationsSection } from "@/module/recruiter/presentation/pages/profileSeting/NotificationsSection";
import { PrivacySection } from "@/pages/candidate/profileSetting/PrivacySection";

export interface CandidateProfileResponse {
  user: {
    fullName: string;
    email: string;
    profileImage?: string;
    emailVerified?: boolean;
  };
  candidateProfile: CandidateProfile;
  profileCompleted?: boolean;
}

interface ProfileStats {
  experienceYears: number;
  skillsCount: number;
  completionPercentage: number;
}

function ProfileCard({
  profile,
  isEditing,
  editData,
  onInputChange,
  onVerifyEmail,
  emailVerificationSent,
  onImageUpload,
  loading,
  stats,
}: {
  profile: CandidateProfile;
  isEditing: boolean;
  editData: Partial<CandidateProfile>;
  onInputChange: <K extends keyof CandidateProfile>(
    key: K,
    value: CandidateProfile[K],
  ) => void;
  onVerifyEmail: () => void;
  emailVerificationSent: boolean;
  onImageUpload: (file: File) => Promise<void>;
  loading: boolean;
  stats: ProfileStats;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Size validation
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    // Type validation
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, WebP, GIF)");
      return;
    }

    setIsUploading(true);
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
          toast.success("Image selected. Save to update.");
        }
      };
      reader.onerror = () => {
        toast.error("Failed to read image file");
      };
      reader.readAsDataURL(file);

      // Call the upload handler with File
      await onImageUpload(file);
    } catch (error) {
      toast.error("Failed to process image");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter((n) => n.length > 0)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-amber-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusText = (percentage: number) => {
    if (percentage === 100) return "Complete";
    if (percentage >= 90) return "Almost there";
    if (percentage >= 70) return "Good progress";
    if (percentage >= 50) return "Getting there";
    return "Needs attention";
  };

  return (
    <Card className="border-0 shadow-xl bg-linear-to-br from-white to-blue-50/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
      <CardContent className="p-6">
        {/* Profile Image */}
        <div className="relative mb-6">
          <div className="relative w-32 h-32 mx-auto group">
            <Avatar className="h-full w-full ring-4 ring-blue-500/20 shadow-xl group-hover:ring-blue-500/40 transition-all duration-300">
              {imagePreview || profile.profileImage ? (
                <AvatarImage
                  src={imagePreview || profile.profileImage}
                  className="object-cover"
                  alt={profile.fullName}
                />
              ) : null}
              <AvatarFallback className="bg-linear-to-br from-blue-600 to-blue-700 text-white text-3xl font-bold">
                {getInitials(profile.fullName)}
              </AvatarFallback>
            </Avatar>

            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}

            {isEditing && !isUploading && (
              <label className="absolute -bottom-2 -right-2 h-10 w-10 bg-linear-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center cursor-pointer hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/30 transition-all hover:scale-110 active:scale-95">
                <Upload className="h-4 w-4 text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  disabled={isUploading}
                />
              </label>
            )}
          </div>

          <div className="text-center mt-4 space-y-2">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? (
                <div className="relative">
                  <Input
                    value={editData.fullName || profile.fullName}
                    onChange={(e) => onInputChange("fullName", e.target.value)}
                    className="text-center border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Full Name"
                    disabled={loading}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ) : (
                profile.fullName
              )}
            </h2>

            <div className="flex items-center justify-center gap-2">
              <Badge
                className={`${
                  profile.emailVerified
                    ? "bg-linear-to-r from-green-100 to-green-50 text-green-800 border-green-200"
                    : "bg-linear-to-r from-amber-100 to-amber-50 text-amber-800 border-amber-200"
                } border px-3 py-1`}
              >
                {profile.emailVerified ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    Unverified
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-gray-900">
                Profile Status
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-semibold ${getStatusColor(stats.completionPercentage)}`}
              >
                {stats.completionPercentage}%
              </span>
              <span className="text-xs text-gray-500">
                {getStatusText(stats.completionPercentage)}
              </span>
            </div>
          </div>
          <div className="relative">
            <Progress
              value={stats.completionPercentage}
              className="h-2 bg-gray-100"
            />
            <div
              className="absolute top-0 h-2 bg-linear-to-r from-transparent via-white/30 to-transparent"
              style={{ width: "100%", animation: "shimmer 2s infinite" }}
            ></div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-linear-to-br from-blue-50 to-blue-100/50 p-4 rounded-xl text-center border border-blue-100 hover:border-blue-200 transition-all group">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-blue-100 to-blue-200 mb-2 group-hover:scale-110 transition-transform">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.experienceYears}
            </p>
            <p className="text-xs text-gray-600 mt-1">Years Experience</p>
          </div>
          <div className="bg-linear-to-br from-blue-50 to-blue-100/50 p-4 rounded-xl text-center border border-blue-100 hover:border-blue-200 transition-all group">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-blue-100 to-blue-200 mb-2 group-hover:scale-110 transition-transform">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.skillsCount}
            </p>
            <p className="text-xs text-gray-600 mt-1">Skills</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <div className="bg-linear-to-r from-blue-50/50 to-blue-50/30 p-3 rounded-xl border border-blue-100/50 hover:border-blue-200/50 transition-all group">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-br from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Email Address</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile.email}
                  </p>
                  {!profile.emailVerified && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={onVerifyEmail}
                      disabled={emailVerificationSent || loading}
                    >
                      {emailVerificationSent ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Sent
                        </>
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {profile.linkedinUrl && (
            <div className="bg-linear-to-r from-blue-50/50 to-blue-50/30 p-3 rounded-xl border border-blue-100/50 hover:border-blue-200/50 transition-all group">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-br from-[#0A66C2]/10 to-[#0A66C2]/5 group-hover:from-[#0A66C2]/20 group-hover:to-[#0A66C2]/10 transition-all">
                  <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">LinkedIn Profile</p>
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-gray-900 truncate hover:text-[#0A66C2] transition-colors flex items-center gap-1 group/link"
                  >
                    View Profile
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced validation with detailed messages
const validateField = (field: string, value: any): string => {
  switch (field) {
    case "fullName":
      if (!value || value.trim().length === 0) return "Full name is required";
      if (value.trim().length < 2)
        return "Full name must be at least 2 characters";
      if (value.length > 100)
        return "Full name must be less than 100 characters";
      return "";

    case "email":
      if (!value) return "Email is required";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value))
        return "Please enter a valid email address (e.g., name@example.com)";
      return "";

    case "experienceYears":
      if (value === undefined || value === null || value === "") return "";
      if (isNaN(Number(value))) return "Experience must be a number";
      if (value < 0) return "Experience cannot be negative";
      if (value > 50) return "Experience cannot exceed 50 years";
      return "";

    case "linkedinUrl":
      if (!value) return "";
      const linkedinRegex =
        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
      if (!linkedinRegex.test(value))
        return "Please enter a valid LinkedIn URL (e.g., linkedin.com/in/username)";
      return "";

    case "portfolioUrl":
      if (!value) return "";
      const urlRegex =
        /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
      if (!urlRegex.test(value))
        return "Please enter a valid URL (e.g., https://example.com)";
      return "";

    case "bio":
      if (!value) return "";
      if (value.length > 500) return "Bio must be less than 500 characters";
      return "";

    case "currentJob":
      if (!value) return "";
      if (value.length > 100)
        return "Job title must be less than 100 characters";
      return "";

    case "educationLevel":
      if (!value) return "";
      if (value.length > 100)
        return "Education level must be less than 100 characters";
      return "";

    case "currentJobLocation":
      if (!value) return "";
      if (value.length > 100)
        return "Location must be less than 100 characters";
      return "";

    case "gender":
      if (!value) return "";
      if (!["male", "female", "other", "prefer-not-to-say"].includes(value))
        return "Please select a valid gender option";
      return "";

    default:
      return "";
  }
};

// Calculate profile completion and stats
const calculateProfileStats = (
  profile: CandidateProfile | null,
): ProfileStats => {
  if (!profile)
    return { experienceYears: 0, skillsCount: 0, completionPercentage: 0 };

  let score = 0;
  const totalFields = 11;

  if (profile.fullName) score++;
  if (profile.email) score++;
  if (profile.currentJob) score++;
  if (profile.experienceYears !== undefined && profile.experienceYears !== null)
    score++;
  if (profile.educationLevel) score++;
  if (profile.skills && profile.skills.length > 0) score++;
  if (profile.preferredJobLocations && profile.preferredJobLocations.length > 0)
    score++;
  if (profile.currentJobLocation) score++;
  if (profile.gender) score++;
  if (profile.linkedinUrl) score++;
  if (profile.portfolioUrl) score++;

  return {
    experienceYears: profile.experienceYears || 0,
    skillsCount: profile.skills?.length || 0,
    completionPercentage: Math.round((score / totalFields) * 100),
  };
};

const transformToCandidateProfileResponse = (
  profile: CandidateProfile,
): CandidateProfileResponse => {
  return {
    user: {
      fullName: profile.fullName || "",
      email: profile.email || "",
      profileImage: profile.profileImage,
      emailVerified: profile.emailVerified,
    },
    candidateProfile: profile,
    profileCompleted: profile.profileCompleted,
  };
};

// Main Component
export default function CandidateProfilePage() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [editData, setEditData] = useState<Partial<CandidateProfile>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Personal Info");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ProfileStats>({
    experienceYears: 0,
    skillsCount: 0,
    completionPercentage: 0,
  });
  const [profileResponse, setProfileResponse] =
    useState<CandidateProfileResponse | null>(null);

  const settingsTabs = [
    { id: "Personal Info", icon: User },
    { id: "Security", icon: Shield },
    { id: "Notifications", icon: Bell },
    { id: "Privacy", icon: Lock },
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setStats(calculateProfileStats(profile));
      setProfileResponse(transformToCandidateProfileResponse(profile));
    }
  }, [profile]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await GetCandidateUc.execute();
      setProfile(data);
      setStats(calculateProfileStats(data));
      setProfileResponse(transformToCandidateProfileResponse(data));
      toast.success("Profile loaded successfully! 🎉");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load profile";
      setError(message);
      toast.error(message);
      console.error("Profile load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateAll = (): boolean => {
    const errors: Record<string, string> = {};

    Object.keys(editData).forEach((key) => {
      const error = validateField(key, editData[key as keyof CandidateProfile]);
      if (error) {
        errors[key] = error;
      }
    });

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error(
        `Please fix ${Object.keys(errors).length} error(s) before saving`,
      );
      return false;
    }

    return true;
  };

  const handleEditToggle = () => {
    if (isEditing) {
      if (Object.keys(editData).length > 0) {
        if (
          !confirm("You have unsaved changes. Are you sure you want to cancel?")
        ) {
          return;
        }
      }
      setEditData({});
      setValidationErrors({});
    } else {
      if (profile) {
        setEditData({
          fullName: profile.fullName,
          currentJob: profile.currentJob,
          experienceYears: profile.experienceYears,
          educationLevel: profile.educationLevel,
          skills: profile.skills,
          preferredJobLocations: profile.preferredJobLocations,
          currentJobLocation: profile.currentJobLocation,
          gender: profile.gender,
          linkedinUrl: profile.linkedinUrl,
          portfolioUrl: profile.portfolioUrl,
          bio: profile.bio,
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = <K extends keyof CandidateProfile>(
    key: K,
    value: CandidateProfile[K],
  ) => {
    setEditData((prev) => ({ ...prev, [key]: value }));

    // Validate on change
    const error = validateField(key, value);
    if (error) {
      setValidationErrors((prev) => ({ ...prev, [key]: error }));
    } else {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleImageUpload = async (file: File): Promise<void> => {
    try {
      // Convert file to base64 string for preview
      const reader = new FileReader();
      const imageData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Update the editData with base64 string
      handleInputChange("profileImage", imageData);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Image upload error:", error);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    if (!validateAll()) {
      return;
    }

    setLoading(true);
    try {
      const updated = profile.update(editData);
      await updateCandidateUc.execute(updated);
      setProfile(updated);
      setStats(calculateProfileStats(updated));
      setProfileResponse(transformToCandidateProfileResponse(updated));
      setIsEditing(false);
      setEditData({});
      setValidationErrors({});

      toast.success(
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle className="h-3 w-3 text-white" />
          </div>
          <span>Profile updated successfully!</span>
        </div>,
        { duration: 3000 },
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    setEmailVerificationSent(true);
    toast.info("Sending verification email...");

    // Simulate API call
    setTimeout(() => {
      toast.success("Verification email sent! Please check your inbox. 📧");
    }, 1000);
  };

  const renderTabContent = () => {
    if (activeTab === "Personal Info") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <ProfileCard
              profile={profile!}
              isEditing={isEditing}
              editData={editData}
              onInputChange={handleInputChange}
              onVerifyEmail={handleVerifyEmail}
              emailVerificationSent={emailVerificationSent}
              onImageUpload={handleImageUpload}
              loading={loading}
              stats={stats}
            />
          </div>

          {/* Right Column - Personal Info Form */}
          <div className="lg:col-span-2">
            {profileResponse && (
              <PersonalInfoForm
                profile={profileResponse}
                isEditing={isEditing}
                editData={editData}
                onInputChange={handleInputChange}
                onEditToggle={handleEditToggle}
                onSave={handleSave}
                onVerifyEmail={handleVerifyEmail}
                emailVerificationSent={emailVerificationSent}
                onImageUpload={handleImageUpload}
                loading={loading}
                validationErrors={validationErrors}
              />
            )}
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "Security":
        return <SecuritySection />;
      case "Notifications":
        return <NotificationsSection />;
      case "Privacy":
        return <PrivacySection />;
      default:
        return null;
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 absolute inset-0 m-auto" />
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">Loading your profile...</p>
            <p className="text-sm text-gray-500">
              This will just take a moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 border-0 shadow-2xl bg-linear-to-br from-white to-blue-50/50">
          <CardContent className="pt-8 pb-6 text-center">
            <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Profile Not Found
            </h3>
            <p className="text-gray-600 mb-6">
              Unable to load your profile information. Please try again.
            </p>
            <Button
              onClick={loadProfile}
              className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/20"
              size="lg"
            >
              <Loader2
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30 flex">
      {/* Sidebar */}
      <CandidateSidebar
        user={{
          fullName: profile.fullName,
          email: profile.email,
          profileImage: profile.profileImage,
        }}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Account Settings
            </h1>
            <p className="text-sm text-gray-500">
              Manage your profile and preferences
            </p>
          </div>

          <div className="flex items-center gap-4">
            {error && (
              <div className="px-4 py-2 bg-linear-to-r from-red-50 to-red-50/50 text-red-700 text-sm rounded-lg border border-red-200 animate-pulse">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-900">
                {profile.fullName}
              </p>
              <p className="text-xs text-gray-500 truncate max-w-50">
                {profile.email}
              </p>
            </div>

            <div className="relative group">
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all cursor-pointer">
                  <AvatarImage
                    src={profile.profileImage || "/default-avatar.png"}
                    alt={profile.fullName}
                  />
                  <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white font-semibold">
                    {profile.fullName
                      .split(" ")
                      .filter((n) => n.length > 0)
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {profile.emailVerified && (
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* Settings Tabs */}
          <div className="bg-gray-100/50 backdrop-blur-sm rounded-xl p-1.5 inline-flex mb-8 border border-gray-200/50">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-white text-gray-900 shadow-lg shadow-gray-200/50 border border-gray-200/30"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.id}
                </button>
              );
            })}
          </div>

          {/* Render Active Tab Content */}
          {renderTabContent()}
        </div>
      </main>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
