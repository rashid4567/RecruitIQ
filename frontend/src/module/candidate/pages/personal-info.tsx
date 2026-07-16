import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Bell } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
    <div className="min-h-screen bg-slate-50/70 flex">
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
                <Card className="rounded-2xl border shadow-sm">
                  <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                    <Avatar className="h-14 w-14 sm:h-16 sm:w-16 shrink-0">
                      <AvatarImage
                        src={profile.profileImage ?? undefined}
                        alt={profile.fullName}
                      />
                      <AvatarFallback className="bg-linear-to-br from-blue-600 to-cyan-500 text-white font-bold">
                        {getInitials(profile.fullName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 truncate">
                        {profile.fullName}
                      </p>
                      {profile.currentJob && (
                        <p className="text-sm text-muted-foreground truncate">
                          {profile.currentJob}
                        </p>
                      )}
                      {completion !== undefined && (
                        <div className="flex items-center gap-2 mt-2 max-w-xs">
                          <Progress value={completion} className="h-1.5" />
                          <span className="text-xs font-medium text-muted-foreground shrink-0">
                            {completion}% complete
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <TabsList className="h-auto w-full justify-start bg-muted/60 overflow-x-auto p-1 rounded-full gap-1">
                  {settingsTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="gap-2 rounded-full px-3 sm:px-4 h-10 shrink-0"
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
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      {
                        settingsTabs.find((t) => t.value === "personal-info")
                          ?.description
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>
                      {
                        settingsTabs.find((t) => t.value === "security")
                          ?.description
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CandidatePrivacyAndSecurity />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="notifications"
                className="mt-0 focus-visible:outline-none"
              >
                <Card className="rounded-2xl border shadow-sm">
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      {
                        settingsTabs.find((t) => t.value === "notifications")
                          ?.description
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
