"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
  Loader2,
  Mail,
  Calendar,
  Linkedin,
  Award,
  Upload,
  CheckCircle,
  XCircle,
  ChevronRight,
} from "lucide-react";

import type { CandidateProfile } from "@/module/candidate/domain/entities/candidateProfile";
import type { ProfileFormData } from "../../validators/profileValidation";
import type { ProfileStats } from "./PersonalInfoTab";

export interface ProfileCardProps {
  profile: CandidateProfile;
  isEditing: boolean;

  editData: Partial<ProfileFormData>;
  stats: ProfileStats;

  onInputChange: <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K]
  ) => void;

  // ✅ FIX — accept email
  onVerifyEmail: (email: string) => void;

  onImageUpload: (file: File) => Promise<void>;

  loading: boolean;
  imagePreview: string | null;
  isUploading: boolean;
}

export function ProfileCard({
  profile,
  isEditing,
  editData,
  stats,
  onInputChange,
  onVerifyEmail,
  onImageUpload,
  loading,
  imagePreview,
  isUploading,
}: ProfileCardProps) {
  /**
   * Get initials for avatar fallback
   */
  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  /**
   * Profile status helpers
   */
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

  /**
   * Email to verify (edited or profile)
   */
  const emailToVerify = editData.email ?? profile.email;

  return (
    <Card className="border-0 shadow-xl bg-linear-to-br from-white to-blue-50/50 backdrop-blur-sm hover:shadow-2xl transition-all">
      <CardContent className="p-6">
        {/* Avatar */}
        <div className="relative mb-6">
          <div className="relative w-32 h-32 mx-auto group">
            <Avatar className="h-full w-full ring-4 ring-blue-500/20 shadow-xl">
              {imagePreview || profile.profileImage ? (
                <AvatarImage
                  src={imagePreview || profile.profileImage}
                  alt={profile.fullName}
                  className="object-cover"
                />
              ) : null}

              <AvatarFallback className="bg-blue-600 text-white text-3xl font-bold">
                {getInitials(profile.fullName)}
              </AvatarFallback>
            </Avatar>

            {(isUploading || loading) && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}

            {isEditing && !isUploading && !loading && (
              <label className="absolute -bottom-2 -right-2 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700">
                <Upload className="h-4 w-4 text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onImageUpload(file);
                  }}
                />
              </label>
            )}
          </div>

          {/* Name */}
          <div className="text-center mt-4 space-y-2">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? (
                <Input
                  value={editData.fullName ?? profile.fullName}
                  onChange={(e) =>
                    onInputChange("fullName", e.target.value)
                  }
                  className="text-center"
                  disabled={loading}
                />
              ) : (
                profile.fullName
              )}
            </h2>

            <Badge
              className={`border px-3 py-1 ${
                profile.emailVerified
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
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

        {/* Progress */}
        <div className="mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Profile Status</span>
            <span
              className={`text-sm font-semibold ${getStatusColor(
                stats.completionPercentage
              )}`}
            >
              {stats.completionPercentage}% —{" "}
              {getStatusText(stats.completionPercentage)}
            </span>
          </div>

          <Progress value={stats.completionPercentage} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Stat label="Years Experience" value={stats.experienceYears}>
            <Calendar className="h-6 w-6 text-blue-600" />
          </Stat>

          <Stat label="Skills" value={stats.skillsCount}>
            <Award className="h-6 w-6 text-blue-600" />
          </Stat>
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <div className="p-3 rounded-xl border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium truncate">
                  {profile.email}
                </p>
              </div>

              {!profile.emailVerified && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onVerifyEmail(emailToVerify)}
                  disabled={loading}
                >
                  Verify
                </Button>
              )}
            </div>
          </div>

          {profile.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border flex items-center gap-3 hover:bg-blue-50"
            >
              <Linkedin className="h-4 w-4 text-[#0A66C2]" />
              <span className="text-sm">View LinkedIn</span>
              <ChevronRight className="h-3 w-3 ml-auto" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Small stat component
 */
function Stat({
  children,
  value,
  label,
}: {
  children: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="p-4 rounded-xl border text-center">
      <div className="flex justify-center mb-2">{children}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
}
