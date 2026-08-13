import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Bell, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import CandidateSidebar from "@/module/candidate/pages/components/personalInfo/shared/candidateSidebar.tsx";
import { CandidatePrivacyAndSecurity } from "./components/personalInfo/tabs/CandidatePrivacyAndSecurity.tsx";
import { NotificationsSection } from "./NotificationsSection.tsx";
import { PersonalInfoTab } from "./PersonalInfoTab.tsx";
import { Header } from "./components/personalInfo/common/Header.tsx";
import { LoadingState } from "./components/personalInfo/common/LoadingState.tsx";
import { ErrorState } from "./components/personalInfo/common/ErrorState.tsx";

import { useCandidateProfile } from "../hooks/useCandidateProfile.ts";
import { useProfileEdit } from "../hooks/useProfileEdit.ts";
import { useProfileStats } from "../hooks/useProfileStats.ts";

import {
  validateProfileField,
  validateProfileForm,
  type ProfileFormData,
} from "../validators/profileValidation.ts";

const settingsTabs = [
  {
    value: "personal-info",
    label: "Personal Info",
    shortLabel: "Personal",
    icon: User,
    description:
      "Everything recruiters can see: your details, skills, bio and preferences",
  },
  {
    value: "security",
    label: "Security",
    shortLabel: "Security",
    icon: Shield,
    description: "Password, sessions and login methods",
  },
  {
    value: "notifications",
    label: "Notifications",
    shortLabel: "Notify",
    icon: Bell,
    description: "Email, in-app and job alert preferences",
  },
] as const;

type TabValue = (typeof settingsTabs)[number]["value"];

function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Small circular completion ring — replaces the flat progress bar */
function CompletionRing({ value }: { value: number }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative h-12 w-12 shrink-0">
      <svg viewBox="0 0 48 48" className="h-12 w-12 -rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-slate-200"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-teal-600 transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-slate-700">
        {value}%
      </span>
    </div>
  );
}

export default function CandidateProfilePage() {
  const [activeTab, setActiveTab] = useState<TabValue>("personal-info");

  const { profile, loading, isUpdating, error, loadProfile, updateProfile } =
    useCandidateProfile();

  const stats = useProfileStats(profile);

  const {
    isEditing,
    editData,
    validationErrors,
    startEdit,
    cancelEdit,
    updateField,
    touchField,
    getFieldError,
    isFieldValid,
    setValidationErrors,
  } = useProfileEdit(profile);

  const handleInputChange = useCallback(
    <K extends keyof ProfileFormData>(key: K, value: ProfileFormData[K]) => {
      updateField(key, value);
      const fieldError = validateProfileField(key, value);
      setValidationErrors((prev) => ({
        ...prev,
        [key]: fieldError || undefined,
      }));
    },
    [updateField, setValidationErrors],
  );

  const validateAllWithZod = useCallback((): boolean => {
    if (!profile) return false;

    const merged = {
      fullName: editData.fullName ?? profile.fullName,
      email: editData.email ?? profile.email,
      currentJob: editData.currentJob ?? profile.currentJob,
      experienceYears:
        editData.experienceYears ?? profile.experienceYears ?? undefined,
      educationLevel: editData.educationLevel ?? profile.educationLevel,
      currentJobLocation:
        editData.currentJobLocation ?? profile.currentJobLocation,
      gender: editData.gender ?? profile.gender,
      linkedinUrl: editData.linkedinUrl ?? profile.linkedinUrl ?? "",
      portfolioUrl: editData.portfolioUrl ?? profile.portfolioUrl ?? "",
      bio: editData.bio ?? profile.bio ?? "",
      skills: editData.skills ?? profile.skills ?? [],
      preferredJobLocations:
        editData.preferredJobLocations ?? profile.preferredJobLocations ?? [],
    };

    const result = validateProfileForm(merged);

    if (!result.success) {
      const errors: Partial<Record<keyof ProfileFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ProfileFormData;
        if (!errors[path]) errors[path] = issue.message;
      });
      setValidationErrors(errors);
      toast.error("Please fix the validation errors before saving.");
      return false;
    }

    setValidationErrors({});
    return true;
  }, [editData, profile, setValidationErrors]);

  const handleSave = useCallback(async () => {
    if (!profile || isUpdating) return;
    if (!validateAllWithZod()) return;

    try {
      const updatedProfile = {
        ...profile,
        ...editData,
      };

      await updateProfile(updatedProfile);
      cancelEdit();

      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  }, [
    profile,
    isUpdating,
    editData,
    validateAllWithZod,
    updateProfile,
    cancelEdit,
  ]);

  if (loading && !profile) return <LoadingState />;
  if (!profile) return <ErrorState onRetry={loadProfile} loading={loading} />;

  const completion =
    typeof stats?.completionPercentage === "number"
      ? stats.completionPercentage
      : undefined;

  const activeTabMeta = settingsTabs.find((t) => t.value === activeTab);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white flex">
      <div className="hidden lg:block">
        <CandidateSidebar
          user={{
            fullName: profile.fullName,
            email: profile.email,
            profileImage: profile.profileImage,
          }}
        />
      </div>

      <main className="flex-1 flex flex-col min-h-0">
        <Header profile={profile} error={error} onRetry={loadProfile} />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-5 lg:py-8 space-y-5 sm:space-y-6 lg:space-y-8">
            <div>
              <h1 className="text-2xl sm:text-[1.75rem] lg:text-[2rem] font-bold tracking-tight text-slate-900">
                Profile Settings
              </h1>
              <p className="text-sm sm:text-[15px] lg:text-base text-muted-foreground mt-1">
                Manage your account, privacy and notifications
              </p>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as TabValue)}
              className="space-y-5 sm:space-y-6 lg:space-y-8"
            >
              <div
                className={cn(
                  "sticky top-0 z-10 -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-10",
                  "px-4 sm:px-6 lg:px-8 xl:px-10 pb-4 pt-1",
                  "bg-slate-50/90 backdrop-blur-sm space-y-4",
                )}
              >
                <Card className="rounded-2xl border shadow-sm overflow-hidden">
                  <div className="h-1.5 w-full bg-linear-to-r from-teal-500 via-cyan-500 to-blue-500" />
                  <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                    <div className="relative shrink-0">
                      <Avatar className="h-14 w-14 sm:h-16 sm:w-16 ring-2 ring-white shadow-sm">
                        <AvatarImage
                          src={profile.profileImage ?? undefined}
                          alt={profile.fullName}
                        />
                        <AvatarFallback className="bg-linear-to-br from-teal-600 to-blue-600 text-white font-bold">
                          {getInitials(profile.fullName)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 truncate">
                        {profile.fullName}
                      </p>
                      {profile.currentJob && (
                        <p className="text-sm text-muted-foreground truncate">
                          {profile.currentJob}
                        </p>
                      )}
                      {completion !== undefined && completion < 100 && (
                        <p className="text-xs text-teal-700 mt-1.5 inline-flex items-center gap-1 font-medium">
                          <Sparkles className="h-3 w-3" />
                          Finish your profile to get noticed by recruiters
                        </p>
                      )}
                      {completion === 100 && (
                        <p className="text-xs text-emerald-700 mt-1.5 font-medium">
                          Profile complete
                        </p>
                      )}
                    </div>

                    {completion !== undefined && (
                      <CompletionRing value={completion} />
                    )}
                  </CardContent>
                </Card>

                <TabsList className="h-auto w-full justify-start bg-slate-100 overflow-x-auto p-1 rounded-full gap-1">
                  {settingsTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={cn(
                          "gap-2 rounded-full px-3 sm:px-4 h-10 shrink-0 transition-colors",
                          "data-[state=active]:bg-slate-900 data-[state=active]:text-white",
                          "data-[state=active]:shadow-md",
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="hidden sm:inline lg:hidden">
                          {tab.shortLabel}
                        </span>
                        <span className="hidden lg:inline">{tab.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              <TabsContent
                value="personal-info"
                className="mt-0 focus-visible:outline-none"
              >
                <Card className="rounded-2xl border shadow-sm">
                  <CardHeader className="border-b bg-slate-50/60 rounded-t-2xl">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                        <User className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                          {
                            settingsTabs.find(
                              (t) => t.value === "personal-info",
                            )?.description
                          }
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <PersonalInfoTab
                      profile={profile}
                      stats={stats}
                      isEditing={isEditing}
                      editData={editData}
                      validationErrors={validationErrors}
                      onInputChange={handleInputChange}
                      onFieldBlur={touchField}
                      getFieldError={getFieldError}
                      isFieldValid={isFieldValid}
                      onEditToggle={startEdit}
                      onSave={handleSave}
                      onCancel={cancelEdit}
                      loading={isUpdating}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="security"
                className="mt-0 focus-visible:outline-none"
              >
                <Card className="rounded-2xl border shadow-sm">
                  <CardHeader className="border-b bg-slate-50/60 rounded-t-2xl">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                        <Shield className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>
                          {
                            settingsTabs.find((t) => t.value === "security")
                              ?.description
                          }
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <CandidatePrivacyAndSecurity />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="notifications"
                className="mt-0 focus-visible:outline-none"
              >
                <Card className="rounded-2xl border shadow-sm">
                  <CardHeader className="border-b bg-slate-50/60 rounded-t-2xl">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                        <Bell className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>
                          {
                            settingsTabs.find(
                              (t) => t.value === "notifications",
                            )?.description
                          }
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <NotificationsSection />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <span className="sr-only">{activeTabMeta?.description}</span>
          </div>
        </div>
      </main>
    </div>
  );
}